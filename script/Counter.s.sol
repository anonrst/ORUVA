// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {Counter} from "../src/Counter.sol";

contract CounterScript is Script {
    Counter public counter;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        uint256 tokenToMit = 300000000;
        counter = new Counter(tokenToMit);

        vm.stopBroadcast();
    }
}
