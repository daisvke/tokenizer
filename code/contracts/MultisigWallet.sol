// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract MultiSigWallet {
    address[] public    owners;
    uint public         requiredApprovals;

    struct Transaction {
        address to;
        uint    value;
        bytes   data;
        bool    executed;
        uint    approvals;
    }

    // Events are a way to log information on the blockchain
    event SubmitTransaction(
        address indexed owner,
        uint indexed    txIndex,
        address indexed to,
        uint            value,
        bytes           data
    );
    event ApproveTransaction(address indexed owner, uint indexed txIndex);
    event RevokeApproval(address indexed owner, uint256 indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint indexed txIndex);

    mapping(address => bool) public isOwner;
    Transaction[] public transactions;
    mapping(uint => mapping(address => bool)) public approved;

    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not an owner");
        _;
    }


    modifier txExists(uint txIndex) {
        require(txIndex < transactions.length, "tx does not exist");
        _;
    }

    modifier notExecuted(uint txIndex) {
        require(!transactions[txIndex].executed, "tx already executed");
        _;
    }

    modifier notApproved(uint txIndex) {
        require(!approved[txIndex][msg.sender], "tx already confirmed");
        _;
    }

    constructor(address[] memory _owners, uint _requiredApprovals) {
        require(
            _requiredApprovals > 0 && _owners.length >= _requiredApprovals,
            "Not enough owners"
        );
        for (uint i = 0; i < _owners.length; i++) {
            isOwner[_owners[i]] = true;
        }
        owners = _owners;
        requiredApprovals = _requiredApprovals;
    }

    // Add the transaction and auto-sign it
    function submitTransaction(
        address         to,
        uint            value,
        bytes memory    data
    ) public onlyOwner {
        transactions.push(Transaction(to, value, data, false, 0));
        uint txIndex = transactions.length - 1;
        approved[txIndex][msg.sender] = true;
        transactions[txIndex].approvals += 1;

        emit SubmitTransaction(msg.sender, txIndex, to, value, data);
    }

    function approveTransaction(uint txIndex)
        public onlyOwner txExists(txIndex) notExecuted(txIndex) notApproved(txIndex)
    {
        require(!approved[txIndex][msg.sender], "Already approved");

        approved[txIndex][msg.sender] = true;
        transactions[txIndex].approvals += 1;

        emit ApproveTransaction(msg.sender, txIndex);
    }

    function revokeApproval(uint txIndex)
        public onlyOwner txExists(txIndex) notExecuted(txIndex)
    {
        Transaction storage transaction = transactions[txIndex];
        require(approved[txIndex][msg.sender], "tx not confirmed");
                
        transaction.approvals -= 1;
        approved[txIndex][msg.sender] = false;
        
        emit RevokeApproval(msg.sender, txIndex);
    }

    function executeTransaction(uint txIndex)
        public onlyOwner txExists(txIndex) notExecuted(txIndex)
    {
        Transaction storage txn = transactions[txIndex];
        require(!transactions[txIndex].executed, "Already executed");
        require(
            transactions[txIndex].approvals >= requiredApprovals,
            "Not enough approvals"
        );

        txn.executed = true;
        (bool success, ) = txn.to.call{value: txn.value}(txn.data);
        require(success, "Transaction failed");

        emit ExecuteTransaction(msg.sender, txIndex);
    }

   function getOwners() public view returns (address[] memory) {
       return owners;
   }

    function getTransactionCount() public view returns (uint) {
        return transactions.length;
    }

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
        );
    }

    function getTransactionApprovals(uint txIndex)
        public txExists(txIndex) view returns (uint) {
        return transactions[txIndex].approvals;
    }
}
