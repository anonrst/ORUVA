import React, { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { CONTRACT_ADDRESSES } from '../config/contracts';
import PotABI from '../abis/Pot.json';
import CDPEngineABI from '../abis/CDPEngine.json';

export const SavingsManager: React.FC = () => {
    const { address } = useAccount();
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');

    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

    // Read user's savings balance
    const { data: userSavings } = useReadContract({
        address: CONTRACT_ADDRESSES.POT as `0x${string}`,
        abi: PotABI,
        functionName: 'savings',
        args: [address],
    });

    // Read user's INRC balance
    const { data: inrcBalance } = useReadContract({
        address: CONTRACT_ADDRESSES.CDP_ENGINE as `0x${string}`,
        abi: CDPEngineABI,
        functionName: 'inrc',
        args: [address],
    });

    // Read savings rate
    const { data: savingRate } = useReadContract({
        address: CONTRACT_ADDRESSES.POT as `0x${string}`,
        abi: PotABI,
        functionName: 'savingRate',
        args: [],
    });

    // Read rate accumulator
    const { data: rateAcc } = useReadContract({
        address: CONTRACT_ADDRESSES.POT as `0x${string}`,
        abi: PotABI,
        functionName: 'rateAcc',
        args: [],
    });

    // Read total pie (total savings)
    const { data: totalPie } = useReadContract({
        address: CONTRACT_ADDRESSES.POT as `0x${string}`,
        abi: PotABI,
        functionName: 'totalPie',
        args: [],
    });

    const handleDeposit = async () => {
        if (!depositAmount || !address) return;

        try {
            const amount = parseEther(depositAmount);
            writeContract({
                address: CONTRACT_ADDRESSES.POT as `0x${string}`,
                abi: PotABI,
                functionName: 'join',
                args: [amount],
            });
            setDepositAmount('');
        } catch (error) {
            console.error('Deposit failed:', error);
        }
    };

    const handleWithdraw = async () => {
        if (!withdrawAmount || !address) return;

        try {
            const amount = parseEther(withdrawAmount);
            writeContract({
                address: CONTRACT_ADDRESSES.POT as `0x${string}`,
                abi: PotABI,
                functionName: 'exit',
                args: [amount],
            });
            setWithdrawAmount('');
        } catch (error) {
            console.error('Withdrawal failed:', error);
        }
    };

    const calculateAPY = () => {
        if (!savingRate || typeof savingRate !== 'bigint') return '0';
        // Convert from RAY (1e27) to percentage
        const rate = Number(savingRate) / 1e27;
        const apy = ((rate ** (365 * 24 * 3600)) - 1) * 100;
        return apy.toFixed(2);
    };

    const calculateEarnings = () => {
        if (!userSavings || !rateAcc || typeof userSavings !== 'bigint' || typeof rateAcc !== 'bigint') return '0';
        const earnings = (Number(userSavings) * Number(rateAcc)) / 1e27;
        return formatEther(BigInt(Math.floor(earnings)));
    };

    return (
        <div className="bg-surface-200/80 backdrop-blur-xl rounded-4xl border border-surface-400/50 p-8 shadow-material-lg animate-fade-in">
            <div className="flex items-center mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-success-500 to-success-600 rounded-3xl flex items-center justify-center mr-6 shadow-material-md">
                    <span className="text-white text-2xl">💰</span>
                </div>
                <h2 className="text-2xl font-bold text-surface-900">Savings (DSR)</h2>
            </div>

            {/* Savings Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-surface-300 to-surface-400 p-6 rounded-3xl border-2 border-primary-400/50">
                    <h3 className="text-sm font-bold text-primary-600 mb-2 uppercase tracking-wide">Current APY</h3>
                    <p className="text-3xl font-bold text-surface-900">{calculateAPY()}%</p>
                </div>

                <div className="bg-gradient-to-br from-surface-300 to-surface-400 p-6 rounded-3xl border-2 border-success-400/50">
                    <h3 className="text-sm font-bold text-success-600 mb-2 uppercase tracking-wide">Your Savings</h3>
                    <p className="text-3xl font-bold text-surface-900">
                        {userSavings && typeof userSavings === 'bigint' ? formatEther(userSavings) : '0'} BANK
                    </p>
                </div>

                <div className="bg-gradient-to-br from-surface-300 to-surface-400 p-6 rounded-3xl border-2 border-warning-400/50">
                    <h3 className="text-sm font-bold text-warning-600 mb-2 uppercase tracking-wide">Current Earnings</h3>
                    <p className="text-3xl font-bold text-surface-900">
                        {calculateEarnings()} BANK
                    </p>
                </div>
            </div>

            {/* Available Balance */}
            <div className="mb-8 p-6 bg-surface-300/50 rounded-3xl border-2 border-surface-400/50">
                <h3 className="text-sm font-bold text-surface-700 mb-2 uppercase tracking-wide">Available BANK Balance</h3>
                <p className="text-2xl font-bold text-surface-900">
                    {inrcBalance && typeof inrcBalance === 'bigint' ? formatEther(inrcBalance) : '0'} BANK
                </p>
            </div>

            {/* Deposit Section */}
            <div className="mb-8">
                <h3 className="text-xl font-bold mb-6 text-surface-900">Deposit to Savings</h3>
                <div className="flex gap-4">
                    <input
                        type="number"
                        placeholder="Amount to deposit"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="flex-1 px-6 py-4 border-2 border-surface-400/50 bg-surface-300/50 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg font-semibold transition-all duration-200 text-surface-900"
                    />
                    <button
                        onClick={handleDeposit}
                        disabled={!depositAmount || isPending || isConfirming}
                        className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-3xl font-bold text-lg hover:from-primary-600 hover:to-primary-700 disabled:from-surface-400 disabled:to-surface-500 disabled:cursor-not-allowed transition-all duration-200 shadow-material-md hover:shadow-material-lg transform hover:scale-105 disabled:transform-none"
                    >
                        {isPending || isConfirming ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                Processing...
                            </div>
                        ) : (
                            'Deposit'
                        )}
                    </button>
                </div>
            </div>

            {/* Withdraw Section */}
            <div className="mb-8">
                <h3 className="text-xl font-bold mb-6 text-surface-900">Withdraw from Savings</h3>
                <div className="flex gap-4">
                    <input
                        type="number"
                        placeholder="Amount to withdraw"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="flex-1 px-6 py-4 border-2 border-surface-400/50 bg-surface-300/50 rounded-3xl focus:outline-none focus:ring-2 focus:ring-success-500 focus:border-success-500 text-lg font-semibold transition-all duration-200 text-surface-900"
                    />
                    <button
                        onClick={handleWithdraw}
                        disabled={!withdrawAmount || isPending || isConfirming}
                        className="px-8 py-4 bg-gradient-to-r from-success-500 to-success-600 text-white rounded-3xl font-bold text-lg hover:from-success-600 hover:to-success-700 disabled:from-surface-400 disabled:to-surface-500 disabled:cursor-not-allowed transition-all duration-200 shadow-material-md hover:shadow-material-lg transform hover:scale-105 disabled:transform-none"
                    >
                        {isPending || isConfirming ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                Processing...
                            </div>
                        ) : (
                            'Withdraw'
                        )}
                    </button>
                </div>
            </div>

            {/* Protocol Stats */}
            <div className="border-t-2 border-surface-200 pt-8">
                <h3 className="text-xl font-bold mb-6 text-surface-900">Protocol Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-surface-300/50 p-6 rounded-3xl border-2 border-surface-400/50">
                        <span className="text-sm font-bold text-surface-700 uppercase tracking-wide">Total Savings in Protocol:</span>
                        <p className="text-xl font-bold text-surface-900 mt-2">{totalPie && typeof totalPie === 'bigint' ? formatEther(totalPie) : '0'} BANK</p>
                    </div>
                    <div className="bg-surface-300/50 p-6 rounded-3xl border-2 border-surface-400/50">
                        <span className="text-sm font-bold text-surface-700 uppercase tracking-wide">Rate Accumulator:</span>
                        <p className="text-xl font-bold text-surface-900 mt-2">{rateAcc && typeof rateAcc === 'bigint' ? (Number(rateAcc) / 1e27).toFixed(6) : '1.000000'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};