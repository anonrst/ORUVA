// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;
import {Auth} from "../lib/Auth.sol";
import {CircuitBreaker} from "../lib/CircuitBreaker.sol";
import {RAD} from "../lib/Math.sol";

interface ICDPEngine {
    function transferFrom(address from, address to, uint256 wad) external;
}

interface IDai {
    function mint(address to, uint256 amount) external;

    function burn(address to, uint256 amount) external;
}

// this contract is also like gemJoin that handles user's collateral managgemnet and mint or bunrs DAi token aka borrow dai token this stage comes after the user locked their collatral value it is like transfer from mean this will call

contract DaiJoin is CircuitBreaker, Auth {
    // interface of main dai token
    IDai public daiToken;
    //intreface of vat token
    ICDPEngine public cdpEngine;

    event Joined(address indexed user, uint256 wad);
    event Exits(address indexed user, uint256 wad);

    constructor(address _cdpEngine, address _daiToken) {
        daiToken = IDai(_daiToken);
        cdpEngine = ICDPEngine(_cdpEngine);
    }

    function stop() external auth {
        _stop();
    }

    function join(address _user, uint256 wad) external {
        cdpEngine.transferFrom(address(this), _user, RAD * wad);
        daiToken.burn(_user, wad);
        emit Joined(_user, wad);
    }

    function exit(address _user, uint256 wad) external notStopped {
        cdpEngine.transferFrom(_user, address(this), RAD * wad);
        daiToken.mint(_user, wad);
        emit Exits(_user, wad);
    }
}
