const INITIAL_SUPPLY = process.env.INITIAL_SUPPLY

async function main() {
	// Get a contract factory object to allow deployment
	const D42 = await ethers.getContractFactory("d42");
	// Start deployment, returning a promise that resolves to a contract object
	const d42 = await D42.deploy(INITIAL_SUPPLY);
	// Make sure to wait until it is deployed
	await d42.deployed();

	console.log("Contract deployed to:", d42.address);
}

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
