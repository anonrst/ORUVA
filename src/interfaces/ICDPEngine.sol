// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

interface ICDPEngine {
    struct Collateral {
        uint256 debt;
        uint256 accRate;
        uint256 spot;
        uint256 maxDebt;
        uint256 minDebt;
    }

    struct Position {
        uint256 collateral;
        uint256 debt;
    }

    function modifyCdp(bytes32, address, address, address, int256, int256) external;

    function init(bytes32) external;
    //slip
    function modifyCollateralBalance(bytes32, address, int256) external;

    //move
    function transferInrc(address, address, uint256) external;

    function allowAccountModification(address) external;
    //vatlike For stting priceFeed From Calling Contract
    function set(bytes32, bytes32, uint256) external;
    // for making chages in collateral stavilityFee
    function fold(bytes32, address, int256) external;

    function set(bytes32, uint256) external;
    function denyAccountModification(address) external;
}
