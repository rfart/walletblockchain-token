// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

contract Sellon is ERC20, ERC20Burnable, Ownable2Step {
    constructor(uint256 _initialMint)
        ERC20("sellon", "sell")
        Ownable(msg.sender)
    {
        if(_initialMint != 0) _mint(msg.sender, _initialMint);
    }

    function mint(address _to, uint256 _amount) external onlyOwner {
        _mint(_to, _amount);
    }
}
