# BbtToken Deployment Guide

This directory contains deployment scripts for the BbtToken contract.

## Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

## Deployment Scripts

### 1. Quick Local Deployment (`deployLocal.js`)
For quick testing on Hardhat's local network:

```bash
npx hardhat run scripts/deployLocal.js
```

Features:
- Deploys with default parameters
- Runs basic functionality tests
- No environment variables needed

### 2. Basic Deployment (`deployBbtToken.js`)
For deploying to any network with basic configuration:

```bash
# Local network
npx hardhat run scripts/deployBbtToken.js

# Testnet (e.g., Goerli)
npx hardhat run scripts/deployBbtToken.js --network goerli

# Mainnet
npx hardhat run scripts/deployBbtToken.js --network bscMain
```

Features:
- Environment variable configuration
- Contract verification
- Deployment info logging

### 3. Multi-Network Deployment (`deployMultiNetwork.js`)
Advanced deployment with network-specific configurations:

```bash
# Deploy to specific networks
npx hardhat run scripts/deployMultiNetwork.js --network sepolia
npx hardhat run scripts/deployMultiNetwork.js --network bscTest
npx hardhat run scripts/deployMultiNetwork.js --network bscMain
```

Features:
- Gas estimation
- Network-specific configurations
- Deployment records saved to `deployments/`
- Explorer links
- Comprehensive error handling

## Environment Variables

Required variables in `.env`:

```bash
# Network Configuration
INFURA_ID=your_infura_project_id
ACCOUNT=your_private_key

# Token Configuration (optional)
TOKEN_NAME=BabyBoomToken
TOKEN_SYMBOL=BBT
TOTAL_SUPPLY=1000000000
INITIAL_OWNER=0x... # Leave empty to use deployer

# API Keys for verification
ETHERSCAN=your_etherscan_api_key
```

## Network Configuration

Available networks in `hardhat.config.js`:
- `hardhat` - Local Hardhat network
- `goerli` - Goerli testnet
- `sepolia` - Sepolia testnet (uncomment in config)
- `bscTest` - BSC testnet (uncomment in config)
- `bscMain` - BSC mainnet (uncomment in config)

To enable additional networks, uncomment them in `hardhat.config.js` and add the corresponding environment variables.

## Contract Verification

After deployment, verify your contract on block explorers:

```bash
npx hardhat verify --network <network> <contract_address> "<token_name>" "<token_symbol>" "<total_supply>" "<initial_owner>"
```

Example:
```bash
npx hardhat verify --network goerli 0x123... "BabyBoomToken" "BBT" "1000000000" "0xabc..."
```

## Deployment Records

The `deployMultiNetwork.js` script saves deployment records to `deployments/<network>-deployment.json` with:
- Contract address
- Deployment transaction details
- Token configuration
- Network information
- Explorer links

## Troubleshooting

### Common Issues

1. **"remote origin already exists"**
   - This is a Git error, not related to deployment
   - Solution: Use `git remote remove origin` then add your new remote

2. **Insufficient funds**
   - Ensure your account has enough ETH/BNB for gas fees
   - Check balance with the deployment scripts

3. **Network connection issues**
   - Verify your Infura/RPC URLs
   - Check network configurations in `hardhat.config.js`

4. **Contract verification fails**
   - Ensure you have the correct API keys
   - Verify the constructor parameters match exactly

### Gas Optimization

The contract is optimized for gas efficiency with:
- Compiler optimization enabled (200 runs)
- Efficient OpenZeppelin imports
- Minimal storage usage

### Security Considerations

- Use a hardware wallet or secure key management for mainnet deployments
- Verify contract source code on block explorers
- Test thoroughly on testnets before mainnet deployment
- Consider using a multisig wallet as the initial owner for production deployments

## Contract Features

The BbtToken contract includes:
- ERC20 standard implementation
- Burnable tokens
- Permit functionality (EIP-2612)
- Pausable functionality
- Owner controls
- Maximum supply cap
- Minting capabilities (owner only)

## Examples

### Deploy to BSC Testnet
```bash
# 1. Configure .env for BSC testnet
TESTNET=https://data-seed-prebsc-1-s1.binance.org:8545/
ACCOUNT=your_private_key

# 2. Deploy
npx hardhat run scripts/deployMultiNetwork.js --network bscTest

# 3. Verify
npx hardhat verify --network bscTest <address> "BabyBoomToken" "BBT" "1000000000" "0x..."
```

### Deploy with Custom Parameters
```bash
# Set custom parameters in .env
TOKEN_NAME="My Custom Token"
TOKEN_SYMBOL="MCT"
TOTAL_SUPPLY="500000000"
INITIAL_OWNER="0x1234567890123456789012345678901234567890"

# Deploy
npx hardhat run scripts/deployBbtToken.js --network goerli
```
