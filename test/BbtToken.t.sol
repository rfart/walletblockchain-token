// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "./Event.sol";
import {BbtToken} from "../contracts/BbtToken.sol";

contract BbtTokenTest is Test, Event {
    BbtToken public bbt;
    uint256 constant _maxToken = 1000_000_000;

    address constant owner = address(1);
    address constant alice = address(2);
    address constant bob = address(3);
    address constant clara = address(4);

    function setUp() external {
        vm.prank(owner);
        bbt = new BbtToken(
            "BabyBoomToken",
            "BBT",
            _maxToken,
            owner
        );
    }

    function testTransfer() external {
        console.log("Test Case: Owner Transferring 10 BBT to Alice Address.");
        uint256 _amount = 10;
        vm.prank(owner);

        bbt.transfer(alice, _amount);
        console.log("Test Transfer: Sending BBT:", _amount);

        assertEq(bbt.balanceOf(alice), _amount);
    }

    function testApprove() external {
        console.log("Test Case: Owner Approving 10 BBT to Alice Address. Increasing her allowance");
        uint256 _amount = 10;
        address _spender = alice;

        vm.prank(owner);
        bbt.approve(_spender, _amount);
        console.log("Test Approve: Approve BBT to spender:", _amount);

        assertEq(bbt.allowance(owner, _spender), _amount);
    }

    function testEventTransfer() external {
        console.log("Test Case: Owner Transferring 10 BBT to Alice Address> Contracts correctly emit Transfer event");
        uint256 _amount = 10;
        vm.startPrank(owner);

        vm.expectEmit(true, true, false, true);
        emit Transfer(owner, alice, _amount);

        bbt.transfer(alice, _amount);
        console.log("Test Transfer: Sending BBT:", _amount);

        vm.stopPrank();
    }

    function testGasless() external {
        console.log("Test Case: User sign off-chain transaction,");
        uint256 _prv = 1234;
        address _user = vm.addr(_prv);
        uint256 _amount = 10;
        uint256 _deadline = block.timestamp + 1 hours;

        //  Give user n of BBT
        deal(address(bbt), _user, _amount);

        bytes32 _hash = _createPermitHash(
            _user,
            owner,
            _amount,
            bbt.nonces(_user),
            _deadline
        );

        (uint8 _v, bytes32 _r, bytes32 _s) = vm.sign(_prv, _hash);
        
        vm.startPrank(owner);
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

    function testFailStop() external {
        // Owner executes stop()
        vm.prank(owner);
        bbt.stop();
        console.log("Executing start()");
        
        uint256 _amount = 10;
        deal(address(bbt), alice, _amount);

        // Expected fail when transferring Token
        vm.prank(alice);
        bbt.transfer(bob, _amount);
        console.log("Test Transfer: Sending BBT:", _amount);
    }

// FUZZ TESTS


    function testTransfer_fuzz(uint256 _amount) external {
        vm.assume(_amount != 0);
        vm.assume(_amount <= _maxToken);
        vm.prank(owner);
        bbt.transfer(alice, _amount);
        assertEq(bbt.balanceOf(alice), _amount);
    }

    function testApprove_fuzz(address _spender, uint256 _amount) external {
        vm.assume(_amount != 0);
        vm.assume(_amount <= _maxToken);
        vm.prank(owner);
        bbt.approve(_spender, _amount);
        assertEq(bbt.allowance(owner, _spender), _amount);
    }

    function testEventTransfer_fuzz(uint256 _amount) external {
        vm.assume(_amount != 0);
        vm.assume(_amount <= _maxToken);
        vm.startPrank(owner);

        vm.expectEmit(true, true, false, true);
        emit Transfer(owner, alice, _amount);
        bbt.transfer(alice, _amount);

        vm.stopPrank();
    }

    function testGasless_fuzz(
        uint256 _prv,
        uint256 _amount,
        uint256 _deadline
    ) external {
        vm.assume(_prv < type(uint32).max);
        vm.assume(_prv != 0);
        address _user = vm.addr(_prv);
        vm.assume(_amount != 0);
        vm.assume(_amount <= _maxToken);
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
    ) private view returns(bytes32) {
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