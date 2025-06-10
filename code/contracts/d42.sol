// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

// Import OpenZeppelin ERC20 standard contract
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

// d42 contract
contract d42 is ERC20, Ownable, Pausable {
	
    constructor(uint256 initialSupply)
        ERC20("d42", "D42")
        Ownable(msg.sender)
    {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function isPaused() public view returns (bool) {
        return paused();
    }

    /**
     * @notice Pause the contract. Revert if already paused.
     */
    function pause() public onlyOwner {
        Pausable._pause();
    }

    /**
     * @notice Unpause the contract. Revert if already unpaused.
     */
    function unpause() public onlyOwner {
        Pausable._unpause();
    }

    // Override the transfer function to include the whenNotPaused modifier
    function transfer(address recipient, uint256 amount) public override whenNotPaused returns (bool) {
        return super.transfer(recipient, amount);
    }

    // Override the transferFrom function to include the whenNotPaused modifier
    function transferFrom(address sender, address recipient, uint256 amount) public override whenNotPaused returns (bool) {
        return super.transferFrom(sender, recipient, amount);
    }
}
