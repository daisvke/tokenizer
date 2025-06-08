const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS

async function main() {
	const contractAddress = CONTRACT_ADDRESS
	const HelloWorld = await ethers.getContractAt("HelloWorld", contractAddress);

	// Start deployment, returning a promise that resolves to a contract object
	const message = await HelloWorld.message();
	console.log("Stored message:", message);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
