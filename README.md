## To start:
### Install dependencies:
```shell
yarn install
```
### Create .env file
```
ACCOUNT= // ethereum account private key
INFURA_GOERLI= // Infura api key from https://www.infura.io/
ETHERSCAN= // etherscan apikey from https://etherscan.io/ (required for smart contract verification)
INITIAL_MINT= // How many tokens will mint at first phase
```
## Try running some of the following tasks:

```shell
npx hardhat help # Command list
npx hardhat compile # Compile
npx hardhat test # Run test
REPORT_GAS=true npx hardhat test # Gas report test
npx hardhat run scripts/deploy.js # Deploy token
```
## Token deployed:
[0xfFA4455b9D783a30b795D134E470F0AFFf9992dF](https://goerli.etherscan.io/address/0xfFA4455b9D783a30b795D134E470F0AFFf9992dF#code)
[0x913581e28B3cCF3e7A83630c0E692c16f37Eeff4](https://mumbai.polygonscan.com/address/0x913581e28B3cCF3e7A83630c0E692c16f37Eeff4#code)
