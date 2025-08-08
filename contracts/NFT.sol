// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SimpleNFT
 * @dev A simple ERC-721 NFT implementation
 */
contract SimpleNFT {
    // NFT details
    string public name;
    string public symbol;
    uint256 public totalSupply;
    uint256 public maxSupply;
    uint256 public mintPrice;
    
    // Token ownership
    mapping(uint256 => address) public ownerOf;
    mapping(address => uint256) public balanceOf;
    mapping(uint256 => string) public tokenURI;
    mapping(uint256 => address) public approved;
    mapping(address => mapping(address => bool)) public isApprovedForAll;
    
    // Events
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    event TokenMinted(uint256 indexed tokenId, address indexed to, string tokenURI);
    
    // Modifiers
    modifier onlyOwner(uint256 _tokenId) {
        require(ownerOf[_tokenId] == msg.sender, "Not the owner of this token");
        _;
    }
    
    modifier tokenExists(uint256 _tokenId) {
        require(ownerOf[_tokenId] != address(0), "Token does not exist");
        _;
    }
    
    modifier notMaxSupply() {
        require(totalSupply < maxSupply, "Max supply reached");
        _;
    }
    
    // Constructor
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply,
        uint256 _mintPrice
    ) {
        name = _name;
        symbol = _symbol;
        maxSupply = _maxSupply;
        mintPrice = _mintPrice;
        totalSupply = 0;
    }
    
    // Mint function
    function mint(string memory _tokenURI) public payable notMaxSupply {
        require(msg.value >= mintPrice, "Insufficient payment");
        
        totalSupply++;
        uint256 tokenId = totalSupply;
        
        ownerOf[tokenId] = msg.sender;
        balanceOf[msg.sender]++;
        tokenURI[tokenId] = _tokenURI;
        
        emit Transfer(address(0), msg.sender, tokenId);
        emit TokenMinted(tokenId, msg.sender, _tokenURI);
    }
    
    // Transfer function
    function transfer(address to, uint256 tokenId) public onlyOwner(tokenId) {
        require(to != address(0), "Cannot transfer to zero address");
        
        ownerOf[tokenId] = to;
        balanceOf[msg.sender]--;
        balanceOf[to]++;
        
        // Clear approval
        if (approved[tokenId] != address(0)) {
            approved[tokenId] = address(0);
        }
        
        emit Transfer(msg.sender, to, tokenId);
    }
    
    // Approve function
    function approve(address to, uint256 tokenId) public onlyOwner(tokenId) {
        approved[tokenId] = to;
        emit Approval(msg.sender, to, tokenId);
    }
    
    // Transfer from function
    function transferFrom(address from, address to, uint256 tokenId) public tokenExists(tokenId) {
        require(
            msg.sender == from || 
            msg.sender == approved[tokenId] || 
            isApprovedForAll[from][msg.sender],
            "Not authorized"
        );
        require(to != address(0), "Cannot transfer to zero address");
        
        ownerOf[tokenId] = to;
        balanceOf[from]--;
        balanceOf[to]++;
        
        // Clear approval
        if (approved[tokenId] != address(0)) {
            approved[tokenId] = address(0);
        }
        
        emit Transfer(from, to, tokenId);
    }
    
    // Set approval for all
    function setApprovalForAll(address operator, bool approved) public {
        isApprovedForAll[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }
    
    // Get approved address
    function getApproved(uint256 tokenId) public view tokenExists(tokenId) returns (address) {
        return approved[tokenId];
    }
    
    // Check if approved for all
    function isApprovedForAll(address owner, address operator) public view returns (bool) {
        return isApprovedForAll[owner][operator];
    }
    
    // Get token URI
    function getTokenURI(uint256 tokenId) public view tokenExists(tokenId) returns (string memory) {
        return tokenURI[tokenId];
    }
    
    // Update token URI (only owner)
    function updateTokenURI(uint256 tokenId, string memory newURI) public onlyOwner(tokenId) {
        tokenURI[tokenId] = newURI;
    }
    
    // Withdraw contract balance (only contract owner)
    function withdraw() public {
        payable(msg.sender).transfer(address(this).balance);
    }
    
    // Get contract info
    function getContractInfo() public view returns (
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply,
        uint256 _maxSupply,
        uint256 _mintPrice
    ) {
        return (name, symbol, totalSupply, maxSupply, mintPrice);
    }
} 