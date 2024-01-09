require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()
require("@nomicfoundation/hardhat-foundry");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_ID}`,
      accounts: [process.env.ACCOUNT]
    },
    sepolia: {
      url: process.env.SEPOLIA,
      accounts: [process.env.ACCOUNT]
    },
    bscTest: {
      url: process.env.TESTNET,
      accounts: [process.env.ACCOUNT]
    },
    bscMain: {
      url: process.env.MAINNET,
      accounts: [process.env.ACCOUNT]
    }
    // polygon: {
    //   url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA}`,
    //   accounts: [process.env.ACCOUNT]
    // },
    // mumbai: {
    //   url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA}`,
    //   accounts: [process.env.ACCOUNT]
    // }
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN,
  },
};
