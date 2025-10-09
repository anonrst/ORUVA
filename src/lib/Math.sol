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
    function add(uint256 _x, int256 _y) internal pure returns (uint256 z) {
        // if _y is positive, just add it
        // if _y is negative, subtract its absolute value from _x
        return _y >= 0 ? _x + uint256(_y) : _x - uint256(-_y);
    }

    function rdiv(uint256 x, uint256 y) internal pure returns (uint256 z) {
        z = x * RAY / y;
    }

    function rmul(uint256 x, uint256 y) internal pure returns (uint256 z) {
        z = x * y / RAY;
    }

    function sub(uint256 x, int256 y) internal pure returns (uint256 z) {
        z = x - uint256(y);
        require(y <= 0 || z <= x);
        require(y >= 0 || z >= x);
    }

    function min(uint256 x, uint256 y) internal pure returns (uint256 z) {
        z = x <= y ? x : y;
    }

    function max(uint256 x, uint256 y) internal pure returns (uint256 z) {
        z = x >= y ? x : y;
    }

    function mul(uint256 x, int256 y) internal pure returns (int256 z) {
        z = int256(x) * y;
        require(int256(x) >= 0);
        require(y == 0 || z / y == int256(x));
    }
}
