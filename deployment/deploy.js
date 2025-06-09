const INITIAL_SUPPLY = process.env.INITIAL_SUPPLY

async function main() {
	// Set an initial token supply of 1000 D42 tokens
	const initialSupply = ethers.utils.parseUnits(INITIAL_SUPPLY, 18);
	// Get a contract factory object to allow deployment
	const D42 = await ethers.getContractFactory("d42");
	// Start deployment, returning a promise that resolves to a contract object
	const d42 = await D42.deploy(initialSupply);
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
