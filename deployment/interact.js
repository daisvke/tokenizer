const API_KEY = process.env.API_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY
const CONTRACT_ADDRESS = process.env.DEPLOYED_CONTRACT_ADDRESS
const contract = require("../code/artifacts/contracts/d42.sol/d42.json");

const provider = new ethers.providers.InfuraProvider("sepolia", API_KEY);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Contract instance
const token = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

// A function to check the balance of the contract
async function checkBalance() {
	const balance = await token.balanceOf(signer.address);
	console.log("Your balance:", ethers.utils.formatUnits(balance, 18), "D42");
}

async function main() {
	checkBalance();
}

main().catch(console.error);
