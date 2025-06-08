async function main() {
	const contractAddress = "0x67f809FBdE3FbDF462002E7e933525989d043cfF"
   const HelloWorld = await ethers.getContractAt("HelloWorld", contractAddress);

   // Start deployment, returning a promise that resolves to a contract object
   const message = await HelloWorld.message();   
   console.log("Stored message:", message);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
