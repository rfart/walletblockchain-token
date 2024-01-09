// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/BBT.sol";

contract BBTTest is Test {
    BBT public bbt;
    address constant owner = address(1);
    address constant alice = address(2);

    function setUp() external {
        bbt = new BBT(
            8,
            owner,
            type(uint256).max
        );
    }

    function testTransfer(uint256 _amount) external {
        vm.prank(owner);
        bbt.transfer(alice, _amount);

        assertEq(bbt.balanceOf(alice), _amount);
    }
}