// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract MultiSigWallet {
    // List of owners of the multisig wallet
    address[] public    owners;
    // Number of approvals required to execute a transaction
    uint public         requiredApprovals;

    struct Transaction {
        address to;         // Address to send funds to
        uint    value;      // Amount of funds to send
        bytes   data;       // Additional data for the transaction
        bool    executed;   // Status of the transaction execution
        uint    approvals;  // Number of approvals received for the transaction
    }

    /************************* Events *************************/
    // Events are a way to log information on the blockchain
    
    /**
     * @notice Emitted when a transaction is submitted.
     * @param owner The address of the owner who submitted the transaction.
     * @param txIndex The index of the transaction in the transactions array.
     * @param to The address to which the transaction is directed.
     * @param value The amount of Ether to send in the transaction.
     * @param data Additional data for the transaction.
     */
    event SubmitTransaction(
        address indexed owner,
        uint indexed    txIndex,
        address indexed to,
        uint            value,
        bytes           data
    );

    /**
     * @notice Emitted when a transaction is approved.
     * @param owner The address of the owner who approved the transaction.
     * @param txIndex The index of the approved transaction.
     */
    event ApproveTransaction(address indexed owner, uint indexed txIndex);

    /**
     * @notice Emitted when an approval is revoked.
     * @param owner The address of the owner who revoked the approval.
     * @param txIndex The index of the transaction for which approval was revoked.
     */
    event RevokeApproval(address indexed owner, uint256 indexed txIndex);

    /**
     * @notice Emitted when a transaction is executed.
     * @param owner The address of the owner who executed the transaction.
     * @param txIndex The index of the executed transaction.
     */
    event ExecuteTransaction(address indexed owner, uint indexed txIndex);

    mapping(address => bool) public isOwner; // Mapping to check if an address is an owner
    Transaction[] public transactions; // Array of transactions
    // Mapping to track approvals for each transaction
    mapping(uint => mapping(address => bool)) public approved;

    /************************* Modifiers *************************/

    /**
     * @notice Modifier to restrict access to functions to only the owners.
     */
    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not an owner");
        _;
    }

    /**
     * @notice Modifier to check if a transaction exists.
     * @param txIndex The index of the transaction to check.
     */
    modifier txExists(uint txIndex) {
        require(txIndex < transactions.length, "tx does not exist");
        _;
    }

    /**
     * @notice Modifier to check if a transaction has not been executed.
     * @param txIndex The index of the transaction to check.
     */
    modifier notExecuted(uint txIndex) {
        require(!transactions[txIndex].executed, "tx already executed");
        _;
    }

    /**
     * @notice Modifier to check if a transaction has not been approved by the caller.
     * @param txIndex The index of the transaction to check.
     */
    modifier notApproved(uint txIndex) {
        require(!approved[txIndex][msg.sender], "tx already confirmed");
        _;
    }

    /************************* Constructor *************************/

    /**
     * @notice Constructor to initialize the multisig wallet with owners and required approvals.
     * @param _owners The addresses of the owners.
     * @param _requiredApprovals The number of approvals required to execute a transaction.
     */
    constructor(address[] memory _owners, uint _requiredApprovals) {
        require(
            _requiredApprovals > 0 && _owners.length >= _requiredApprovals,
            "Not enough owners"
        );
        for (uint i = 0; i < _owners.length; i++) {
            isOwner[_owners[i]] = true; // Mark each address as an owner
        }
        owners = _owners; // Set the owners
        requiredApprovals = _requiredApprovals; // Set the required approvals
    }

    /************************* Functions *************************/

    /**
     * @notice Submit a new transaction and auto-approve it.
     * @param to The address to send funds to.
     * @param value The amount of Ether to send.
     * @param data Additional data for the transaction.
     */
    function submitTransaction(
        address         to,
        uint            value,
        bytes memory    data
    ) public onlyOwner {
        transactions.push(Transaction(to, value, data, false, 0)); // Add the transaction
        uint txIndex = transactions.length - 1; // Get the index of the new transaction
        approved[txIndex][msg.sender] = true; // Auto-approve the transaction for the sender
        transactions[txIndex].approvals += 1; // Increment the approval count

        // Emit the SubmitTransaction event
        emit SubmitTransaction(msg.sender, txIndex, to, value, data);
    }

    /**
     * @notice Approve a transaction.
     * @param txIndex The index of the transaction to approve.
     */
    function approveTransaction(uint txIndex)
        public onlyOwner txExists(txIndex) notExecuted(txIndex) notApproved(txIndex)
    {
        approved[txIndex][msg.sender] = true; // Mark the transaction as approved by the sender
        transactions[txIndex].approvals += 1; // Increment the approval count

        emit ApproveTransaction(msg.sender, txIndex); // Emit the ApproveTransaction event
    }

    /**
     * @notice Revoke approval for a transaction.
     * @param txIndex The index of the transaction to revoke approval for.
     */
    function revokeApproval(uint txIndex)
        public onlyOwner txExists(txIndex) notExecuted(txIndex)
    {
        Transaction storage transaction = transactions[txIndex];
        // Check if the transaction was approved
        require(approved[txIndex][msg.sender], "tx not confirmed");

        transaction.approvals -= 1; // Decrement the approval count
        // Mark the transaction as not approved by the sender
        approved[txIndex][msg.sender] = false;
        
        emit RevokeApproval(msg.sender, txIndex); // Emit the RevokeApproval event
    }

    /**
     * @notice Execute a transaction if enough approvals are received.
     * @param txIndex The index of the transaction to execute.
     */
    function executeTransaction(uint txIndex)
        public onlyOwner txExists(txIndex) notExecuted(txIndex)
    {
        Transaction storage txn = transactions[txIndex];
        // Check if enough approvals are received
        require(txn.approvals >= requiredApprovals, "Not enough approvals");

        txn.executed = true; // Mark the transaction as executed
        (bool success, ) = txn.to.call{value: txn.value}(txn.data); // Execute the transaction
        require(success, "Transaction failed"); // Check if the transaction was successful

        emit ExecuteTransaction(msg.sender, txIndex); // Emit the ExecuteTransaction event
    }

    /**
     * @notice Get the list of owners.
     * @return The array of owner addresses.
     */
    function getOwners() public view returns (address[] memory) {
        return owners; // Return the list of owners
    }

    /**
     * @notice Get the total number of transactions.
     * @return The number of transactions submitted.
     */
    function getTransactionCount() public view returns (uint) {
        return transactions.length; // Return the number of transactions
    }

    /**
     * @notice Get details of a specific transaction.
     * @param txIndex The index of the transaction to retrieve.
     * @return to The address to which the transaction is directed.
     * @return value The amount of Ether to send in the transaction.
     * @return data Additional data for the transaction.
     * @return executed The execution status of the transaction.
     * @return approvals The number of approvals received for the transaction.
     */
    function getTransaction(
        uint txIndex
    )
        public
        txExists(txIndex)
        view
        returns (
            address         to,
            uint            value,
            bytes memory    data,
            bool            executed,
            uint            approvals
        )
    {
        Transaction storage transaction = transactions[txIndex];
        return (
            transaction.to,
            transaction.value,
            transaction.data,
            transaction.executed,
            transaction.approvals
        ); // Return the transaction details
    }

    /**
     * @notice Get the number of approvals for a specific transaction.
     * @param txIndex The index of the transaction to check.
     * @return The number of approvals received for the transaction.
     */
    function getTransactionApprovals(uint txIndex)
        public txExists(txIndex) view returns (uint) 
    {
        // Return the number of approvals for the transaction
        return transactions[txIndex].approvals;
    }
}
