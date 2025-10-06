// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Auth} from "../lib/Auth.sol";
import {CircuitBreaker} from "../lib/CircuitBreaker.sol";
import {Math} from "../lib/Math.sol";

// in this whole contract the collateral type exist because MakerDao designed to handle more than one type of collateral type so an here are two main fucntion one for modifyCollateralBalance aka slip it only chages the balance they have but another transferInrc aka move it move from one wallet to anoth and these works CDPEngine internally
/// @title CDP Engine
/// @notice Handles user collateral balances and stablecoin (INRC) movements
//vat
contract CDPEngine is Auth, CircuitBreaker {
    error CDPEngine_NotAllowedToModifyAccount();
    error CDPEngine_NotAllowedToModifyAccountGemSource();
    error CDPEngine_KeyNotRecogNized(bytes32 key);
    error CDPEngine_NotSafe();
    error CDPEngine_CollateralAlreadyInit();
    error CDPEngine_CollateralNotInitialized();
    error CDPEngine_MinimunDebtExceeded();
    error CDPEngine_NotAllowedToModifyAccountINRCDest();
    error CDPEngine_MaxDebtExceeded();
    // ilk

    struct Collateral {
        // the art is the debt the overall system has befoer componding to rate e.g. 1e18
        // we  calcualte art with formula d0 / r0 + d1/ r1 on go on with accumulation so in result as we know the formula for finding debt is d = amount * rate so here as amount is our art so thier art = d / rate
        //art
        uint256 debt;
        //rate
        // htis is the accumulation of every rate
        uint256 accRate;
        // let assume safemargin is 0.2 ( 1 eth = $2000)
        // formula for spot =  price * ( 1 - safeMargit)
        // formula for spot = collateralPrice * (1 - 0.2 )= 2000 -400 = $1600
        // so the maximum dai amount  user can borrow  is  = spot * collateralAmount = 2000 * ( 1- 0.2) * 1 = $1600 mean it can borrow 1600 amount of dai
        // at time t price = 2000 = 1800 thenmac Borrow = 1800 * (1 - 0.2) * 1; 1440 amount of dai it can borrow
        // so now as it's low from safety margin that was only for 1600 this mean now it'll liquidate and another guy will for this user dai and get his available eth still the dai will be in loo but the twiest its the liqudator got the 1 eth just by clear the whole debt by paying 1600 which was max borrow amount
        uint256 spot;
        // line
        // the maxDebt we solved it
        uint256 maxDebt;
        // dust
        // we need it because if liquidation ocst more than the amount of dai no one will liquididate so
        uint256 minDebt;
    }

    // Urn aka CDP , or bolt (vault)
    struct Position {
        //  the colateral lockefd = ilk
        uint256 collateral;
        //the max borrow = art
        uint256 debt;
    }

    mapping(bytes32 => Collateral) public collaterals;
    mapping(bytes32 => mapping(address => Position)) public positions;

    // Mapping: collateral type => user => balance
    mapping(bytes32 => mapping(address => uint256)) public gem;

    // Mapping: user => stablecoin balance
    mapping(address => uint256) public inrc;

    // Mapping: owner => user => permission to modify balances
    mapping(address => mapping(address => bool)) public can;
    // line  refers to overall system maxdevt
    // total inrc Ceinling mean the last stoplostt;
    uint256 public systemMaxDebt;
    //total cuurernt DEbT
    uint256 public systemDebt;

    function cage() external auth {
        _stop();
    }

    // this function will modify the CDP overal mint burnlocak and unlock
    // frob arggs i, u, v, w, dink, dart
    // i mean the collateral type
    // u modifing position Of  user U mean that address that maps the CDP
    // v useing gem(collateral) of user v aka source
    // creating coin (inrc) for user w aka dest
    // dink is basically the change in  collateral like increse and decrease
    // dark is chanage is amount of DEbt;
    // frob
    function modifyCdp(
        bytes32 _collType,
        address _cdp,
        address _gemSource,
        address _inrcDest,
        int256 _deltaCollat,
        int256 _deltaDebt
    ) external auth notStopped {
        Position memory pos = positions[_collType][_cdp];
        Collateral memory col = collaterals[_collType];

        if (col.accRate == 0) revert CDPEngine_CollateralNotInitialized();
        pos.collateral = Math.add(pos.collateral, _deltaCollat);
        col.debt = Math.add(col.debt, _deltaDebt);
        pos.debt = Math.add(pos.debt, _deltaDebt);

        int256 deltaCoin = Math.mul(col.accRate, _deltaDebt); // hhis is the extra debbt system has to add in overall
        uint256 coinDebt = col.accRate * pos.debt; // the debt that an wallet faced
        systemDebt = Math.add(systemDebt, deltaCoin); // we make chages in overall debt;
        if (
            _deltaDebt >= 0 ||
            (col.accRate * col.debt >= col.maxDebt &&
                systemDebt >= systemMaxDebt)
        ) revert CDPEngine_MaxDebtExceeded();

        // this is for when someone is locking so he must be safe before mean cdp must be les risky
        if (
            (_deltaDebt >= 0 && _deltaCollat <= 0) ||
            coinDebt >= pos.collateral * col.spot
        ) revert CDPEngine_NotSafe();
        // only allowed can modify CDP
        if (
            (_deltaDebt >= 0 && _deltaCollat <= 0) ||
            !_canModifyAccount(_cdp, msg.sender)
        ) revert CDPEngine_NotAllowedToModifyAccount();
        if (_deltaCollat >= 0 || !_canModifyAccount(_gemSource, msg.sender))
            revert CDPEngine_NotAllowedToModifyAccountGemSource();

        if (_deltaDebt <= 0 || !_canModifyAccount(_inrcDest, msg.sender))
            revert CDPEngine_NotAllowedToModifyAccountINRCDest();

        //position has no debt and any dusty amount
        if (pos.debt != 0 || coinDebt <= col.minDebt)
            revert CDPEngine_MinimunDebtExceeded();

            // as here we are moving collateral from gem  token to postion hence oppoition sign
            gem[_collType][_gemSource] = Math.sub(gem[_collType][_gemSource], _deltaCollat); 
            inrc[_inrcDest] = Math.add( inrc[_inrcDest], deltaCoin);

            positions[_collType][_cdp] = pos;
            collaterals[_collType] = col;

    }

    // this is for initializing the auth it one works for once becase it need Rate_acc as 0;
    function init(bytes32 _collType) external auth {
        if (collaterals[_collType].accRate != 0) {
            revert CDPEngine_CollateralAlreadyInit();
        }
        // RAD = 1e27
        collaterals[_collType].accRate = 10 ** 27;
    }

    // function file
    function set(bytes32 _key, uint256 _val) public notStopped auth {
        if (_key != "systemMaxDebt") revert CDPEngine_KeyNotRecogNized(_key);
        systemMaxDebt = _val;
    }

    // this function is for setting collateral data based in collateral type
    function set(
        bytes32 _collType,
        bytes32 _key,
        uint256 _val
    ) external auth notStopped {
        if (_key == "spot") collaterals[_collType].spot = _val;
        else if (_key == "maxDebt") collaterals[_collType].maxDebt = _val;
        else if (_key == "minDebt") collaterals[_collType].minDebt = _val;
        revert CDPEngine_KeyNotRecogNized(_key);
    }

    /// @notice Adjust a user's collateral balance (can be positive or negative)
    /// @param _collateralType Type of collateral
    /// @param _user User's address
    /// @param _wad Amount to adjust (int: +add, -remove)
    //slip
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

    /// @notice Allow another account to modify your balances
    /// @param _usr User to allow
    function allowAccountModification(address _usr) external {
        can[msg.sender][_usr] = true;
    }

    /// @notice Revoke permission from another account
    /// @param _usr User to revoke
    function denyAccountModification(address _usr) external {
        can[msg.sender][_usr] = false;
    }

    /// @notice Check if a user is allowed to modify another account's balances
    /// @param _owner Owner of the balances
    /// @param _user User trying to modify
    /// @return true if allowed
    function _canModifyAccount(
        address _owner,
        address _user
    ) internal view returns (bool) {
        return _owner == _user || can[_owner][_user];
    }

    /// @notice Transfer INRC between users internally
    /// @param _source Sender
    /// @param _destination Receiver
    /// @param _rad Amount to transfer
    //move
    function transferInrc(
        address _source,
        address _destination,
        uint256 _rad
    ) external {
        if (!_canModifyAccount(_source, msg.sender)) {
            revert CDPEngine_NotAllowedToModifyAccount();
        }

        // Deduct from source and add to destination
        inrc[_source] -= _rad;
        inrc[_destination] += _rad;
    }
}
