## Commands

### Install modules and run the tests
```bash
# For all the following commands, first go to the Node.js project folder
cd code/

# Install all the necessary modules according to package.json
npm install

# Run tests with the contract on the testnet
npx hardhat run ../deployment/interact.js
```

### Other useful commands

```bash
# Install/uninstall a module
npm install [--save-dev] module_name
npm uninstall module_name

# Publish sepolia smart contract on Etherscan.
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> 'Hello World!'

# Deploy the contract on the testnet (deployment is already done)
npx hardhat run ../deployment/deploy.js

# Wallet information can be accessed from
https://sepolia.etherscan.io/token/<WALLET_ADDRESS>

```


## Test Addresses

### Address of deployed multisig smart contract
`0x03A53ee8E248b59631b5B31614Ed20018B2C2b0a`
### Address of deployed d42 smart contract
`0x2bdD55d5c142B653D896a23CdAfa7f5Ba6A70781`
