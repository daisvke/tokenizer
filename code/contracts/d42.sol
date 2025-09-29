// SPDX-License-Identifier: MIT

/*
 * This file defines a smart contract named d42, which is an ERC20 token
 * with additional functionalities.
 * It incorporates features such as ownership management, pausable
 * functionality, and multisig (multi-signature) control for minting and
 * pausing operations. 
 */

pragma solidity ^0.8.26;

// Import OpenZeppelin ERC20 standard contract
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

// interface IMultiSig {
//     function isApproved(address caller) external view returns (bool);
// }

// d42 contract
contract d42 is ERC20, Pausable {
    address public multisig; // Address of the multisig wallet

    /************************* Events *************************/

    /**
     * @notice Event emitted when new tokens are minted.
     */
    event Minted(address indexed to, uint256 amount);

    /**
     * @notice Event for multisig transfers.
     */
    event MultisigTransfer(address indexed sender, address indexed recipient, uint256 amount);

    /************************* Modifier *************************/

    /**
     * @notice Modifier to restrict access to multisig address.
     */
    modifier onlyMultisig() {
        // Check if the caller is the multisig address
        require(msg.sender == multisig, "Caller is not multisig");

        /*
         * '_' is a placeholder used within function modifiers.
         * It represents the point in the code where the modified function's body
         * will be executed.
         */

        _;
    }

    /************************* Constructor *************************/

    constructor(uint256 initialSupply, address _multisig)
        ERC20("d42", "D42") // Initializing the ERC20 token with name and symbol
    {
        multisig = _multisig; // Setting the multisig address

        /* Minting the initial supply to the contract deployer
         * The given token amount is first converted to wei
         */

        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    /************************* Functions *************************/

    /**
     * @notice Function to mint new tokens.
     */
    function mint(address to, uint256 amount) public onlyMultisig {
        _mint(to, amount); // Minting tokens to the specified address
        emit Minted(to, amount); // Emitting the Minted event
    }

    /**
     * @notice Check if the contract is paused.
     */
    function isPaused() public view returns (bool) {
        return paused(); // Returning the paused state
    }

    /**
     * @notice Pause the contract. Revert if already paused.
     */
    function pause() public onlyMultisig {
        // Calling the internal pause function from the Pausable contract
        Pausable._pause();
        emit Paused(msg.sender); // Emitting the Paused event
    }

    /**
     * @notice Unpause the contract. Revert if already unpaused.
     */
    function unpause() public onlyMultisig {
        // Calling the internal unpause function from the Pausable contract
        Pausable._unpause();
        emit Unpaused(msg.sender); // Emitting the Unpaused event
    }


    /**
     * @notice Override the transfer function to include the whenNotPaused modifier.
     */
    function transfer(address recipient, uint256 amount)
        public onlyMultisig override whenNotPaused returns (bool)
    {
        // Calling the parent transfer function
        return super.transfer(recipient, amount);
    }

    /**
     * @notice Function for multisig transfers.
     */
    function multisigTransfer(address sender, address recipient, uint256 amount)
        public onlyMultisig whenNotPaused
    {
        // Checking if the sender has enough balance
        require(balanceOf(sender) >= amount, "Insufficient balance");
        // Transferring tokens from sender to recipient
        _transfer(sender, recipient, amount);
        // Emitting the MultisigTransfer event
        emit MultisigTransfer(sender, recipient, amount);
    }

    /**
     * @notice Override the transferFrom function to include the whenNotPaused modifier.
     */
    function transferFrom(address sender, address recipient, uint256 amount)
        public onlyMultisig override whenNotPaused returns (bool)
    {
        // Calling the parent transferFrom function
        return super.transferFrom(sender, recipient, amount);
    }

    /**
     * @notice unction to update the multisig.
     */
    function updateMultisig(address newMultisig) external onlyMultisig {
        multisig = newMultisig;
    }
}
