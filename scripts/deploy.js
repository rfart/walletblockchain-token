// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
require("dotenv").config()

async function main() {

  const bbt = await hre.ethers.deployContract("BBT", [8, process.env.MINT_TARGET, process.env.INITIAL_MINT]);

  await bbt.waitForDeployment();

  console.log(`BBT token deployed with address: ${await bbt.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
