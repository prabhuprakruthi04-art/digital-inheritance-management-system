// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DigitalInheritance
 * @notice Manages digital estate lifecycle states, proof-of-life heartbeat verification,
 * and cryptographic key share releases for the Digital Inheritance Management System (DIMS).
 */
contract DigitalInheritance {
    // Inheritance lifecycle states
    enum InheritanceState {
        ACTIVE,
        PENDING_VERIFICATION,
        INHERITED
    }

    struct InheritancePlan {
        address owner;
        address nominee;
        string verificationHash; // SHA-256 integrity hash of initial biometric or asset anchor
        string ipfsCid;          // Reference CID in decentralized storage
        InheritanceState state;
        uint256 lastHeartbeat;
        uint256 createdAt;
        uint256 inheritedAt;
        bool exists;
    }

    // Mapping of Owner Wallet Address -> Inheritance Plan
    mapping(address => InheritancePlan) private plans;

    // Mapping of Transfer Authorization ID -> Owner Address
    mapping(string => address) private authToOwner;

    // Owner / Administrator of contract
    address public admin;

    // Events
    event PlanCreated(
        address indexed owner,
        address indexed nominee,
        string ipfsCid,
        uint256 timestamp
    );

    event HeartbeatRecorded(
        address indexed owner,
        uint256 timestamp
    );

    event StateChanged(
        address indexed owner,
        InheritanceState indexed newState,
        uint256 timestamp
    );

    event KeyShareReleased(
        address indexed owner,
        address indexed nominee,
        string authId,
        uint256 timestamp
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only contract administrator can invoke this method");
        _;
    }

    modifier onlyOwnerOrAdmin(address planOwner) {
        require(
            msg.sender == planOwner || msg.sender == admin,
            "Caller is neither plan owner nor contract administrator"
        );
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /**
     * @notice Creates or updates an on-chain inheritance plan
     */
    function createPlan(
        address nominee,
        string memory verificationHash,
        string memory ipfsCid
    ) external returns (bool) {
        require(nominee != address(0), "Invalid nominee wallet address");
        require(nominee != msg.sender, "Owner cannot designate self as nominee");

        plans[msg.sender] = InheritancePlan({
            owner: msg.sender,
            nominee: nominee,
            verificationHash: verificationHash,
            ipfsCid: ipfsCid,
            state: InheritanceState.ACTIVE,
            lastHeartbeat: block.timestamp,
            createdAt: block.timestamp,
            inheritedAt: 0,
            exists: true
        });

        emit PlanCreated(msg.sender, nominee, ipfsCid, block.timestamp);
        return true;
    }

    /**
     * @notice Records biometric proof-of-life heartbeat
     */
    function recordHeartbeat() external returns (bool) {
        require(plans[msg.sender].exists, "No active inheritance plan found for sender");
        require(plans[msg.sender].state != InheritanceState.INHERITED, "Inheritance already executed");

        plans[msg.sender].lastHeartbeat = block.timestamp;
        plans[msg.sender].state = InheritanceState.ACTIVE;

        emit HeartbeatRecorded(msg.sender, block.timestamp);
        return true;
    }

    /**
     * @notice Transitions inheritance state (e.g. from ACTIVE -> PENDING_VERIFICATION or INHERITED)
     */
    function transitionState(
        address planOwner,
        InheritanceState newState
    ) external onlyOwnerOrAdmin(planOwner) returns (bool) {
        require(plans[planOwner].exists, "Plan does not exist for specified owner");

        plans[planOwner].state = newState;
        if (newState == InheritanceState.INHERITED) {
            plans[planOwner].inheritedAt = block.timestamp;
        }

        emit StateChanged(planOwner, newState, block.timestamp);
        return true;
    }

    /**
     * @notice Emits key share release event on-chain upon verified claim
     */
    function releaseKeyShare(
        address planOwner,
        string memory authId
    ) external onlyOwnerOrAdmin(planOwner) returns (bool) {
        require(plans[planOwner].exists, "Plan does not exist");
        require(
            plans[planOwner].state == InheritanceState.PENDING_VERIFICATION ||
            plans[planOwner].state == InheritanceState.INHERITED,
            "Plan is still active; cannot release key share"
        );

        authToOwner[authId] = planOwner;
        plans[planOwner].state = InheritanceState.INHERITED;
        plans[planOwner].inheritedAt = block.timestamp;

        emit KeyShareReleased(planOwner, plans[planOwner].nominee, authId, block.timestamp);
        emit StateChanged(planOwner, InheritanceState.INHERITED, block.timestamp);
        return true;
    }

    /**
     * @notice Returns inheritance plan details for a specific owner
     */
    function getPlan(address planOwner) external view returns (
        address owner,
        address nominee,
        string memory verificationHash,
        string memory ipfsCid,
        InheritanceState state,
        uint256 lastHeartbeat,
        uint256 createdAt,
        uint256 inheritedAt
    ) {
        require(plans[planOwner].exists, "Plan does not exist");
        InheritancePlan memory p = plans[planOwner];
        return (
            p.owner,
            p.nominee,
            p.verificationHash,
            p.ipfsCid,
            p.state,
            p.lastHeartbeat,
            p.createdAt,
            p.inheritedAt
        );
    }

    /**
     * @notice Checks if nominee wallet address matches assigned plan
     */
    function verifyNominee(address planOwner, address candidateNominee) external view returns (bool) {
        if (!plans[planOwner].exists) return false;
        return plans[planOwner].nominee == candidateNominee;
    }
}
