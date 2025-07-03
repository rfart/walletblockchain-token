// Quick deployment script for local testing
// Usage: npx hardhat run scripts/deployLocal.js

const hre = require("hardhat");

async function main() {
  console.log("🚀 Quick Local Deployment - BbtToken");
  console.log("=====================================");
  
  // Get deployer
  const [deployer, user1] = await hre.ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);
  
  // Deploy with default parameters
  const BbtToken = await hre.ethers.getContractFactory("BbtToken");
  const bbtToken = await BbtToken.deploy(
    "BabyBoomToken",    // name
    "BBT",              // symbol  
    "1000000000",       // total supply (1 billion)
    deployer.address    // initial owner
  );
  
  await bbtToken.waitForDeployment();
  const contractAddress = await bbtToken.getAddress();
  
  console.log("✅ BbtToken deployed to:", contractAddress);
  
  // Quick verification
  const [name, symbol, decimals, totalSupply, owner] = await Promise.all([
    bbtToken.name(),
    bbtToken.symbol(),
    bbtToken.decimals(), 
    bbtToken.totalSupply(),
    bbtToken.owner()
  ]);
  
  console.log("\n📋 Contract Details:");
  console.log("   Name:", name);
  console.log("   Symbol:", symbol);
  console.log("   Decimals:", decimals);
  console.log("   Total Supply:", hre.ethers.formatUnits(totalSupply, decimals));
  console.log("   Owner:", owner);
  
  // Test basic functionality
  console.log("\n🧪 Testing basic functions...");
  
  try {
    // Check deployer balance
    const deployerBalance = await bbtToken.balanceOf(deployer.address);
    console.log("   Deployer Balance:", hre.ethers.formatUnits(deployerBalance, decimals));
    
    // Test transfer
    if (user1) {
      const transferAmount = hre.ethers.parseUnits("1000", decimals);
      await bbtToken.transfer(user1.address, transferAmount);
      const user1Balance = await bbtToken.balanceOf(user1.address);
      console.log("   Transfer to user1:", hre.ethers.formatUnits(user1Balance, decimals));
    }
    
    // Test pause/unpause
    await bbtToken.stop();
    console.log("   ✅ Contract paused successfully");
    
    await bbtToken.start();
    console.log("   ✅ Contract unpaused successfully");
    
    console.log("\n🎉 All tests passed!");
    
  } catch (error) {
    console.log("   ❌ Test failed:", error.message);
  }
  
  return contractAddress;
}

main()
  .then((address) => {
    console.log("\n✨ Local deployment completed!");
    console.log("Contract Address:", address);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
