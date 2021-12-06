require("dotenv").config()
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: "0.7.5",
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  networks: {
    mumbai: {
      url: process.env.RPC_URL,
      accounts: [`${process.env.ETH_PRIVATE_KEY}`]
    },
    polygon: {
      url: process.env.RPC_URL,
      accounts: [`${process.env.ETH_PRIVATE_KEY}`]
    }
  }
};
