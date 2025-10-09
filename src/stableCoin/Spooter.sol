// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Auth} from "../lib/Auth.sol";
import {ICDPEngine} from "../interfaces/ICDPEngine.sol";
import {CircuitBreaker} from "../lib/CircuitBreaker.sol";
import {Math, RAD} from "../lib/Math.sol";

interface IPriceFeed {
    function peek() external returns (uint256, bool);
}

// this contract  fetch pricesFeed from pip contract and set IT to VAT contract aka cdp
contract Spotter is Auth, CircuitBreaker {
    error SPotter_LeyNotRecognized(bytes32 _key);

    ICDPEngine public cdpEngine; // vat contract

    // iiks=  stores collateral priceFeed and thier price in refernce of
    struct Collateral {
        IPriceFeed priceFeed; // the priceFeed Of Collateral
        // mat is ray e.g 1e27
        uint256 liquidationRatio; // this is the liquidation  ratio aka safety margin that deiced the minimum fund must e i an vault to not to be liquidate
    }

    event Poke(bytes32 _colType, bytes32 _val, uint256 _spot);

    mapping(bytes32 => Collateral) public collaterals;
    uint256 public par; // it's the price of INRCToken to its refernce collateral basically its like the price oF DAI in terms of USD

    constructor(address _cdpEngine) {
        cdpEngine = ICDPEngine(_cdpEngine);
        par = 10 ** 27;
    }

    // this is for chaning the pricedFeed of collateral
    function set(bytes32 _colType, bytes32 _key, address _data) external auth notStopped {
        if (_key != "priceFeed") revert SPotter_LeyNotRecognized(_key);
        collaterals[_colType].priceFeed = IPriceFeed(_data);
    }
}
