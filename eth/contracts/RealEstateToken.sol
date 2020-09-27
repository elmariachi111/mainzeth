// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./OwnerToken.sol";

contract RealEstateToken is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

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

    function getOwnerTokenAddress(uint256 estateTokenId) public view returns (address) 
    {
        return address(ownerTokens[estateTokenId]);
    }

    function hasMajority(address from, uint256 tokenId) public view returns (bool)
    {
        return ownerTokens[tokenId].balanceOf(from) > 5000;
    }

    function shareOf(address from, uint256 tokenId) public view returns (uint256) 
    {
        return ownerTokens[tokenId].balanceOf(from);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        require(hasMajority(from, tokenId));
        uint256 myShare = ownerTokens[tokenId].balanceOf(from);
        ownerTokens[tokenId].transferFrom(from, to, myShare);
        super.safeTransferFrom(from, to, tokenId);
    }

    function share(address to, uint256 amt, uint256 tokenId) public returns (bool) {
        return ownerTokens[tokenId].transferFrom(msg.sender, to, amt);
    }
}
