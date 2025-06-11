// Get the provider that gives access to the testnet blockchain
const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL);
// The address we want to send tokens to
const WALLET_OTHER = process.env.WALLET_ADDRESS_OTHER;
// Get the initial owner account's supply amount
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
	// Convert the wei values to tokens and print
	console.log("=======================");
	console.log("Owner balance:", ethers.utils.formatUnits(balance, decimals));
	console.log("Other balance:", ethers.utils.formatUnits(balanceOther, decimals));
	console.log("=======================");
}

async function executeMultiSigTransaction(txName, args, signer1, signer2) {
	// Encode the function call
	const txData = d42Contract.interface.encodeFunctionData(
		txName,
		args
	);

	console.log(`Submitting ${txName} transaction from signer1...`);

	// Submit transaction from signer1
	const tx = await multiSigWallet
					.connect(signer1)
					.submitTransaction(d42Contract.address, 0, txData);
	await tx.wait();

	// Get transaction index (last added transaction)
	const txIndex = (await multiSigWallet.getTransactionCount()) - 1;
	console.log("Transaction index:", txIndex);

	// Check approvals count after the approval
	approvals = await multiSigWallet.getTransactionApprovals(txIndex);
	console.log("Approvals for transaction:", approvals);
	
	console.log("Signer2 is owner:", await multiSigWallet.isOwner(signer2.address));
	console.log("Approving transaction from signer2...");
	const approveTx = await multiSigWallet.connect(signer2).approveTransaction(txIndex);
	await approveTx.wait();

	// Check approvals count after the approvals
	approvals = await multiSigWallet.getTransactionApprovals(txIndex);
	console.log("Approvals for transaction:", approvals);

	console.log("Executing transaction...");

	// Execute transaction from signer1
	const execTx = await multiSigWallet.connect(signer1).executeTransaction(txIndex);
	await execTx.wait();

	console.log(`\n✅ ${txName} transaction executed via multisig!\n`);
}

// Pause contract to forbid transfers
async function pauseUnpauseContract(mode, signer1, signer2) {
	// Check original paused state
	var pausedState = await d42Contract.isPaused();
	console.log("Is contract paused?", pausedState);

	// Execute the transaction through MultiSig contract (signed by 2 signers)
	await executeMultiSigTransaction(mode, [], signer1, signer2);

	// Check updated paused value
	pausedState = await d42Contract.isPaused();
	console.log("Is contract paused?", pausedState);
}

// Send tokens from owner to other
async function transfertToOther(amount, signer1, signer2) {
	if (await d42Contract.isPaused())
		console.log("Contract is paused! Aborting...");

	// Transfer tokens to 'Other'
	console.log(`Sending ${amount} tokens to address: ${other.address}...`);

	// Execute the transaction through MultiSig contract (signed by 2 signers)
	await executeMultiSigTransaction(
		"multisigTransfer",
		[owner.address, other.address, ethers.utils.parseEther(amount)],
		signer1, signer2
	);

	// Check updated balance of owner
	await getBalances(d42Contract);
}

// Send tokens from owner to other
async function transfert(from, to, amount, signer1, signer2) {
	// Transfer tokens to 'Other'
	console.log(`Sending ${amount} tokens to address: ${other.address}...`);

	// Execute the transaction through MultiSig contract (signed by 2 signers)
	await executeMultiSigTransaction(
		"multisigTransfer",
		[from.address, to.address, ethers.utils.parseEther(amount)],
		signer1, signer2
	);

	// Check updated balance of owner
	await getBalances(d42Contract);
}

// Deploy the MultiSigWallet (transaction on d42 have to be signed by signer1 + signer2)
async function deployMultiSigWallet(signer1, signer2) {
	const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
	const multisig = await MultiSigWallet.deploy(
		[signer1.address, signer2.address],
		2 // 2 of 2 required approvals
	);
	await multisig.deployed();

	console.log(`\n✅ MultiSigWallet deployed to: ${multisig.address}`);

	return multisig;
}

async function deployD42() {
	// Get the contract factory object of our smart contract
	const D42CFObj = await ethers.getContractFactory("d42", owner);
	// Deploy the contract with MultiSigWallet on the testnet
	const d42Contract = await D42CFObj.deploy(INITIAL_SUPPLY, multiSigWallet.address);
	// Make sure to wait until it is deployed
	await d42Contract.deployed();

	const name = await d42Contract.name();
	const symbol = await d42Contract.symbol();

	console.log(`\n✅ Contract deployed to address: ${d42Contract.address}\n`);
	console.log(`Token name: ${name} | Symbol: ${symbol}`);

	return d42Contract;
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

async function main() {
	try {
		await displayWalletInfo();

		// Deploy the MultiSigWallet to sign the transaction on d42
		multiSigWallet = await deployMultiSigWallet(owner, other);
		d42Contract = await deployD42();

		// Get initial balances of the two signers
		await getBalances(d42Contract);

		/*
		 * Connection test with Other (not supposed to succeed)
		 */

		// const d42FromOther = d42Contract.connect(other);
		// await d42FromOther.mint(other.address, ethers.utils.parseEther("100"));


		/*
		 * Pause contract to forbid transfers (will make further transactions fail!)
		 */

		// await pauseUnpauseContract("pause", owner, other);
		// await pauseUnpauseContract("unpause", owner, other);

		/*
		 * Send tokens from owner to other
		 */

		await transfertToOther("10", owner, other);

		/*
		 * Send tokens from other to owner
		 */

		// await transfert(other, owner, "5", owner, other);
	}
	catch (err)
	{
		// console.error("Operation failed, as expected.");
		console.error(err.message);
	}
}

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
