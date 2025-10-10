import React, { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther } from 'viem';
import { CONTRACT_ADDRESSES, COLLATERAL_TYPE } from '../config/contracts';
import JugABI from '../abis/Jug.json';
import SpotterABI from '../abis/Spotter.json';
import CDPEngineABI from '../abis/CDPEngine.json';

export const SystemManager: React.FC = () => {
    const { address } = useAccount();
    const [isUpdatingFees, setIsUpdatingFees] = useState(false);
    const [isUpdatingPrices, setIsUpdatingPrices] = useState(false);

    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

    // Read stability fee data
    const { data: collateralFeeData } = useReadContract({
        address: CONTRACT_ADDRESSES.JUG as `0x${string}`,
        abi: JugABI,
        functionName: 'collaterals',
        args: [COLLATERAL_TYPE],
    });

    const { data: baseFee } = useReadContract({
        address: CONTRACT_ADDRESSES.JUG as `0x${string}`,
        abi: JugABI,
        functionName: 'baseFee',
        args: [],
    });

    // Read price feed data
    const { data: spotterCollateralData } = useReadContract({
        address: CONTRACT_ADDRESSES.SPOTTER as `0x${string}`,
        abi: SpotterABI,
        functionName: 'collaterals',
        args: [COLLATERAL_TYPE],
    });

    const { data: par } = useReadContract({
        address: CONTRACT_ADDRESSES.SPOTTER as `0x${string}`,
        abi: SpotterABI,
        functionName: 'par',
        args: [],
    });

    // Read current collateral info from CDP Engine
    const { data: cdpCollateralInfo } = useReadContract({
        address: CONTRACT_ADDRESSES.CDP_ENGINE as `0x${string}`,
        abi: CDPEngineABI,
        functionName: 'collaterals',
        args: [COLLATERAL_TYPE],
    });

    const handleDrip = async () => {
        if (!address) return;

        setIsUpdatingFees(true);
        try {
            writeContract({
                address: CONTRACT_ADDRESSES.JUG as `0x${string}`,
                abi: JugABI,
                functionName: 'drip',
                args: [COLLATERAL_TYPE],
            });
        } catch (error) {
            console.error('Drip failed:', error);
        } finally {
            setIsUpdatingFees(false);
        }
    };

    const handlePoke = async () => {
        if (!address) return;

        setIsUpdatingPrices(true);
        try {
            writeContract({
                address: CONTRACT_ADDRESSES.SPOTTER as `0x${string}`,
                abi: SpotterABI,
                functionName: 'poke',
                args: [COLLATERAL_TYPE],
            });
        } catch (error) {
            console.error('Poke failed:', error);
        } finally {
            setIsUpdatingPrices(false);
        }
    };

    const calculateAPR = () => {
        if (!collateralFeeData || !baseFee) return '0';

        const [fee] = collateralFeeData as [bigint, bigint];
        const totalFee = Number(baseFee) + Number(fee);

        // Convert from RAY (1e27) to percentage APR
        const secondsPerYear = 365 * 24 * 3600;
        const apr = ((totalFee / 1e27) ** secondsPerYear - 1) * 100;
        return apr.toFixed(2);
    };

    const getLiquidationRatio = () => {
        if (!spotterCollateralData) return '0';

        const [, liquidationRatio] = spotterCollateralData as [string, bigint];
        return (Number(liquidationRatio) / 1e27 * 100).toFixed(1);
    };

    const getCurrentSpotPrice = () => {
        if (!cdpCollateralInfo) return '0';

        const [, , spot] = cdpCollateralInfo as [bigint, bigint, bigint, bigint, bigint];
        return formatEther(spot);
    };

    const getLastFeeUpdate = () => {
        if (!collateralFeeData) return 'Never';

        const [, updatedAt] = collateralFeeData as [bigint, bigint];
        const lastUpdate = new Date(Number(updatedAt) * 1000);
        return lastUpdate.toLocaleString();
    };

    return (
        <div className="bg-surface-200/80 backdrop-blur-xl rounded-4xl border border-surface-400/50 p-8 shadow-material-lg animate-fade-in">
            <div className="flex items-center mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-warning-500 to-warning-600 rounded-3xl flex items-center justify-center mr-6 shadow-material-md">
                    <span className="text-white text-2xl">⚙️</span>
                </div>
                <h2 className="text-2xl font-bold text-surface-900">System Management</h2>
            </div>

            {/* Stability Fees Section */}
            <div className="mb-12">
                <h3 className="text-xl font-bold mb-6 text-surface-900">Stability Fees</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-surface-300 to-surface-400 p-6 rounded-3xl border-2 border-primary-400/50">
                        <h4 className="text-sm font-bold text-primary-600 mb-2 uppercase tracking-wide">Current APR</h4>
                        <p className="text-3xl font-bold text-surface-900">{calculateAPR()}%</p>
                    </div>

                    <div className="bg-gradient-to-br from-surface-300 to-surface-400 p-6 rounded-3xl border-2 border-success-400/50">
                        <h4 className="text-sm font-bold text-success-600 mb-2 uppercase tracking-wide">Base Fee</h4>
                        <p className="text-2xl font-bold text-surface-900">
                            {baseFee ? (Number(baseFee) / 1e27).toFixed(9) : '0'} RAY
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-surface-300 to-surface-400 p-6 rounded-3xl border-2 border-warning-400/50">
                        <h4 className="text-sm font-bold text-warning-600 mb-2 uppercase tracking-wide">Last Update</h4>
                        <p className="text-lg font-bold text-surface-900">{getLastFeeUpdate()}</p>
                    </div>
                </div>

                <button
                    onClick={handleDrip}
                    disabled={isUpdatingFees || isPending || isConfirming}
                    className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-3xl font-bold text-lg hover:from-primary-600 hover:to-primary-700 disabled:from-surface-400 disabled:to-surface-500 disabled:cursor-not-allowed transition-all duration-200 shadow-material-md hover:shadow-material-lg transform hover:scale-105 disabled:transform-none"
                >
                    {isUpdatingFees || isPending || isConfirming ? (
                        <div className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                            Updating...
                        </div>
                    ) : (
                        'Update Stability Fees (Drip)'
                    )}
                </button>
            </div>

            {/* Price Feed Section */}
            <div className="mb-12 border-t-2 border-surface-200 pt-8">
                <h3 className="text-xl font-bold mb-6 text-surface-900">Price Feeds & Liquidation</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-surface-300 to-surface-400 p-6 rounded-3xl border-2 border-warning-400/50">
                        <h4 className="text-sm font-bold text-warning-600 mb-2 uppercase tracking-wide">Current Spot Price</h4>
                        <p className="text-3xl font-bold text-surface-900">${getCurrentSpotPrice()}</p>
                    </div>

                    <div className="bg-gradient-to-br from-surface-300 to-surface-400 p-6 rounded-3xl border-2 border-error-400/50">
                        <h4 className="text-sm font-bold text-error-600 mb-2 uppercase tracking-wide">Liquidation Ratio</h4>
                        <p className="text-3xl font-bold text-surface-900">{getLiquidationRatio()}%</p>
                    </div>

                    <div className="bg-gradient-to-br from-surface-300 to-surface-400 p-6 rounded-3xl border-2 border-surface-500/50">
                        <h4 className="text-sm font-bold text-surface-700 mb-2 uppercase tracking-wide">Par Value</h4>
                        <p className="text-2xl font-bold text-surface-900">
                            {par ? (Number(par) / 1e27).toFixed(6) : '1.000000'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handlePoke}
                    disabled={isUpdatingPrices || isPending || isConfirming}
                    className="px-8 py-4 bg-gradient-to-r from-warning-500 to-warning-600 text-white rounded-3xl font-bold text-lg hover:from-warning-600 hover:to-warning-700 disabled:from-surface-400 disabled:to-surface-500 disabled:cursor-not-allowed transition-all duration-200 shadow-material-md hover:shadow-material-lg transform hover:scale-105 disabled:transform-none"
                >
                    {isUpdatingPrices || isPending || isConfirming ? (
                        <div className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                            Updating...
                        </div>
                    ) : (
                        'Update Price Feed (Poke)'
                    )}
                </button>
            </div>

            {/* System Information */}
            <div className="border-t-2 border-surface-200 pt-8">
                <h3 className="text-xl font-bold mb-6 text-surface-900">System Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-surface-300/50 p-6 rounded-3xl border-2 border-surface-400/50">
                        <h4 className="font-bold text-surface-900 mb-4">Stability Fee Components</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-surface-700 font-medium">Base Fee (Global):</span>
                                <span className="font-mono text-surface-900 font-bold">{baseFee ? (Number(baseFee) / 1e27).toFixed(9) : '0'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-surface-700 font-medium">Collateral Fee:</span>
                                <span className="font-mono text-surface-900 font-bold">
                                    {collateralFeeData ? (Number((collateralFeeData as [bigint, bigint])[0]) / 1e27).toFixed(9) : '0'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface-300/50 p-6 rounded-3xl border-2 border-surface-400/50">
                        <h4 className="font-bold text-surface-900 mb-4">Price Feed Info</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-surface-700 font-medium">Price Feed Address:</span>
                                <span className="font-mono text-surface-900 font-bold text-sm">
                                    {spotterCollateralData ?
                                        `${(spotterCollateralData as [string, bigint])[0].slice(0, 6)}...${(spotterCollateralData as [string, bigint])[0].slice(-4)}` :
                                        'Not set'
                                    }
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-surface-700 font-medium">System Par:</span>
                                <span className="font-mono text-surface-900 font-bold">{par ? (Number(par) / 1e27).toFixed(6) : '1.000000'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-surface-300 border-2 border-primary-400/50 rounded-3xl">
                    <p className="text-primary-600 font-medium flex items-start">
                        <span className="text-xl mr-3 mt-0.5">💡</span>
                        <span>
                            <strong>Note:</strong> These functions update system-wide parameters.
                            "Drip" updates interest rates and "Poke" updates collateral prices from external oracles.
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};