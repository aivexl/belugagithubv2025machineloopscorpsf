// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SimpleStorage
 * @dev A simple smart contract for storing and retrieving data
 */
contract SimpleStorage {
    // State variables
    uint256 private storedData;
    string private storedString;
    address public owner;
    
    // Events
    event DataStored(uint256 newValue, address indexed sender);
    event StringStored(string newString, address indexed sender);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
        storedData = 0;
        storedString = "Hello World";
    }
    
    // Functions
    function set(uint256 x) public {
        storedData = x;
        emit DataStored(x, msg.sender);
    }
    
    function get() public view returns (uint256) {
        return storedData;
    }
    
    function setString(string memory newString) public onlyOwner {
        storedString = newString;
        emit StringStored(newString, msg.sender);
    }
    
    function getString() public view returns (string memory) {
        return storedString;
    }
    
    function increment() public {
        storedData += 1;
        emit DataStored(storedData, msg.sender);
    }
    
    function decrement() public {
        require(storedData > 0, "Cannot decrement below zero");
        storedData -= 1;
        emit DataStored(storedData, msg.sender);
    }
} 