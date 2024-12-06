require("@nomicfoundation/hardhat-toolbox")

// 在.env中明文配置参数时使用
// require("dotenv").config()

// 在.env.enc中加密配置相关参数时使用
require("@chainlink/env-enc").config()
require("@nomicfoundation/hardhat-verify")
// require("./tasks/deploy-fundme")
// require("./tasks/interact-fundme")
// 自动加载 index.js
require("./tasks")
require("hardhat-deploy")
require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("hardhat-deploy-ethers");

const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY

// 第二个账户的私钥（暂时没有）
const PRIVATE_KEY_1 = process.env.PRIVATE_KEY_1

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  //默认部署网络
  defaultNetwork: "hardhat",
   // 指定部署网络
  networks:{
    sepolia: {
      // 从Alchemy,Infura,QuickNode等服务商网站上获取url
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY,PRIVATE_KEY_1],
      chainId: 11155111
    }
  },

  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY
    }
  },
  namedAccounts:{
    firstAccount: {
      default: 0
    },
    secondAccount: {
      default: 1
    }
  },
  mocha: {
    timeout: 300000
  },
  gasReporter: {
    enabled: true
  }
};
