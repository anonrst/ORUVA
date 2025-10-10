import React, { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther } from 'viem';
import { CONTRACT_ADDRESSES, COLLATERAL_TYPE } from '../config/contracts';
import LiquidationEngineABI from '../abis/LiquidationEngine.json';
import CDPEngineABI from '../abis/CDPEngine.json';

export const LiquidationMonitor: React.FC = () => {
    const { address } = useAccount();
    const [targetAddress, setTargetAddress] = useState('');

    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

    // Read user's position
    const { data: userPosition } = useReadContract({
        address: CONTRACT_ADDRESSES.CDP_ENGINE as `0x${string}`,
        abi: CDPEngineABI,
        functionName: 'positions',
        args: [COLLATERAL_TYPE, address],
    });

    // Read collateral info
    const { data: collateralInfo } = useReadContract({
        address: CONTRACT_ADDRESSES.CDP_ENGINE as `0x${string}`,
        abi: CDPEngineABI,
        functionName: 'collaterals',
        args: [COLLATERAL_TYPE],
    });

    // Read liquidation penalty
    const { data: liquidationPenalty } = useReadContract({
        address: CONTRACT_ADDRESSES.LIQUIDATION_ENGINE as `0x${string}`,
        abi: LiquidationEngineABI,
        functionName: 'getPenalty',
        args: [COLLATERAL_TYPE],
    });

    // Read liquidation engine stats
    const { data: totalCoin } = useReadContract({
        address: CONTRACT_ADDRESSES.LIQUIDATION_ENGINE as `0x${string}`,
        abi: LiquidationEngineABI,
        functionName: 'totalCoin',
        args: [],
    });

    const { data: maxCoin } = useReadContract({
        address: CONTRACT_ADDRESSES.LIQUIDATION_ENGINE as `0x${string}`,
        abi: LiquidationEngineABI,
        functionName: 'maxCoin',
        args: [],
    });

    const calculateCollateralizationRatio = () => {
        if (!userPosition || !collateralInfo || !Array.isArray(userPosition) || !Array.isArray(collateralInfo)) return 0;

        const [collateral, debt] = userPosition as [bigint, bigint];
        const [, accRate, spot] = collateralInfo as [bigint, bigint, bigint, bigint, bigint];

        if (!collateral || !debt || !accRate || !spot || debt === 0n) return Infinity;

        const collateralValue = collateral * spot;
        const debtValue = debt * accRate;

        return Number(collateralValue * 100n / debtValue);
    };

    const isPositionUnsafe = () => {
        if (!userPosition || !collateralInfo || !Array.isArray(userPosition) || !Array.isArray(collateralInfo)) return false;

        const [collateral, debt] = userPosition as [bigint, bigint];
        const [, accRate, spot] = collateralInfo as [bigint, bigint, bigint, bigint, bigint];

        if (!collateral || !debt || !accRate || !spot || debt === 0n) return false;

        return collateral * spot <= debt * accRate;
    };

    const getLiquidationPrice = () => {
        if (!userPosition || !collateralInfo || !Array.isArray(userPosition) || !Array.isArray(collateralInfo)) return '0';

        const [collateral, debt] = userPosition as [bigint, bigint];
        const [, accRate] = collateralInfo as [bigint, bigint, bigint, bigint, bigint];

        if (!collateral || !debt || !accRate || collateral === 0n) return '0';

        const liquidationPrice = (debt * accRate) / collateral;
        return formatEther(liquidationPrice);
    };

    const handleLiquidate = async () => {
        if (!targetAddress || !address) return;

        try {
            writeContract({
                address: CONTRACT_ADDRESSES.LIQUIDATION_ENGINE as `0x${string}`,
                abi: LiquidationEngineABI,
                functionName: 'liquidate',
                args: [COLLATERAL_TYPE, targetAddress as `0x${string}`, address],
            });
            setTargetAddress('');
        } catch (error) {
            console.error('Liquidation failed:', error);
        }
    };

    const collateralizationRatio = calculateCollateralizationRatio();
    const positionUnsafe = isPositionUnsafe();

    return (
        <div className="bg-surface-200/80 backdrop-blur-xl rounded-4xl border border-surface-400/50 p-8 shadow-material-lg animate-fade-in">
            <div className="flex items-center mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-error-500 to-error-600 rounded-3xl flex items-center justify-center mr-6 shadow-material-md">
                    <span className="text-white text-2xl">⚡</span>
                </div>
                <h2 className="text-2xl font-bold text-surface-900">Liquidation Monitor</h2>
            </div>

            {/* Your Position Status */}
            <div className={`mb-8 p-6 rounded-4xl border-2 ${
                positionUnsafe 
                    ? 'bg-gradient-to-br from-surface-300 to-surface-400 border-error-400/50' 
                    : collateralizationRatio < 150 
                        ? 'bg-gradient-to-br from-surface-300 to-surface-400 border-warning-400/50' 
                        : 'bg-gradient-to-br from-surface-300 to-surface-400 border-success-400/50'
            }`}>
                <h3 className="text-xl font-bold mb-6 text-surface-900">Your Position Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <span className="text-sm font-bold text-surface-700 uppercase tracking-wide">Collateralization Ratio:</span>
                        <p className={`text-2xl font-bold mt-2 ${positionUnsafe ? 'text-error-600' :
                                collateralizationRatio < 150 ? 'text-warning-600' : 'text-success-600'
                            }`}>
                            {collateralizationRatio === Infinity ? '∞' : `${collateralizationRatio.toFixed(2)}%`}
                        </p>
                    </div>
                    <div>
                        <span className="text-sm font-bold text-surface-700 uppercase tracking-wide">Liquidation Price:</span>
                        <p className="text-2xl font-bold text-surface-900 mt-2">${getLiquidationPrice()}</p>
                    </div>
                    <div>
                        <span className="text-sm font-bold text-surface-700 uppercase tracking-wide">Status:</span>
                        <p className={`text-2xl font-bold mt-2 ${positionUnsafe ? 'text-error-600' :
                                collateralizationRatio < 150 ? 'text-warning-600' : 'text-success-600'
                            }`}>
                            {positionUnsafe ? 'UNSAFE' : collateralizationRatio < 150 ? 'WARNING' : 'SAFE'}
                        </p>
                    </div>
                </div>

                {positionUnsafe && (
                    <div className="mt-6 p-4 bg-error-100 border-2 border-error-300 rounded-3xl">
                        <p className="text-error-800 font-bold flex items-center">
                            <span className="text-xl mr-2">⚠️</span>
                            Your position is unsafe and may be liquidated!
                        </p>
                    </div>
                )}

                {!positionUnsafe && collateralizationRatio < 150 && (
                    <div className="mt-6 p-4 bg-warning-100 border-2 border-warning-300 rounded-3xl">
                        <p className="text-warning-800 font-bold flex items-center">
                            <span className="text-xl mr-2">⚠️</span>
                            Your position is approaching the liquidation threshold. Consider adding collateral.
                        </p>
                    </div>
                )}
            </div>

            {/* Liquidation Parameters */}
            <div className="mb-8">
                <h3 className="text-xl font-bold mb-6 text-surface-900">Liquidation Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-surface-300/50 p-6 rounded-3xl border-2 border-surface-400/50">
                        <span className="text-sm font-bold text-surface-700 uppercase tracking-wide">Liquidation Penalty:</span>
                        <p className="text-2xl font-bold text-surface-900 mt-2">
                            {liquidationPenalty && typeof liquidationPenalty === 'bigint' ? `${(Number(liquidationPenalty) / 1e18 * 100).toFixed(1)}%` : 'Loading...'}
                        </p>
                    </div>
                    <div className="bg-surface-300/50 p-6 rounded-3xl border-2 border-surface-400/50">
                        <span className="text-sm font-bold text-surface-700 uppercase tracking-wide">System Liquidation Capacity:</span>
                        <p className="text-2xl font-bold text-surface-900 mt-2">
                            {totalCoin && maxCoin && typeof totalCoin === 'bigint' && typeof maxCoin === 'bigint' ?
                                `${formatEther(totalCoin)} / ${formatEther(maxCoin)} BANK` :
                                'Loading...'
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Liquidation Action */}
            <div className="border-t-2 border-surface-200 pt-8">
                <h3 className="text-xl font-bold mb-6 text-surface-900">Liquidate Position</h3>
                <p className="text-surface-600 mb-6 font-medium">
                    Enter the address of an unsafe position to liquidate it and earn liquidation rewards.
                </p>

                <div className="flex gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="0x... (Address to liquidate)"
                        value={targetAddress}
                        onChange={(e) => setTargetAddress(e.target.value)}
                        className="flex-1 px-6 py-4 border-2 border-surface-400/50 bg-surface-300/50 rounded-3xl focus:outline-none focus:ring-2 focus:ring-error-500 focus:border-error-500 text-lg font-semibold transition-all duration-200 text-surface-900"
                    />
                    <button
                        onClick={handleLiquidate}
                        disabled={!targetAddress || isPending || isConfirming}
                        className="px-8 py-4 bg-gradient-to-r from-error-500 to-error-600 text-white rounded-3xl font-bold text-lg hover:from-error-600 hover:to-error-700 disabled:from-surface-400 disabled:to-surface-500 disabled:cursor-not-allowed transition-all duration-200 shadow-material-md hover:shadow-material-lg transform hover:scale-105 disabled:transform-none"
                    >
                        {isPending || isConfirming ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                Processing...
                            </div>
                        ) : (
                            'Liquidate'
                        )}
                    </button>
                </div>

                <div className="p-6 bg-surface-300 border-2 border-primary-400/50 rounded-3xl">
                    <p className="text-primary-600 font-medium flex items-start">
                        <span className="text-xl mr-3 mt-0.5">💡</span>
                        <span>
                            <strong>Note:</strong> Only positions with collateralization ratio below 100% can be liquidated.
                            You'll receive a liquidation reward if successful.
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};