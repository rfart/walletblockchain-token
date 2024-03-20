// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../contracts/BBT.sol";

import "./Event.sol";

contract BBTTest is Test, Event {
    BBT public bbt;
    address constant owner = address(1);
    address constant alice = address(2);
    address constant bob = address(3);
    address constant clara = address(4);

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

    function testApprove(address _spender, uint256 _amount) external {
        vm.prank(owner);
        bbt.approve(_spender, _amount);
        assertEq(bbt.allowance(owner, _spender), _amount);
    }

    function testEventTransfer(uint256 _amount) external {
        vm.startPrank(owner);

        vm.expectEmit(true, true, false, true);
        emit Transfer(owner, alice, _amount);
        bbt.transfer(alice, _amount);

        vm.stopPrank();
    }

    function testGasless(
        uint256 _prv,
        uint256 _amount,
        uint256 _deadline
    ) external {
        vm.assume(_prv < type(uint32).max);
        vm.assume(_prv != 0);
        address _user = vm.addr(_prv);
        vm.assume(_amount != 0);
        vm.assume(_amount <= type(uint160).max);
        vm.assume(_deadline > block.timestamp);

        vm.startPrank(owner);
        bbt.transfer(_user, _amount);
        bytes32 _hash = _createPermitHash(
            _user,
            owner,
            _amount,
            bbt.nonces(_user),
            _deadline
        );

        (uint8 _v, bytes32 _r, bytes32 _s) = vm.sign(_prv, _hash);
        bbt.permit(
            _user, 
            owner, 
            _amount, 
            _deadline, 
            _v, _r, _s
        );

        bbt.transferFrom(_user, alice, _amount);

        vm.stopPrank();

        assertEq(bbt.balanceOf(alice), _amount);
    }

    function _createPermitHash(
        address _owner,
        address _spender,
        uint256 _value,
        uint256 _nonces,
        uint256 _deadline
    ) private returns(bytes32) {
        return keccak256(
                abi.encodePacked(
                    "\x19\x01",
                    bbt.DOMAIN_SEPARATOR(),
                    keccak256(
                        abi.encode(
                            keccak256(
                                "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
                            ),
                            _owner,
                            _spender,
                            _value,
                            _nonces,
                            _deadline
                        )
                    )
                )
            );
    }
}
