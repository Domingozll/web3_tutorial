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
   
    if ( hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY ) {
        //等待5个区块确认后再做验证
        console.log("waiting for 5 confirmations")
        await fundMe.deploymentTransaction().wait(5) 
        verifyFundMe(fundMe.target,[args])
    } else {
        console.log("verification skiped.")
    }
}

async function verifyFundMe(fundMeAddr,args){
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