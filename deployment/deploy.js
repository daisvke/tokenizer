// Deploy both the multisig and the D42 smart contracts

/*
 * Get the provider that gives access to the testnet blockchain.
 *
 * RPC stands for Remote Procedure Call. It is a protocol that allows a program
 * 	to execute code on a remote server as if it were a local procedure call.
 */

const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL);

const INITIAL_SUPPLY = process.env.INITIAL_SUPPLY

// Global contract objects
var multiSigWallet, d42Contract;

// Get the wallets
const owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const other = new ethers.Wallet(process.env.PRIVATE_KEY_OTHER, provider);

async function getBalances() {
	// Get the balance of the two accounts
	const balance = await d42Contract.balanceOf(owner.address);
	const balanceOther = await d42Contract.balanceOf(other.address);
	// Get the number of decimals from the token contract
	const decimals = await d42Contract.decimals();
	// Convert the wei values to tokens and print (1 ether = 10^18 wei)
	console.log("=======================");
	console.log("Owner balance:", ethers.utils.formatUnits(balance, decimals));
	console.log("Other balance:", ethers.utils.formatUnits(balanceOther, decimals));
	console.log("=======================");
}

async function displayWalletInfo() {
	// Get the balance of the wallet
	const balanceOwner = await owner.getBalance();
	// Format the balance to Ether
	const formattedBalanceOwner = ethers.utils.formatEther(balanceOwner);

	// Same for the other signer
	const balanceOther = await other.getBalance();
	const formattedBalanceOther = ethers.utils.formatEther(balanceOther);

	console.log("├── Owner")
	console.log("|     ├── Wallet Address:", owner.address);
	console.log(`|     └── Wallet Balance: ${formattedBalanceOwner} ETH`);
	console.log('|');
	console.log("└── Other");
	console.log("      ├── Wallet Address:", other.address);
	console.log(`      └── Wallet Balance: ${formattedBalanceOther} ETH`);
}

// Deploy the MultiSigWallet (transaction on d42 have to be signed by signer1 + signer2)
async function deployMultiSigContract(signer1, signer2) {
    /* Get the contract factory for the MultiSigWallet contract
	 * The primary purpose of a contract factory is to deploy new instances of a smart contract. 
	 */
	const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
    
    /* Deploy the MultiSigWallet contract with the addresses of signer1 and signer2.
	 * This creates a new instance of the contract on the blockchain.
	 */
	const multisig = await MultiSigWallet.deploy(
		[signer1.address, signer2.address], // Array of owner addresses
		2 // 2 of 2 required approvals
	);

    // Wait until the contract is deployed on the blockchain
	await multisig.deployed();

    // Log the address of the deployed MultiSigWallet contract to the console
	console.log(`\n✅ MultiSigWallet deployed to: ${multisig.address}`);

	// Return the deployed contract instance for further interaction
	return multisig;
}

async function deployD42Contract() {
	// Get the contract factory object of our smart contract named "d42"
	const D42CFObj = await ethers.getContractFactory("d42", owner);
	
	const d42Contract = await D42CFObj.deploy(INITIAL_SUPPLY, multiSigWallet.address);
	
	// Wait until the contract is fully deployed on the blockchain
	await d42Contract.deployed();

	// Retrieve the name of the token from the deployed contract
	const name = await d42Contract.name();
	
	// Retrieve the symbol of the token from the deployed contract
	const symbol = await d42Contract.symbol();

	console.log(`\n✅ d42 contract deployed to address: ${d42Contract.address}\n`);
	console.log(`Token name: ${name} | Symbol: ${symbol}`);

	// Return the deployed contract instance for further interactions
	return d42Contract;
}

async function main() {
	await displayWalletInfo();

	// Deploy the MultiSigWallet to sign the transaction on d42
	multiSigWallet = await deployMultiSigContract(owner, other);
	// Deploy the d42 contract on the testnet
	d42Contract = await deployD42Contract();

	// Get initial balances of the two signers
	await getBalances(d42Contract);
}

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
