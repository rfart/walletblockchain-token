# Deployments Directory

This directory stores deployment records from the deployment scripts.

## File Structure

Each deployment creates a JSON file named `<network>-deployment.json` containing:

```json
{
  "network": "goerli",
  "networkDisplayName": "Goerli Testnet",
  "contractAddress": "0x...",
  "deployer": "0x...",
  "tokenName": "BabyBoomToken",
  "tokenSymbol": "BBT",
  "totalSupply": "1000000000",
  "initialOwner": "0x...",
  "deploymentTime": "2025-07-03T...",
  "blockNumber": 12345678,
  "transactionHash": "0x...",
  "gasUsed": "1234567",
  "explorer": "https://goerli.etherscan.io"
}
```

## Usage

These files are automatically created by the `deployMultiNetwork.js` script and can be used for:
- Tracking deployment history
- Contract address lookup
- Verification commands
- Integration with frontend applications

## Security Note

Deployment records are ignored by Git (see `.gitignore`) as they may contain sensitive information. Store them securely and back them up appropriately.
