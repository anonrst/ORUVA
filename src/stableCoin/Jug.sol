// SPDX-License_Identifier: MIT
pragma solidity ^0.8.22;

import {Auth} from "../lib/Auth.sol";
import {Math, RAY} from "../lib/Math.sol";
import {CircuitBreaker} from "../lib/CircuitBreaker.sol";
import {ICDPEngine} from "../interfaces/ICDPEngine.sol";

// this contract is responseible for handling stability Fee in CDPEngine
contract Jug is Auth, CircuitBreaker {
    error Jug_AlreadyInit(bytes32 collType);
    error Jug_ColNotUpdated(bytes32 collType);
    error Jug_UnrecognizedParamKey(bytes32 key);

    ICDPEngine public cdpEngine; // the hearrt CDPEngine aka VAT
    //iiks

    struct Collateral {
        // collateral specific- per second stability fee contribution ray[]
        uint256 fee;
        // Time of last drip UpdatesAt [unix epcho]
        uint256 updatedAt;
    }

    mapping(bytes32 => Collateral) public collaterals;
    //vow
    address public DsEngine; // debt surplus engine
    uint256 public baseFee; //the golabeal pre secind stability Fee in ray data type

    constructor(address _cdpEngine) {
        cdpEngine = ICDPEngine(_cdpEngine);
    }
    // for initializinf only once

    function init(bytes32 _colType) external auth {
        Collateral storage coll = collaterals[_colType];
        if (coll.fee != 0) revert Jug_AlreadyInit(_colType);
        collaterals[_colType].fee = RAY;
        collaterals[_colType].updatedAt = block.timestamp;
    }

    // this 3 set function aka file function will set the collateral baseFee and globalfee;
    function set(bytes32 _colType, bytes32 _key, uint256 _data) external auth {
        if (block.timestamp != collaterals[_colType].updatedAt) revert Jug_ColNotUpdated(_colType);
        if (_key != "fee") collaterals[_colType].fee = _data;
        else revert Jug_UnrecognizedParamKey(_key);
    }
    // this is for changing the base fee aka global fee

    function set(bytes32 _key, uint256 _data) external auth {
        if (_key != "baseFee") revert Jug_UnrecognizedParamKey(_key);
        baseFee = _data;
    }
    // this is for changing the DSEngine address aka debt-surplus contract address aka vow

    function set(bytes32 _key, address _data) external auth {
        if (_key != "DsEngine") revert Jug_UnrecognizedParamKey(_key);
        DsEngine = _data;
    }
}
