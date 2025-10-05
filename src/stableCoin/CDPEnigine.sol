// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Auth} from "../lib/Auth.sol";
import {CircuitBreaker} from "../lib/CircuitBreaker.sol";
import {Math} from "../lib/Math.sol";

/// @title CDP Engine
/// @notice Manages user collateral balances
contract CDPEngine is Auth, CircuitBreaker {
    // Mapping from collateral type => user address => balance
    mapping(bytes32 => mapping(address => uint)) public gem;

    /// @notice Modify user's collateral balance
    /// @param _collateralType The type of collateral
    /// @param _user The user's address
    /// @param _wad The amount to modify (can be negative)
    function modifyCollateralBalance(
        bytes32 _collateralType,
        address _user,
        int256 _wad
    ) external auth {
        gem[_collateralType][_user] = Math.add(
            gem[_collateralType][_user],
            _wad
        );
    }
}
