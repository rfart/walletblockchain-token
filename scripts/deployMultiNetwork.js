// Multi-network deployment script for BbtToken
// Usage: npx hardhat run scripts/deployMultiNetwork.js --network <network>

const hre = require("hardhat");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

// Network-specific configurations
const networkConfigs = {
  hardhat: {
    name: "Hardhat Local",
    explorer: null,
    gasMultiplier: 1.0
  },
  localhost: {
    name: "Localhost",
    explorer: null,
    gasMultiplier: 1.0
  },
  goerli: {
    name: "Goerli Testnet",
    explorer: "https://goerli.etherscan.io",
    gasMultiplier: 1.2
  },
  sepolia: {
    name: "Sepolia Testnet", 
    explorer: "https://sepolia.etherscan.io",
    gasMultiplier: 1.2
  },
  bscTest: {
    name: "BSC Testnet",
    explorer: "https://testnet.bscscan.com",
    gasMultiplier: 1.1
  },
  bscMain: {
    name: "BSC Mainnet",
    explorer: "https://bscscan.com",
    gasMultiplier: 1.1
  }
};

async function deployBbtToken() {
  console.log("🚀 Starting BbtToken Multi-Network Deployment");
  console.log("================================================");
  
  const networkName = hre.network.name;
  const networkConfig = networkConfigs[networkName] || { name: networkName, explorer: null, gasMultiplier: 1.0 };
  
  console.log(`🌐 Network: ${networkConfig.name} (${networkName})`);
  
  // Get deployer
  const [deployer] = await hre.ethers.getSigners();
  const deployerBalance = await hre.ethers.provider.getBalance(deployer.address);
  
  console.log(`👤 Deployer: ${deployer.address}`);
  console.log(`💰 Balance: ${hre.ethers.formatEther(deployerBalance)} ETH`);
  
  // Validate balance for non-local networks
  if (!["hardhat", "localhost"].includes(networkName)) {
    const minBalance = hre.ethers.parseEther("0.01"); // Minimum 0.01 ETH
    if (deployerBalance < minBalance) {
      throw new Error(`Insufficient balance. Need at least 0.01 ETH, have ${hre.ethers.formatEther(deployerBalance)} ETH`);
    }
  }
  
  // Token parameters
  const tokenName = process.env.TOKEN_NAME || "BabyBoomToken";
  const tokenSymbol = process.env.TOKEN_SYMBOL || "BBT";
  const totalSupply = process.env.TOTAL_SUPPLY || "1000000000";
  const initialOwner = process.env.INITIAL_OWNER || deployer.address;
  
  console.log("\n📋 Token Configuration:");
  console.log(`   Name: ${tokenName}`);
  console.log(`   Symbol: ${tokenSymbol}`);
  console.log(`   Total Supply: ${totalSupply}`);
  console.log(`   Initial Owner: ${initialOwner}`);
  
  // Gas estimation
  console.log("\n⛽ Estimating gas costs...");
  const BbtToken = await hre.ethers.getContractFactory("BbtToken");
  
  try {
    const estimatedGas = await BbtToken.getDeployTransaction(
      tokenName,
      tokenSymbol, 
      totalSupply,
      initialOwner
    ).then(tx => tx.gasLimit);
    
    const gasPrice = await hre.ethers.provider.getFeeData().then(data => data.gasPrice);
    const estimatedCost = estimatedGas * gasPrice * BigInt(Math.floor(networkConfig.gasMultiplier * 100)) / BigInt(100);
    
    console.log(`   Estimated Gas: ${estimatedGas.toString()}`);
    console.log(`   Gas Price: ${hre.ethers.formatUnits(gasPrice, "gwei")} gwei`);
    console.log(`   Estimated Cost: ${hre.ethers.formatEther(estimatedCost)} ETH`);
  } catch (error) {
    console.log("   Could not estimate gas costs:", error.message);
  }
  
  // Deploy contract
  console.log("\n🔨 Deploying contract...");
  const deploymentStart = Date.now();
  
  const bbtToken = await BbtToken.deploy(
    tokenName,
    tokenSymbol,
    totalSupply,
    initialOwner
  );
  
  console.log("   Transaction sent, waiting for confirmation...");
  await bbtToken.waitForDeployment();
  
  const contractAddress = await bbtToken.getAddress();
  const deploymentTime = Date.now() - deploymentStart;
  
  console.log(`✅ Contract deployed in ${deploymentTime}ms`);
  console.log(`📍 Address: ${contractAddress}`);
  
  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  try {
    const [name, symbol, decimals, totalSupplyResult, maxSupply, owner] = await Promise.all([
      bbtToken.name(),
      bbtToken.symbol(), 
      bbtToken.decimals(),
      bbtToken.totalSupply(),
      bbtToken.maxSupply(),
      bbtToken.owner()
    ]);
    
    console.log("   ✅ Contract verification successful");
    console.log(`   Name: ${name}`);
    console.log(`   Symbol: ${symbol}`);
    console.log(`   Decimals: ${decimals}`);
    console.log(`   Total Supply: ${hre.ethers.formatUnits(totalSupplyResult, decimals)}`);
    console.log(`   Max Supply: ${hre.ethers.formatUnits(maxSupply, decimals)}`);
    console.log(`   Owner: ${owner}`);
  } catch (error) {
    console.log("   ❌ Contract verification failed:", error.message);
  }
  
  // Save deployment record
  const deploymentRecord = {
    network: networkName,
    networkDisplayName: networkConfig.name,
    contractAddress,
    deployer: deployer.address,
    tokenName,
    tokenSymbol,
    totalSupply,
    initialOwner,
    deploymentTime: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
    transactionHash: bbtToken.deploymentTransaction()?.hash,
    gasUsed: await bbtToken.deploymentTransaction()?.wait().then(receipt => receipt?.gasUsed?.toString()),
    explorer: networkConfig.explorer
  };
  
  // Save to deployments directory
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const deploymentFile = path.join(deploymentsDir, `${networkName}-deployment.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentRecord, null, 2));
  
  console.log(`\n💾 Deployment record saved to: ${deploymentFile}`);
  
  // Explorer links
  if (networkConfig.explorer) {
    console.log(`\n🔗 Explorer Links:`);
    console.log(`   Contract: ${networkConfig.explorer}/address/${contractAddress}`);
    if (deploymentRecord.transactionHash) {
      console.log(`   Transaction: ${networkConfig.explorer}/tx/${deploymentRecord.transactionHash}`);
    }
  }
  
  // Verification command
  if (!["hardhat", "localhost"].includes(networkName)) {
    console.log(`\n🔐 Verification Command:`);
    console.log(`npx hardhat verify --network ${networkName} ${contractAddress} "${tokenName}" "${tokenSymbol}" "${totalSupply}" "${initialOwner}"`);
  }
  
  return {
    contractAddress,
    deploymentRecord
  };
}

// Main execution
async function main() {
  try {
    const result = await deployBbtToken();
    console.log("\n🎉 Deployment completed successfully!");
    console.log(`📍 Contract Address: ${result.contractAddress}`);
    return result;
  } catch (error) {
    console.error("\n❌ Deployment failed:");
    console.error(error.message);
    if (error.reason) {
      console.error("Reason:", error.reason);
    }
    throw error;
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { deployBbtToken, main };
