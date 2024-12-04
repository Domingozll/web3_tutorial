// import ethers.js
// create main function
// execute main function

const { ethers } = require("hardhat")

async function main() {
    // create factory
    const fundMefactory = await ethers.getContractFactory("FundMe")
    console.log("contract deploying")
    // deplay contract from factory
    var args = 10
    const fundMe = await fundMefactory.deploy(args)
    fundMe.waitForDeployment()
    console.log(`contract has been deployed successfully. contract adddesss is ${fundMe.target}`)

    if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
        //等待5个区块确认后再做验证
        console.log("waiting for 5 confirmations")
        await fundMe.deploymentTransaction().wait(5)
        verifyFundMe(fundMe.target, [args])
    } else {
        console.log("verification skiped.")
    }

    // init 2 accounts
    const [firstAccount, secondAccount] = await ethers.getSigners()

    // fund contract with first account
    const fundTx = await fundMe.fund({ value: ethers.parseEther("0.5") })
    await fundTx.wait()

    console.log(`2 accounts are ${firstAccount.address} and ${secondAccount.address}`)

    // check balance of contract
    const balanceOfContract = await ethers.provider.getBalance(fundMe.target)
    console.log(`Balance of the contract is ${balanceOfContract}`)

    // fund contract with second account
    const fundTxWithSecondAccount = await fundMe.connect(secondAccount).fund({ value: ethers.parseEther("0.5") })
    await fundTxWithSecondAccount.wait()

    // check balance of contract
    const balanceOfContractAfterSecondFund = await ethers.provider.getBalance(fundMe.target)
    console.log(`Balance of the contract is ${balanceOfContractAfterSecondFund}`)

    // check mapping 
    const firstAccountbalanceInFundMe = await fundMe.fundersToAmount(firstAccount.address)
    const secondAccountbalanceInFundMe = await fundMe.fundersToAmount(secondAccount.address)
    console.log(`Balance of first account ${firstAccount.address} is ${firstAccountbalanceInFundMe}`)
    console.log(`Balance of second account ${secondAccount.address} is ${secondAccountbalanceInFundMe}`)

}

async function verifyFundMe(fundMeAddr, args) {
    //自动化验证合约 run表示执行命令行命令
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: args,
    });
}

main().then().catch((error) => {
    console.error(error)
    process.exit(0)
})