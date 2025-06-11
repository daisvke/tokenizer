// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

// Import OpenZeppelin ERC20 standard contract
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

interface IMultiSig {
    function isApproved(address caller) external view returns (bool);
}

// d42 contract
contract d42 is ERC20, Ownable, Pausable {
    address public  multisig;

    modifier onlyMultisig() {
        require(msg.sender == multisig, "Caller is not multisig");
        _;
    }

    constructor(uint256 initialSupply, address _multisig)
        ERC20("d42", "D42")
        Ownable(msg.sender)
    {
        multisig = _multisig;
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyMultisig {
        _mint(to, amount);
    }

    function isPaused() public view returns (bool) {
        return paused();
    }

    /**
     * @notice Pause the contract. Revert if already paused.
     */
    function pause() public onlyMultisig {
        Pausable._pause();
    }

    /**
     * @notice Unpause the contract. Revert if already unpaused.
     */
    function unpause() public onlyMultisig {
        Pausable._unpause();
    }

    function multisigTransfer(address from, address to, uint256 amount) public onlyMultisig whenNotPaused {
        _transfer(from, to, amount);
    }

    // // Override the transfer function to include the whenNotPaused modifier
    // function transfer(address recipient, uint256 amount) public onlyMultisig override whenNotPaused returns (bool) {
    //     return super.transfer(recipient, amount);
    // }

    // Override the transferFrom function to include the whenNotPaused modifier
    function transferFrom(address sender, address recipient, uint256 amount) public onlyMultisig override whenNotPaused returns (bool) {
        return super.transferFrom(sender, recipient, amount);
    }

    function updateMultisig(address newMultisig) external onlyMultisig {
        multisig = newMultisig;
    }
}
