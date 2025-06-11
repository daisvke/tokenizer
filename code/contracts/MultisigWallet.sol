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
        uint indexed txIndex,
        address indexed to,
        uint value,
        bytes data
    );
    event ApproveTransaction(address indexed owner, uint indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint indexed txIndex);

    mapping(address => bool) public isOwner;
    Transaction[] public transactions;
    mapping(uint => mapping(address => bool)) public approved;

    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not an owner");
        _;
    }

    constructor(address[] memory _owners, uint _requiredApprovals) {
        require(_owners.length >= _requiredApprovals, "Not enough owners");
        for (uint i = 0; i < _owners.length; i++) {
            isOwner[_owners[i]] = true;
        }
        owners = _owners;
        requiredApprovals = _requiredApprovals;
    }

    // Add the transaction and auto-sign it
    function submitTransaction(address to, uint value, bytes memory data) public onlyOwner {
        transactions.push(Transaction(to, value, data, false, 0));
        uint txIndex = transactions.length - 1;
        approved[txIndex][msg.sender] = true;
        transactions[txIndex].approvals += 1;

        emit SubmitTransaction(msg.sender, txIndex, to, value, data);
    }

    function approveTransaction(uint txIndex) public onlyOwner {
        require(txIndex < transactions.length, "Transaction does not exist");
        require(!approved[txIndex][msg.sender], "Already approved");

        approved[txIndex][msg.sender] = true;
        transactions[txIndex].approvals += 1;

        emit ApproveTransaction(msg.sender, txIndex);
    }

    function executeTransaction(uint txIndex) public onlyOwner {
        Transaction storage txn = transactions[txIndex];
        require(!transactions[txIndex].executed, "Already executed");
        require(transactions[txIndex].approvals >= requiredApprovals, "Not enough approvals");

        txn.executed = true;
        (bool success, ) = txn.to.call{value: txn.value}(txn.data);
        require(success, "Transaction failed");

        emit ExecuteTransaction(msg.sender, txIndex);
    }

    function getTransactionCount() public view returns (uint) {
        return transactions.length;
    }

    function getTransactionApprovals(uint txIndex) public view returns (uint) {
        return transactions[txIndex].approvals;
    }
}
