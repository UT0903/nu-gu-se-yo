// SPDX-License-Identifier: MIT
pragma solidity <= 0.8.14;

contract MainContract {

    // Address of node.js server
    uint constant MAX_BENEFICIARIES = 64;
    address constant SERVER_ADDR = 0xdCad3a6d3569DF655070DEd06cb7A1b2Ccd1D3AF;

    struct BeneficiaryInformation {
        address addr;
        uint portion;
    }

    struct Information {
        bool created;
        uint balance; // recorded in wei
        BeneficiaryInformation[MAX_BENEFICIARIES] beneficiaries;
        uint numBeneficiaries;
        uint total;
    }

    // Mapping from "hash of ID" to "struct Information"
    mapping(bytes32 => Information) info;

    event Deposit  (address user, uint amount);
    event Withdraw (address user, uint amount);
    event Receive  (address from, uint amount);
    
    // Check whether requests are from node.js server
    modifier fromServer {
        require(msg.sender == SERVER_ADDR, "Only node.js server can use this function.");
        _;
    }

    modifier entryCreated (bytes32 id) {
        require(info[id].created == true, "Create info entry for this id first.");
        _;
    }

    modifier entryUncreated (bytes32 id) {
        require(info[id].created == false, "There is an existing entry for this id.");
        _;
    }

    function createInfoEntry (bytes32 id) public fromServer entryUncreated(id) {
        info[id].created = true;
    }
    
    // No need to check sender for deposit.
    function deposit (bytes32 id) public payable entryCreated(id) {
        emit Deposit(msg.sender, msg.value);
        info[id].balance += msg.value;
    }
    
    function withdraw (bytes32 id, uint amount) external fromServer entryCreated(id) {
        require(amount <= info[id].balance, "Inadequate balance.");
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Failed to send Ether.");
        emit Withdraw(msg.sender, amount);
    }
    
    function addBeneficiary (bytes32 id, address addr, uint portion) public fromServer entryCreated(id) {
        require(info[id].numBeneficiaries < MAX_BENEFICIARIES, "Too many beneficiaries, Max: 64.");
        require(info[id].total + portion <= 100, "Invalid portion(> 100%), please adjust other beneficiaries' portion.");
        for (uint i = 0; i < info[id].numBeneficiaries; i++) {
            require(info[id].beneficiaries[i].addr != addr, "This address is already a beneficiary.");
        }
        info[id].beneficiaries[info[id].numBeneficiaries++] = BeneficiaryInformation({
            addr: addr,
            portion: portion
        });
        info[id].total += portion;
    }

    function removeBeneficiary (bytes32 id, address addr) public fromServer {
        require(info[id].created == true, "Create info entry for this id first.");
        uint idx = 0;
        bool found = false;
        for (uint i = 0; i < MAX_BENEFICIARIES; i++) {
            if (info[id].beneficiaries[i].addr == addr) {
                idx = i;
                found = true;
                break;
            }
        }
        require(found, "Cannot find this beneficiary.");
        info[id].beneficiaries[idx] = BeneficiaryInformation({
            addr: info[id].beneficiaries[info[id].numBeneficiaries - 1].addr,
            portion: info[id].beneficiaries[info[id].numBeneficiaries - 1].portion
        });
        delete info[id].beneficiaries[info[id].numBeneficiaries--];
    }

    function adjustPortion (bytes32 id, uint idx, uint _portion) public fromServer entryCreated(id) {
        require(
            info[id].total - info[id].beneficiaries[idx].portion + _portion <= 100, 
            "Invalid portion(> 100%), please adjust other beneficiaries' portion"
        );
        info[id].beneficiaries[idx].portion = _portion;
    }

    function execute (bytes32 id) public fromServer entryCreated(id) {
        require(info[id].total == 100, "Invalid portion(!= 100%), please adjust beneficiaries' portions");
        for (uint i = 0; i < info[id].numBeneficiaries; i++) {
            uint value = info[id].balance * info[id].beneficiaries[i].portion / 100;
            (bool success, ) = info[id].beneficiaries[i].addr.call{value: value}("");
            require(success, "Failed to distribute Ethers to beneficiaries.");
        }
    }

    // Functions below are for information query
    function getNumBeneficiaries (bytes32 id) public view fromServer entryCreated(id) returns(uint) {
        return info[id].numBeneficiaries;
    }

    function getBeneficiary (bytes32 id, uint idx) public view fromServer entryCreated(id) returns(address, uint) {
        return (info[id].beneficiaries[idx].addr, info[id].beneficiaries[idx].portion);
    }

    function getInformation (bytes32 id) public view fromServer entryCreated(id) returns(uint, uint) {
        return (info[id].balance, info[id].numBeneficiaries);
    }

    receive() external payable {
        emit Receive(msg.sender, msg.value);
    }
}

