require("@nomicfoundation/hardhat-toolbox")
// require("dotenv").config()
require("@chainlink/env-enc").config()
// require("@nomicfoundation/hardhat-verify")

const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  // 指定部署网络
  // defaultNetwork:"hardhat",
  networks:{
    sepolia: {
      // 从Alchemy,Infura,QuickNode等服务商网站上获取url
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111
    }
  },

  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY
    }
    
  }

  
};
