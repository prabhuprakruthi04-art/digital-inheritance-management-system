// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DocumentRegistry {
    struct DocumentRecord {
        string docId;
        string ipfsCid;
        string fileHash;
        address owner;
        uint256 timestamp;
    }

    mapping(string => DocumentRecord) private records;

    event DocumentRegistered(
        string indexed docId,
        string ipfsCid,
        string fileHash,
        address indexed owner,
        uint256 timestamp
    );

    function registerDocument(
        string memory docId,
        string memory ipfsCid,
        string memory fileHash
    ) public returns (bool) {
        require(bytes(records[docId].docId).length == 0, "Document already registered");

        records[docId] = DocumentRecord({
            docId: docId,
            ipfsCid: ipfsCid,
            fileHash: fileHash,
            owner: msg.sender,
            timestamp: block.timestamp
        });

        emit DocumentRegistered(docId, ipfsCid, fileHash, msg.sender, block.timestamp);
        return true;
    }

    function getDocument(string memory docId) public view returns (
        string memory ipfsCid,
        string memory fileHash,
        address owner,
        uint256 timestamp
    ) {
        require(bytes(records[docId].docId).length > 0, "Document does not exist");
        DocumentRecord memory doc = records[docId];
        return (doc.ipfsCid, doc.fileHash, doc.owner, doc.timestamp);
    }
}