// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./OwnerToken.sol";

contract RealEstateToken is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => bool) allowances;
    mapping(uint256 => OwnerToken) public ownerTokens;

    constructor() public ERC721("REAL Estate", "RST") {}

    function mintEstate(address initialOwner, string memory estateName)
        public
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _safeMint(initialOwner, newItemId);
        _setTokenURI(newItemId, estateName);

        string memory otName = string(abi.encodePacked("Owner Token ", newItemId));
        string memory otSymbol = string(abi.encodePacked("RE", newItemId));

        OwnerToken _token = new OwnerToken(otName, otSymbol);
        _token.transfer(initialOwner, 10000);
        ownerTokens[newItemId] = _token;

        return newItemId;
    }

    function getOwnerTokenAddress(uint256 estateTokenId) public returns (address) 
    {
        return address(ownerTokens[estateTokenId]);
    }

    function allow(uint256 tokenId) public {
        require(msg.sender == ownerOf(tokenId), "only the owner may approve!");
        allowances[tokenId] = true;
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        require(allowances[tokenId] == true, "you must allow that first!");
        super.safeTransferFrom(from, to, tokenId);
        allowances[tokenId] = false;
    }
}
