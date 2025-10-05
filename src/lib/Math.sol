// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

uint256 constant WAD = 10 ** 18;
uint256 constant RAY = 10 ** 27;
uint256 constant RAD = 10 ** 45;



/// @title Math Library
/// @notice Handles addition of uint and int safely without overflow
library Math {
    /// @notice Adds an int `_y` to uint `_x` safely
    /// @param _x The base uint value
    /// @param _y The int value to add (can be negative)
    /// @return z The resulting uint after addition/subtraction
    function add(uint _x, int _y) internal pure returns (uint z) {
        // if _y is positive, just add it
        // if _y is negative, subtract its absolute value from _x
        return _y >= 0 ? _x + uint(_y) : _x - uint(-_y);
    }
}
