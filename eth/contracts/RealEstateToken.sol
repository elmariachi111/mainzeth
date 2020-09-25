// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("REAL Estate", "RST") public {}

    function mintEstate(address initialOwner, string memory estateName) public returns (uint256) {
        
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _safeMint(initialOwner, newItemId);
        _setTokenURI(newItemId, estateName);

        return newItemId;
    }
}


