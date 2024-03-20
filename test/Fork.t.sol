// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract TestFork is Test {
    IERC20 constant bbt = IERC20(0x0A20ac8E25f25Af6601a1D099E3F8059239A1f99);
    address constant owner = 0xb1F93513F5779c0cE572b05F12205CafB90C24D2;

    function testCheckBalance() external {
        uint256 _bal = bbt.balanceOf(owner);

        console.log("BALANCE: ", _bal);
    }
}