// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.6.12;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20.sol";

contract OwnerToken is ERC20UpgradeSafe {

    uint256 private constant INITIAL_SUPPLY = 10000;

    function initialize(string memory name, string memory symbol) public initializer {
        __ERC20_init(name, symbol);
        //_setupDecimals(0);
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
