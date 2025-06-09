async function main() {
	const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL);

	const owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
	const other = new ethers.Wallet(process.env.PRIVATE_KEY_OTHER, provider);

	console.log("Owner:", owner.address);
	console.log("Other:", other.address);

	const D42 = await ethers.getContractFactory("d42", owner);
	const d42 = await D42.deploy(ethers.utils.parseEther("1000"));
	await d42.deployed();

	console.log("Contract deployed to:", d42.address);

	try {
		// const d42FromOther = d42.connect(other);
		// await d42FromOther.mint(other.address, ethers.utils.parseEther("100"));

		const d42FromOther = d42.connect(other);
		await d42FromOther.mint(other.address, ethers.utils.parseEther("100"));

		// Check current balance of owner
		const balance = await d42.balanceOf(owner.address);
		console.log("Owner balance:", ethers.utils.formatEther(balance)); // should be 1100
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
