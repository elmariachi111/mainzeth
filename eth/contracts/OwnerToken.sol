// SPDX-License-Identifier: Unlicensed

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OwnerToken is ERC20 {

    uint256 private constant INITIAL_SUPPLY = 10000;

    constructor(string memory name, string memory symbol) public ERC20(name, symbol) {

        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
