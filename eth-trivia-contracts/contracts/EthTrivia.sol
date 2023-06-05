// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";


error Trivia__UpkeepNotNeeded(uint256 currentBalance, uint256 numPlayers1, uint256 numPlayers2, uint256 drawState);
error Trivia__NotASelectedParticipant();
error Trivia__RequestsMaxReached();
error Trivia__TransferFailed();


contract EthTrivia is ChainlinkClient, VRFConsumerBaseV2, AutomationCompatibleInterface, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    uint256 private constant ORACLE_PAYMENT = 1 * LINK_DIVISIBILITY; // 1 * 10**18
    uint256 public lastRetrievedInfo;

    enum DrawState {
        OPEN,
        CLOSED
    }

    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 4;

    // Lottery Variables
    uint256 private immutable i_entranceFeeHigh;
    uint256 private immutable i_entranceFeeLow;
    address payable[] private s_highChanceEntrants;
    address payable[] private s_lowChanceEntrants;
    DrawState private s_drawState;

    address private s_recentWinner1;
    address private s_recentWinner2;
    address private s_recentWinner3;
    address private s_recentWinner4;

    event RequestForInfoFulfilled(
        bytes32 indexed requestId,
        uint256 indexed response
    );

    event DrawHighChanceEntry(address indexed player);
    event DrawLowChanceEntry(address indexed player);

    event WinnersPicked(
        address winner1,
        address winner2,
        address winner3,
        address winner4
    ); 

    /**
     * @dev Check https://docs.chain.link/docs/link-token-contracts/ for LINK address for the right network
     */
    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane, // keyHash
        uint32 callbackGasLimit,
        uint256 entranceFeeHigh,
        uint256 entranceFeeLow
    ) ConfirmedOwner(msg.sender) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        i_entranceFeeHigh = entranceFeeHigh;
        i_entranceFeeLow = entranceFeeLow;
        s_drawState = DrawState.OPEN;
        setChainlinkToken(0x779877A7B0D9E8603169DdbD7836e478b4624789);
    }

    function enterHighChanceDraw() public payable {
        require(msg.value >= i_entranceFeeHigh, "Not enough value sent");
        require(s_highChanceEntrants.length <= 10, "Unable to enter, All slots filled");
        require(s_drawState == DrawState.OPEN, "Draw is closed");
        
        s_highChanceEntrants.push(payable(msg.sender));
        // Emit an event when we update a dynamic array or mapping
        emit DrawHighChanceEntry(msg.sender);
    }

    function enterLowChanceDraw() public payable {
        require(msg.value >= i_entranceFeeLow, "Not enough value sent");
        require(s_drawState == DrawState.OPEN, "Raffle is not open");
       
        s_lowChanceEntrants.push(payable(msg.sender));
        // Emit an event when we update a dynamic array or mapping
        emit DrawLowChanceEntry(msg.sender);
    }

    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        bool isOpen = DrawState.OPEN == s_drawState;
        bool hasPlayers = s_highChanceEntrants.length == 10 || s_lowChanceEntrants.length > 20;
        bool hasBalance = address(this).balance > 0;

        upkeepNeeded = (isOpen && hasBalance && hasPlayers);
        return (upkeepNeeded, "0x0"); // can we comment this out?
    }

    /**
     * @dev Once `checkUpkeep` is returning `true`, this function is called
     * and it kicks off a Chainlink VRF call to get a random winner.
     */
    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");
        // require(upkeepNeeded, "Upkeep not needed");
        if (!upkeepNeeded) {
            revert Trivia__UpkeepNotNeeded(
                address(this).balance,
                s_highChanceEntrants.length,
                s_lowChanceEntrants.length,
                uint256(s_drawState)
            );
        }
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
    }

    /**
     * @dev This is the function that Chainlink VRF node
     * calls to send the money to the random winner.
     */
    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] memory randomWords
    ) internal override {
        // s_players size 10
        // randomNumber 202
        // 202 % 10 ? what's doesn't divide evenly into 202?
        // 20 * 10 = 200
        // 2
        // 202 % 10 = 2
        uint256 indexOfWinner1 = randomWords[0] % s_highChanceEntrants.length;
        uint256 indexOfWinner2 = randomWords[1] % s_highChanceEntrants.length;
        uint256 indexOfWinner3 = randomWords[2] % s_highChanceEntrants.length;
        uint256 indexOfWinner4 = randomWords[3] % s_lowChanceEntrants.length;

        address payable recentWinner1 = s_highChanceEntrants[indexOfWinner1];
        s_recentWinner1 = recentWinner1;

        address payable recentWinner2 = s_highChanceEntrants[indexOfWinner2];
        s_recentWinner2 = recentWinner2;

        address payable recentWinner3 = s_highChanceEntrants[indexOfWinner3];
        s_recentWinner3 = recentWinner3;

        address payable recentWinner4 = s_lowChanceEntrants[indexOfWinner4];
        s_recentWinner4 = recentWinner4;


        s_highChanceEntrants = new address payable[](0);
        s_lowChanceEntrants = new address payable[](0);
        closeDraw();

        emit WinnersPicked(recentWinner1, recentWinner2, recentWinner3, recentWinner4);
    }

    function requestScores(
        string memory p_address
    ) public onlyOwner {
        address _oracle = 0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD;
        string memory _jobId = "ca98366cc7314957b8c012c72f05aeeb";
        Chainlink.Request memory req = buildOperatorRequest(
            stringToBytes32(_jobId),
            this.fulfillRequestInfo.selector
        );
        
        string memory url = "http://localhost:3000/players?wallet_address=";
        string memory queryString = string.concat(url, p_address);

        req.add("get", queryString);
        req.add("path", "0,new_score");
        req.addInt('times', 1);
        sendOperatorRequestTo(_oracle, req, ORACLE_PAYMENT);
    }

    function fulfillRequestInfo(bytes32 _requestId, uint256 _info)
        public
        recordChainlinkFulfillment(_requestId)
    {
        lastRetrievedInfo = _info;
        emit RequestForInfoFulfilled(_requestId, _info);
    }
    /*
    ========= UTILITY FUNCTIONS ==========
    */

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer Link"
        );
    }

    function stringToBytes32(string memory source)
        private
        pure
        returns (bytes32 result)
    {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            // solhint-disable-line no-inline-assembly
            result := mload(add(source, 32))
        }
    }

    function getRecentWinners() public view returns (address[4] memory) {
        return [s_recentWinner1, s_recentWinner2, s_recentWinner3, s_recentWinner4];
    }

    function transferWinnings(address player_address) public onlyOwner {
        uint256 amount = lastRetrievedInfo * 0.001 ether;
        (bool success, ) = player_address.call{value: amount}("");
        // require(success, "Transfer failed");
        if (!success) {
            revert Trivia__TransferFailed();
        }
    }

    function closeDraw() public onlyOwner {
        s_drawState = DrawState.CLOSED;
    }

    function openDraw() public onlyOwner {
        s_drawState = DrawState.OPEN;
    }

    function getDrawState() public returns (DrawState memory) {
        return s_drawState
    }
}