// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
import {ERC20} from "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol" ;

contract Counter is ERC20 {
    constructor(uint256 _tokenToMint) ERC20("AnonTOken", "TNT"){
            _mint(msg.sender,_tokenToMint);
    }
}
