const { ethers } = require("hardhat")

const networkConfig = {
    default: {
        vrfCoordinatorV2: "",
        subscriptionId: "",
        keyHash: "", // gasLane
        callbackGasLimit: "",
        entranceFeeHigh: ethers.utils.parseEther("0.002"),
        entranceFeeLow: ethers.utils.parseEther("0.001"),
        triviaContractAddress: ""
    },
    31337: {
        vrfCoordinatorV2: "",
        subscriptionId: "",
        keyHash: "", // gasLane
        callbackGasLimit: "",
        entranceFeeHigh: ethers.utils.parseEther("0.002"),
        entranceFeeLow: ethers.utils.parseEther("0.001"),
        triviaContractAddress: ""
    },
    5: {
        vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        subscriptionId: "",
        keyHash: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15", // gasLane
        callbackGasLimit: "500000",
        entranceFeeHigh: ethers.utils.parseEther("0.002"),
        entranceFeeLow: ethers.utils.parseEther("0.001"),
        triviaContractAddress: "" 
    },
    11155111: {
        vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
        subscriptionId: "2554",
        keyHash: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // gasLane
        callbackGasLimit: "500000",
        entranceFeeHigh: ethers.utils.parseEther("0.002"),
        entranceFeeLow: ethers.utils.parseEther("0.001"),
        triviaContractAddress: ""
    },
    1: {
        vrfCoordinatorV2: "",
        subscriptionId: "",
        keyHash: "", // gasLane
        callbackGasLimit: "",
        entranceFeeHigh: ethers.utils.parseEther("0.002"),
        entranceFeeLow: ethers.utils.parseEther("0.001"),
        triviaContractAddress: ""
    }
}

const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6
const ethtrivia_abi_location = "../eth-trivia-next-app/constants/abi.json"
const ethtrivia_address_location = "../eth-trivia-next-app/constants/networkMapping.json"

module.exports = {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    ethtrivia_abi_location,
    ethtrivia_address_location
}