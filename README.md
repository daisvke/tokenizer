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

## Ethereum Mining

We used <a href="https://sepolia-faucet.pk910.de/">this Sepolia faucet.</a>

- **Understanding Blockchain Mechanics**: Mining helps you understand how transactions are validated and added to the blockchain.
- **Test Network Mining**: On test networks like Sepolia, mining can be done without financial risk.

## Using Sepolia Test Network

### Benefits of Sepolia
- **Free Test Ether**: The Sepolia faucet provides free test Ether for experimentation.
- **Realistic Testing Environment**: Sepolia mimics the Ethereum mainnet, enabling realistic testing of smart contracts.

## Summary Table of Advantages

| Component                | Advantages                                                                 |
|--------------------------|----------------------------------------------------------------------------|
| **ERC20**                | Widely adopted, interoperable, and simple to implement.                    |
| **Ether**                | Native currency for transaction fees and access to Ethereum features.      |
| **Hardhat**              | Local development, built-in tools, and strong community support.           |
| **Mining**               | Understanding blockchain mechanics and risk-free experimentation.          |
| **Sepolia**              | Free test Ether and a realistic testing environment.                       |

By combining these elements, a beginner can effectively learn about smart contract development, gain practical experience, and build a solid foundation for future projects.


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

# Run tests with the contract on the testnet
npx hardhat run ../deployment/interact.js

```


## Notes

### ERC-20

An ERC-20 token contract keeps track of fungible tokens: any one token is exactly equal to any other token; no tokens have special rights or behavior associated with them. This makes ERC-20 tokens useful for things like a medium of exchange currency, voting rights, staking, and more.

### Token parsing
have to parse ether sent to the constructor but not the other values like transfert amount

### Owner Privileges
The owner has significant control over the contract (e.g., can mint tokens, pause/unpause). If the owner's private key is compromised, an attacker could misuse these privileges. ConSo we have implemented a multi-signature wallet for ownership to enhance security.


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