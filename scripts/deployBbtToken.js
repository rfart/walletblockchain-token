// Deployment script for BbtToken contract
// Run with: npx hardhat run scripts/deployBbtToken.js --network <network-name>

const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("Starting BbtToken deployment...");
  
  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Token parameters
  const tokenName = process.env.TOKEN_NAME || "BabyBoomToken";
  const tokenSymbol = process.env.TOKEN_SYMBOL || "BBT";
  const totalSupply = process.env.TOTAL_SUPPLY || "1000000000"; // 1 billion tokens
  const initialOwner = process.env.INITIAL_OWNER || deployer.address;

  console.log("Token parameters:");
  console.log("- Name:", tokenName);
  console.log("- Symbol:", tokenSymbol);
  console.log("- Total Supply:", totalSupply);
  console.log("- Initial Owner:", initialOwner);

  // Deploy the BbtToken contract
  console.log("\nDeploying BbtToken...");
  const BbtToken = await hre.ethers.getContractFactory("BbtToken");
  
  const bbtToken = await BbtToken.deploy(
    tokenName,
    tokenSymbol,
    totalSupply,
    initialOwner
  );

  await bbtToken.waitForDeployment();
  const contractAddress = await bbtToken.getAddress();

  console.log("\n=== DEPLOYMENT SUCCESSFUL ===");
  console.log("BbtToken deployed to:", contractAddress);
  
  // Verify contract details
  console.log("\n=== CONTRACT VERIFICATION ===");
  try {
    const name = await bbtToken.name();
    const symbol = await bbtToken.symbol();
    const decimals = await bbtToken.decimals();
    const totalSupplyDeployed = await bbtToken.totalSupply();
    const maxSupply = await bbtToken.maxSupply();
    const owner = await bbtToken.owner();

    console.log("Name:", name);
    console.log("Symbol:", symbol);
    console.log("Decimals:", decimals);
    console.log("Total Supply:", hre.ethers.formatUnits(totalSupplyDeployed, decimals));
    console.log("Max Supply:", hre.ethers.formatUnits(maxSupply, decimals));
    console.log("Owner:", owner);
  } catch (error) {
    console.log("Error verifying contract details:", error.message);
  }

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: deployer.address,
    tokenName: tokenName,
    tokenSymbol: tokenSymbol,
    totalSupply: totalSupply,
    initialOwner: initialOwner,
    deploymentTime: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber()
  };

  console.log("\n=== DEPLOYMENT INFO ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Verification instructions
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n=== VERIFICATION COMMAND ===");
    console.log("To verify the contract on Etherscan, run:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${contractAddress} "${tokenName}" "${tokenSymbol}" "${totalSupply}" "${initialOwner}"`);
  }

  return contractAddress;
}

// Error handling
main()
  .then((contractAddress) => {
    console.log("\nDeployment completed successfully!");
    console.log("Contract Address:", contractAddress);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nDeployment failed:");
    console.error(error);
    process.exit(1);
  });
