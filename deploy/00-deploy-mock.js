const { getNamedAccounts, deployments } = require("hardhat");
const { devlopmentChains,DECIMAL, INITIAL_ANSWER } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { firstAccount } = (await getNamedAccounts())
    const { deploy } = deployments
    console.log(`first account is ${firstAccount}`)
    console.log("this is a deploy function")

    if (devlopmentChains.includes(network.name)) {
        await deploy("MockV3Aggregator", {
            from: firstAccount,
            args: [DECIMAL, INITIAL_ANSWER],// 合约构造函数入参
            log: true
        })
    } else {
        console.log("environment is not local. mock contract deployment skipped.")
    }
}

module.exports.tags = ["all", "mock"]