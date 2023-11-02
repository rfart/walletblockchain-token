// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
require("dotenv").config()

async function main() {

  const sellon = await hre.ethers.deployContract("Sellon", [process.env.INITIAL_MINT]);

  await sellon.waitForDeployment();

  console.log(`Sellon token deployed with address: ${await sellon.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
