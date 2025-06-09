// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

// Import OpenZeppelin ERC20 standard contract
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// d42 contract
contract d42 is ERC20, Ownable {
	
    constructor(uint256 initialSupply)
        ERC20("d42", "D42")
        Ownable(msg.sender)
    {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
