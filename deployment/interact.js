// Get the provider that gives access to the testnet blockchain
const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL);
// The address we want to send tokens to
const WALLET_OTHER = process.env.WALLET_ADDRESS_OTHER;
// Get the initial owner account's supply amount
const INITIAL_SUPPLY = process.env.INITIAL_SUPPLY

// Get the wallets
const owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const other = new ethers.Wallet(process.env.PRIVATE_KEY_OTHER, provider);

async function getBalances(d42Contract) {
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

async function executeMultiSigTransaction(d42Contract, multiSigWallet, txName, arg1, arg2, arg3, signer1, signer2) {
	// Encode the function call
	const txData = d42Contract.interface.encodeFunctionData(
		txName,
		[arg1, arg2, arg3]
        // arg1 !== undefined && arg2 !== undefined ? [arg1, arg2] : 
        // arg1 !== undefined ? [arg1] : 
        // arg2 !== undefined ? [arg2] : 
        // []
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
async function pauseContract(d42Contract, multiSigWallet, signer1, signer2) {
	// Check original paused state
	var pausedState = await d42Contract.isPaused();
	console.log("Is contract paused?", pausedState);

	console.log("Pausing contract...");

	// Execute the transaction through MultiSig contract (signed by 2 signers)
	await executeMultiSigTransaction(d42Contract, multiSigWallet, "pause", undefined, undefined, signer1, signer2);

	// Check updated paused value
	pausedState = await d42Contract.isPaused();
	console.log("Is contract paused?", pausedState);
}

// Send tokens from owner to other
async function transfertToOther(d42Contract, multiSigWallet, amount, signer1, signer2) {
	// Transfer tokens to 'Other'
	console.log(`Sending ${amount} tokens to address: ${other.address}...`);

	// Execute the transaction through MultiSig contract (signed by 2 signers)
	await executeMultiSigTransaction(d42Contract, multiSigWallet, "multisigTransfer", owner.address, other.address, ethers.utils.parseEther(amount), signer1, signer2);

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

async function deployD42(multiSigWallet) {
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
		displayWalletInfo();

		// Deploy the MultiSigWallet to sign the transaction on d42
		const multiSigWallet = await deployMultiSigWallet(owner, other);
		const d42Contract = await deployD42(multiSigWallet);

		// Get initial balances of the two signers
		await getBalances(d42Contract);

		/*
		 * Connection test with Other (not supposed to succeed)
		 */

		// const d42FromOther = d42Contract.connect(other);
		// await d42FromOther.mint(other.address, ethers.utils.parseEther("100"));

		/*
		 * Pause contract to forbid transfers
		 */

		// await pauseContract(d42Contract, multiSigWallet, owner, other);

		/*
		 * Send tokens from owner to other
		 */

		await transfertToOther(d42Contract, multiSigWallet, "10", owner, other);
	}
	catch (err)
	{
		console.error("Operation failed, as expected.");
		// console.error(err.message);
	}
}

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
