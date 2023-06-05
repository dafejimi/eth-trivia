const {
    ethtrivia_abi_location,
    ethtrivia_address_location,
    networkConfig
} = require("../helper-hardhat-config")
require("dotenv").config()
const fs = require("fs")
const { network, ethers } = require("hardhat")

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end written!")
    }
}


async function updateAbi() {
    const chainId = network.config.chainId
    const triviaAddress = networkConfig[chainId]["triviaContractAdress"]
    const triviaContract = await ethers.getContractAt("EthTrivia", triviaAddress)

    fs.writeFileSync(ethtrivia_abi_location, triviaContract.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddresses() {
    const chainId = network.config.chainId

    const triviaAddress = networkConfig[chainId]["triviaContractAddress"]
    const triviaContract = await ethers.getContractAt("EthTrivia", triviaAddress)
    
    const contractAddresses = JSON.parse(fs.readFileSync(ethtrivia_address_location, "utf8"))
    if (chainId.toString() in contractAddresses) {
        if (!contractAddresses[chainId.toString()]["triviaContractAddress"].includes(triviaContract.address)) {
            contractAddresses[chainId.toString()]["triviaContractAddress"].push(triviaContract.address)
        }
    } else {
        contractAddresses[chainId.toString()]["triviaContractAddress"] = [triviaContract.address]
    }
    fs.writeFileSync(ethtrivia_address_location, JSON.stringify(contractAddresses))
}