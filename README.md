# tokenizer

This project is designed to operate exclusively on a testnet, utilizing **Hardhat** as the development environment to facilitate the creation and testing of smart contracts. The **MultiSigWallet** contract allows for secure fund management through a multi-signature approval process, while the **d42** ERC20 token contract incorporates features like ownership management and pausable functionality.


## Technology Choices

### Advantages of Choosing Ethereum

Ethereum is a leading blockchain platform known for its established ecosystem, smart contract functionality, and strong security. It provides a robust environment for developers, especially those new to blockchain technology.

1. **Established Ecosystem**: Ethereum has a mature infrastructure and a large developer community, offering extensive resources and support.
2. **Smart Contract Functionality**: It uses Solidity, a Turing-complete language, allowing for complex and flexible smart contracts.
3. **Strong Security**: A large network of nodes enhances security, making it resilient against attacks.
4. **Interoperability**: ERC standards ensure easy interaction between tokens and decentralized applications (dApps).
5. **Access to DeFi and NFT Markets**: Ethereum is the primary platform for decentralized finance and non-fungible tokens.
6. **Testnet Availability**: Multiple testnets, including Sepolia, allow developers to test applications without financial risk.

### ERC20 Token Standard

- **Widely Adopted Standard**: ERC20 is the most common token standard on Ethereum, making it easier to find resources and community support.
- **Interoperability**: ERC20 tokens can be easily integrated with various wallets, exchanges, and dApps.
- **Simplicity**: The ERC20 standard provides a clear interface for creating tokens, ideal for beginners.

### Hardhat Development Environment

- **Local Development**: Hardhat provides a local Ethereum network for testing, making it easy to deploy and test smart contracts without incurring gas fees.
- **Built-in Tools**: It includes features like Solidity debugging and testing frameworks.
- **Community Support**: Hardhat has a strong community and extensive documentation.

### Using Sepolia Test Network
- **Free Test Ether**: The Sepolia faucet provides free test Ether for experimentation.
- **Realistic Testing Environment**: Sepolia mimics the Ethereum mainnet, enabling realistic testing of smart contracts.
- **Etherum mining**: We used <a href="https://sepolia-faucet.pk910.de/">this Sepolia faucet.</a>
It's an easy way to get Sepolia tokens without having to create an account etc.


## Useful commands
```bash
# For all the following commands, first go to the Node.js project folder
cd code/

# Install/uninstall module
npm install [--save-dev] module_name
npm uninstall module_name

# Run a script
# Any contracts deployed to this local network will not persist across sessions
npx hardhat run path/to/script

# Publish sepolia smart contract on Etherscan.
# The verify plugin helps verifying the source code for the contracts.
# At the moment, it supports Etherscan, explorers compatible with its API like Blockscout and Sourcify.
npx hardhat verify --network sepolia "0x67f809fbde3fbdf462002e7e933525989d043cff" 'Hello World!'

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