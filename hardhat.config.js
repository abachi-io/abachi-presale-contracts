require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("solidity-coverage");

module.exports = {
  solidity: "0.7.5",
  // defaultNetwork: "mumbai",
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: process.env.ETH_PRIVATE_KEY.split(",") 
    },
    hardhat: {
      mnemonic: "list film poem peanut clinic suit order coin attend denial example parade"
    },   
    mumbai: {
      url: process.env.RPC_URL,
      accounts: process.env.ETH_PRIVATE_KEY.split(",")
    },
    polygon: {
      url: process.env.RPC_URL,
      accounts: process.env.ETH_PRIVATE_KEY.split(",")
    }
  },
};
