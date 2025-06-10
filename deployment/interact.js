// Get the provider that gives access to the testnet blockchain
const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL);
// The address we want to send tokens to
const RECEIVER_ADDRESS = process.env.WALLET_ADDRESS_OTHER;
// Get the initial owner account's supply amount
const INITIAL_SUPPLY = process.env.INITIAL_SUPPLY

// Get the wallets
const owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const other = new ethers.Wallet(process.env.PRIVATE_KEY_OTHER, provider);

console.log("├── Owner's wallet address:", owner.address);
console.log("├── Other's wallet address:", other.address);

async function getBalances(d42) {
	// Get the balance of the two accounts
	const balance = await d42.balanceOf(owner.address);
	const balanceOther = await d42.balanceOf(RECEIVER_ADDRESS);
	// Get the number of decimals from the token contract
	const decimals = await d42.decimals();
	// Convert the wei values to tokens and print
	console.log("=======================");
	console.log("Owner balance:", ethers.utils.formatUnits(balance, decimals));
	console.log("Other balance:", ethers.utils.formatUnits(balanceOther, decimals));
	console.log("=======================");
}

async function main() {
	// Get the contract factory object of our smart contract
	const D42 = await ethers.getContractFactory("d42", owner);
	// Deploy the contract on the testnet
	const d42 = await D42.deploy(INITIAL_SUPPLY);
	// Make sure to wait until it is deployed
	await d42.deployed();

	const name = await d42.name();
	const symbol = await d42.symbol();
	console.log(`└── Token name: ${name} | Symbol: ${symbol}`);

	console.log(`\n✅ Contract deployed to address: ${d42.address}\n`);

	try {
		// Connection test with Other (not supposed to succeed)
		// const d42FromOther = d42.connect(other);
		// await d42FromOther.mint(other.address, ethers.utils.parseEther("100"));

		// Check original balance of owner
		await getBalances(d42);

		// Transfer tokens to 'Other'
		const amount = "10"; // sending 10 tokens

		console.log(`Sending ${amount} tokens to address: ${RECEIVER_ADDRESS}...`);

		// Convert the transfered amount in wei
		const tx = await d42.transfer(RECEIVER_ADDRESS, ethers.utils.parseEther(amount));
		await tx.wait();

  		console.log("\n✅ Transfer successful!\n");

		// Check updated balance of owner
		await getBalances(d42);

	} catch (err) {
		console.error("Minting failed from non-owner account, as expected:");
		console.error(err.message);
	}
}

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
