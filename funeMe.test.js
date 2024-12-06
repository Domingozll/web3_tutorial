// const { ethers, deployments, getNamedAccounts } = require("hardhat")
// const { assert } = require("chai")

// describe("test fundme contract", async function() {
//     //在每个it被调用前执行
//     let fundMe
//     let firstAccount
//     this.beforeEach(async function(){
        
//         //调用deploy脚本部署合约
//         await deployments.fixture(["all"])
        
//         firstAccount = ( await getNamedAccounts()).firstAccount
        
//         //获取所有已经部署的合约
//         const fundMeDeployment = await deployments.get("FundMe")

//         //获取已部署的FundMe合约
//         fundMe = await ethers.getContractAt("FundMe",fundMeDeployment.address)
//     })

//     it("test if the owner is msg.sender",async function() {
//         await fundMe.waitForDeployment()
//         assert.equal(await fundMe.owner(),firstAccount)
//     })

//     it("test if dataFeed is assigned correctly",async function() {
//         await fundMe.waitForDeployment()
//         assert.equal(await fundMe.dataFeed(),"0x694AA1769357215DE4FAC081bf1f309aDC325306")
//     })
// })