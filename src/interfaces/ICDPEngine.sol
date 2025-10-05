// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

   // it's function when we have to update the collateral value assigned to a vault
interface ICDPEngine {
    function modifyCollateralBalance(bytes32, address, int) external;
}
