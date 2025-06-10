# tokenizer

### 🔹 **Platforms and Their Programming Languages**

These are the blockchain platforms where you can deploy tokens:

| Platform      | Language Used    | Notes                              |
| ------------- | ---------------- | ---------------------------------- |
| **Ethereum**  | Solidity         | Most common for smart contracts    |
| **Solana**    | Rust / C / C++   | Known for high performance         |
| **Cardano**   | Haskell / Plutus | More academic, functional language |
| **Tezos**     | Michelson        | Stack-based, low-level             |
| **BNB Chain** | Solidity         | Same tools as Ethereum             |

So if you choose Ethereum, you’ll need to **learn Solidity**, the smart contract language.

---

### 🔹 **Development Tools (Truffle, Remix, Hardhat, IDEs)**

These tools help you **write, test, and deploy smart contracts**. They’re mostly used with Ethereum-compatible platforms.

#### 1. **Remix**

* **Type**: Web-based IDE (no installation needed)
* **Best for**: Beginners
* **Features**:

  * Write Solidity contracts in-browser
  * Compile, test, and deploy from your browser
  * Has built-in test blockchain and debugger

✅ *Simple and easy to use*

---

#### 2. **Truffle**

* **Type**: Full development framework (CLI-based)
* **Best for**: Intermediate to advanced users
* **Features**:

  * Compile, migrate, test, and deploy smart contracts
  * Network management
  * Uses Ganache (local test blockchain)

✅ *Good for full-stack dApp development*

---

#### 3. **Hardhat**

* **Type**: Modern Ethereum dev environment (CLI + plugins)
* **Best for**: Advanced projects and custom setups
* **Features**:

  * Fast and flexible
  * Plugin support (e.g. ethers.js, waffle, TypeScript)
  * Better debugging and error messages than Truffle
  * Built-in local testnet (Hardhat Network)

✅ *Preferred by many modern Ethereum developers*

---

#### 4. **IDE (Integrated Development Environment)**

* **Examples**: VS Code, IntelliJ
* **Use**: Write Solidity and scripts
* Usually used with Truffle or Hardhat
* Supports extensions for Solidity, web3, etc.

✅ *Powerful for large or multi-file projects*

---

### 🔸 Summary of Differences

| Tool        | Type            | Ease of Use | Best For                   |
| ----------- | --------------- | ----------- | -------------------------- |
| **Remix**   | Web IDE         | ⭐⭐⭐⭐⭐       | Quick testing, beginners   |
| **Truffle** | CLI Framework   | ⭐⭐⭐         | Full dApp projects         |
| **Hardhat** | Dev Environment | ⭐⭐⭐⭐        | Custom, modern development |
| **IDE**     | General Editor  | ⭐⭐⭐⭐        | Flexible development setup |


## Useful commands
```
# Install/uninstall module
npm install [--save-dev] module_name
npm uninstall module_name

# Run a script
npx hardhat run path/to/script

# Deploy contract on the sepolia testnet
npx hardhat run ../deployment/deploy.js --network sepolia

# Publish sepolia smart contract on Etherscan
npx hardhat verify --network sepolia "0x67f809fbde3fbdf462002e7e933525989d043cff" 'Hello World!'

npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS INITIAL_SUPPLY

```

## Notes

### ERC-20

An ERC-20 token contract keeps track of fungible tokens: any one token is exactly equal to any other token; no tokens have special rights or behavior associated with them. This makes ERC-20 tokens useful for things like a medium of exchange currency, voting rights, staking, and more.

### Token parsing
have to parse ether sent to the constructor but not the other values like transfert amount

## Documentation
https://ethereum.org/fr/developers/tutorials/hello-world-smart-contract-fullstack/
but change:
- georli to sepolia
- 'hardhat-etherscan' to 'hardhat-verify' (https://www.npmjs.com/package/@nomiclabs/hardhat-etherscan)

https://metamask.io/download
https://sepolia-faucet.pk910.de/
https://developer.metamask.io/
ether.js
https://support.infura.io/building-with-infura/javascript-typescript/infuraprovider-metamaskwalletprovider-react-ethersjs
https://docs.ethers.org/v5/
https://sepolia.etherscan.io/address/0x3cd47a0d60075b8d6e387449605a7d016b5ca6bd
https://support.infura.io/building-with-infura/javascript-typescript/infuraprovider-metamaskwalletprovider-react-ethersjs
https://docs.openzeppelin.com/contracts/5.x/erc20#constructing-an-erc20-token-contract
https://blockchainblog.substack.com/p/how-to-create-an-erc-20-token-with

* on how cryptocurrencies and blockchains work
https://github.com/bitcoinbook/bitcoinbook
https://www.imponderablethings.com/2013/07/how-bitcoin-works-under-hood.html