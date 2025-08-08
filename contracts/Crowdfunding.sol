// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Crowdfunding
 * @dev A simple crowdfunding platform smart contract
 */
contract Crowdfunding {
    // Campaign structure
    struct Campaign {
        address payable creator;
        string title;
        string description;
        uint256 goal;
        uint256 raised;
        uint256 deadline;
        bool claimed;
        bool exists;
    }
    
    // Campaign mapping
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    
    // State variables
    uint256 public campaignCount;
    uint256 public platformFee = 2; // 2% platform fee
    
    // Events
    event CampaignCreated(uint256 indexed campaignId, address indexed creator, string title, uint256 goal, uint256 deadline);
    event ContributionMade(uint256 indexed campaignId, address indexed contributor, uint256 amount);
    event FundsClaimed(uint256 indexed campaignId, address indexed creator, uint256 amount);
    event RefundIssued(uint256 indexed campaignId, address indexed contributor, uint256 amount);
    
    // Modifiers
    modifier campaignExists(uint256 _campaignId) {
        require(campaigns[_campaignId].exists, "Campaign does not exist");
        _;
    }
    
    modifier campaignActive(uint256 _campaignId) {
        require(block.timestamp < campaigns[_campaignId].deadline, "Campaign has ended");
        _;
    }
    
    modifier campaignEnded(uint256 _campaignId) {
        require(block.timestamp >= campaigns[_campaignId].deadline, "Campaign is still active");
        _;
    }
    
    modifier onlyCreator(uint256 _campaignId) {
        require(msg.sender == campaigns[_campaignId].creator, "Only creator can call this function");
        _;
    }
    
    // Create a new campaign
    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _goal,
        uint256 _durationInDays
    ) public returns (uint256) {
        require(_goal > 0, "Goal must be greater than 0");
        require(_durationInDays > 0 && _durationInDays <= 365, "Duration must be between 1 and 365 days");
        
        campaignCount++;
        uint256 campaignId = campaignCount;
        
        campaigns[campaignId] = Campaign({
            creator: payable(msg.sender),
            title: _title,
            description: _description,
            goal: _goal,
            raised: 0,
            deadline: block.timestamp + (_durationInDays * 1 days),
            claimed: false,
            exists: true
        });
        
        emit CampaignCreated(campaignId, msg.sender, _title, _goal, campaigns[campaignId].deadline);
        return campaignId;
    }
    
    // Contribute to a campaign
    function contribute(uint256 _campaignId) public payable campaignExists(_campaignId) campaignActive(_campaignId) {
        require(msg.value > 0, "Contribution must be greater than 0");
        
        Campaign storage campaign = campaigns[_campaignId];
        campaign.raised += msg.value;
        contributions[_campaignId][msg.sender] += msg.value;
        
        emit ContributionMade(_campaignId, msg.sender, msg.value);
    }
    
    // Claim funds if campaign is successful
    function claimFunds(uint256 _campaignId) public campaignExists(_campaignId) campaignEnded(_campaignId) onlyCreator(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(!campaign.claimed, "Funds already claimed");
        require(campaign.raised >= campaign.goal, "Campaign did not reach goal");
        
        campaign.claimed = true;
        uint256 platformFeeAmount = (campaign.raised * platformFee) / 100;
        uint256 creatorAmount = campaign.raised - platformFeeAmount;
        
        campaign.creator.transfer(creatorAmount);
        
        emit FundsClaimed(_campaignId, msg.sender, creatorAmount);
    }
    
    // Get refund if campaign failed
    function getRefund(uint256 _campaignId) public campaignExists(_campaignId) campaignEnded(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.raised < campaign.goal, "Campaign was successful");
        
        uint256 contribution = contributions[_campaignId][msg.sender];
        require(contribution > 0, "No contribution found");
        
        contributions[_campaignId][msg.sender] = 0;
        payable(msg.sender).transfer(contribution);
        
        emit RefundIssued(_campaignId, msg.sender, contribution);
    }
    
    // Get campaign details
    function getCampaign(uint256 _campaignId) public view campaignExists(_campaignId) returns (
        address creator,
        string memory title,
        string memory description,
        uint256 goal,
        uint256 raised,
        uint256 deadline,
        bool claimed
    ) {
        Campaign storage campaign = campaigns[_campaignId];
        return (
            campaign.creator,
            campaign.title,
            campaign.description,
            campaign.goal,
            campaign.raised,
            campaign.deadline,
            campaign.claimed
        );
    }
    
    // Get contribution amount
    function getContribution(uint256 _campaignId, address _contributor) public view returns (uint256) {
        return contributions[_campaignId][_contributor];
    }
    
    // Check if campaign is successful
    function isSuccessful(uint256 _campaignId) public view campaignExists(_campaignId) returns (bool) {
        Campaign storage campaign = campaigns[_campaignId];
        return campaign.raised >= campaign.goal;
    }
    
    // Check if campaign has ended
    function hasEnded(uint256 _campaignId) public view campaignExists(_campaignId) returns (bool) {
        return block.timestamp >= campaigns[_campaignId].deadline;
    }
} 