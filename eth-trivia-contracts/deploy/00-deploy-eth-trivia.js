const { network, ethers } = require("hardhat")
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

const FUND_AMOUNT = ethers.utils.parseEther("1") // 1 Ether, or 1e18 (10^18) Wei

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    
    if (chainId == 31337) {
        // create VRFV2 Subscription
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait()
        subscriptionId = transactionReceipt.events[0].args.subId
        // Fund the subscription
        // Our mock makes it so we don't actually have to worry about sending fund
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }
    log("----------------------------------------------------")
    log(`Deploying Eth-Trivia from ${deployer}, and waiting for confirmations...`)

    const arguments = [
        vrfCoordinatorV2Address,
        subscriptionId,
        networkConfig[chainId]["keyHash"],
        networkConfig[chainId]["callbackGasLimit"],
        networkConfig[chainId]["entranceFeeHigh"],
        networkConfig[chainId]["entranceFeeLow"]
    ]

    const ethTrivia = await deploy("EthTrivia", {
      from: deployer,
      args: arguments,
      log: true,
      // we need to wait if on a live network so we can verify properly
      waitConfirmations: VERIFICATION_BLOCK_CONFIRMATIONS || 1,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(ethTrivia.address, [])
    }

    networkConfig[chainId]["triviaContractAddress"] = ethTrivia.address
}
  

module.exports.tags = ["all", "eth_trivia"]
  