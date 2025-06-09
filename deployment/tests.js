const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL);
const RECEIVER_ADDRESS = process.env.WALLET_ADDRESS_OTHER; // the address you want to send tokens to

const owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const other = new ethers.Wallet(process.env.PRIVATE_KEY_OTHER, provider);

console.log("Owner:", owner.address);
console.log("Other:", other.address);

async function getBalances(d42) {
	const balance = await d42.balanceOf(owner.address);
	const balanceOther = await d42.balanceOf(RECEIVER_ADDRESS);
	console.log("Owner balance:", ethers.utils.formatEther(balance));
	console.log("Other balance:", ethers.utils.formatEther(balanceOther));
}

async function main() {
	const D42 = await ethers.getContractFactory("d42", owner);
	const d42 = await D42.deploy(ethers.utils.parseEther("1000"));
	await d42.deployed();

	console.log("Contract deployed to:", d42.address);

	try {
		// Connection test with Otehr (not supposed to succeed)
		// const d42FromOther = d42.connect(other);
		// await d42FromOther.mint(other.address, ethers.utils.parseEther("100"));

		// Check original balance of owner
		await getBalances(d42);

		// Transfer tokens to 'Other'
		const amount = ethers.utils.parseEther("10"); // sending 10 tokens

		console.log(`Sending ${ethers.utils.formatEther(amount)} tokens to ${RECEIVER_ADDRESS}...`);

		const tx = await d42.transfer(RECEIVER_ADDRESS, amount);
		await tx.wait();

  		console.log("✅ Transfer successful!");

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
