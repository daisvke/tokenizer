# tokenizer

This project is designed to operate exclusively on a testnet, utilizing **Hardhat** as the development environment to facilitate the creation and testing of smart contracts. The **MultiSigWallet** contract allows for secure fund management through a multi-signature approval process, while the **d42** ERC20 token contract incorporates features like ownership management and pausable functionality.


## Technology Choices

### Using Sepolia Test Network
- **Realistic Testing Environment**: Sepolia mimics the Ethereum mainnet, enabling realistic testing of smart contracts.
- **Etherum mining**: We used <a href="https://sepolia-faucet.pk910.de/">this Sepolia faucet.</a>
It's an easy way to get Sepolia tokens without having to create an account etc.

### ERC20 Token Standard

- **Widely Adopted Standard**: ERC20 is the most common token standard on Ethereum, making it easier to find resources and community support.
- **Interoperability**: ERC20 tokens can be easily integrated with various wallets, exchanges, and dApps.
- **Simplicity**: The ERC20 standard provides a clear interface for creating tokens, ideal for beginners.

### Hardhat Development Environment

- **Local Development**: Hardhat provides a local Ethereum network for testing, making it easy to deploy and test smart contracts without incurring gas fees.
- **Built-in Tools**: It includes features like Solidity debugging and testing frameworks.
- **Community Support**: Hardhat has a strong community and extensive documentation.


## Useful commands
```bash
# For all the following commands, first go to the Node.js project folder
cd code/

# Install/uninstall module
npm install [--save-dev] module_name
npm uninstall module_name

# Publish sepolia smart contract on Etherscan.
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> 'Hello World!'

# Deploy the contract on the testnet
npx hardhat run ../deployment/deploy.js

# Run tests with the contract on the testnet
npx hardhat run ../deployment/interact.js

# Wallet information can be accessed from
https://sepolia.etherscan.io/token/<WALLET_ADDRESS>

```


## Documentation

### On how cryptocurrencies and blockchains work
- https://github.com/bitcoinbook/bitcoinbook
- https://www.imponderablethings.com/2013/07/how-bitcoin-works-under-hood.html

### Smart contract tutorial
- https://ethereum.org/fr/developers/tutorials/hello-world-smart-contract-fullstack/<br/>
but change:
	- georli to sepolia
	- 'hardhat-etherscan' to 'hardhat-verify' (https://www.npmjs.com/package/@nomiclabs/hardhat-etherscan)

### Other links
- https://eips.ethereum.org/EIPS/eip-20#methods
- https://metamask.io/download
- https://developer.metamask.io/
- https://support.infura.io/building-with-infura/javascript-typescript/infuraprovider-metamaskwalletprovider-react-ethersjs
- https://docs.ethers.org/v5/
- https://sepolia.etherscan.io/address/0x3cd47a0d60075b8d6e387449605a7d016b5ca6bd
- https://support.infura.io/building-with-infura/javascript-typescript/infuraprovider-metamaskwalletprovider-react-ethersjs
- https://docs.openzeppelin.com/contracts/5.x/erc20#constructing-an-erc20-token-contract
- https://blockchainblog.substack.com/p/how-to-create-an-erc-20-token-with
- https://medium.com/@marketing.blockchain/how-to-create-a-multisig-wallet-in-solidity-cfb759dbdb35