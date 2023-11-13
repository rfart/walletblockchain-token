require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA}`,
      accounts: [process.env.ACCOUNT]
    },
    polygon: {
      url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA}`,
      accounts: [process.env.ACCOUNT]
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA}`,
      accounts: [process.env.ACCOUNT]
    }
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
    apiKey: process.env.POLYGONSCAN,
  },
};
