// Get the provider that gives access to the testnet blockchain
const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL);
// The address we want to send tokens to
const WALLET_OTHER = process.env.WALLET_ADDRESS_OTHER;
// Get the initial owner account's supply amount
const INITIAL_SUPPLY = process.env.INITIAL_SUPPLY

// Get the wallets
const owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const other = new ethers.Wallet(process.env.PRIVATE_KEY_OTHER, provider);

console.log("├── Owner's wallet address:", owner.address);
console.log("├── Other's wallet address:", other.address);

async function getBalances(d42Contract) {
	// Get the balance of the two accounts
	const balance = await d42Contract.balanceOf(owner.address);
	const balanceOther = await d42Contract.balanceOf(WALLET_OTHER);
	// Get the number of decimals from the token contract
	const decimals = await d42Contract.decimals();
	// Convert the wei values to tokens and print
	console.log("=======================");
	console.log("Owner balance:", ethers.utils.formatUnits(balance, decimals));
	console.log("Other balance:", ethers.utils.formatUnits(balanceOther, decimals));
	console.log("=======================");
}

// Pause contract to forbid transfers
async function pauseContract(d42Contract) {
	var pausedState = await d42Contract.isPaused();
	console.log("Is contract paused?", pausedState);

	console.log("Pausing contract...");
	const pauseTx = await d42Contract.pause();
	await pauseTx.wait();
	console.log("\n✅ Paused contract successfully!\n");

	pausedState = await d42Contract.isPaused();
	console.log("Is contract paused?", pausedState);
}

// Send tokens from owner to other
async function transfertToOther(d42Contract, amount) {
	// Check original balance of owner
	await getBalances(d42Contract);

	// Transfer tokens to 'Other'
	console.log(`Sending ${amount} tokens to address: ${WALLET_OTHER}...`);

	// Convert the transfered amount in wei
	const transferTx = await d42Contract.transfer(WALLET_OTHER, ethers.utils.parseEther(amount));
	await transferTx.wait();

	console.log("\n✅ Transfer successful!\n");

	// Check updated balance of owner
	await getBalances(d42Contract);
}

async function main() {
	// Get the contract factory object of our smart contract
	const D42CFObj = await ethers.getContractFactory("d42", owner);
	// Deploy the contract on the testnet
	const d42Contract = await D42CFObj.deploy(INITIAL_SUPPLY);
	// Make sure to wait until it is deployed
	await d42Contract.deployed();

	const name = await d42Contract.name();
	const symbol = await d42Contract.symbol();
	console.log(`└── Token name: ${name} | Symbol: ${symbol}`);

	console.log(`\n✅ Contract deployed to address: ${d42Contract.address}\n`);

	try {
		/*
		 * Connection test with Other (not supposed to succeed)
		 */

		// const d42FromOther = d42Contract.connect(other);
		// await d42FromOther.mint(other.address, ethers.utils.parseEther("100"));

		/*
		 * Pause contract to forbid transfers
		 */

		// await pauseContract(d42Contract);

		/*
		 * Send tokens from owner to other
		 */

		await transfertToOther(d42Contract, "10");
	} catch (err) {
		// console.error("Minting failed from non-owner account, as expected:");
		console.error(err.message);
	}
}

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
