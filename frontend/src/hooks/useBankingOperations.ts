import { useAccount, useWriteContract } from 'wagmi';
import { CONTRACT_ADDRESSES } from '../config/contracts';
import GemJoinABI from '../abis/GemJoin.json';
import INRCJoinABI from '../abis/INRCJoin.json';
import ERC20ABI from '../abis/ERC20.json';
import { parseEther } from 'viem';
import { useState } from 'react';

export function useBankingOperations() {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const { writeContractAsync } = useWriteContract();

  const depositCollateral = async (amount: string) => {
    if (!address) throw new Error('Wallet not connected');

    setIsLoading(true);
    try {
      const amountWei = parseEther(amount);

      // First approve the tokens
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.COLLATERAL_TOKEN as `0x${string}`,
        abi: ERC20ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.GEM_JOIN, amountWei],
      });

      // Then deposit
      const depositHash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.GEM_JOIN as `0x${string}`,
        abi: GemJoinABI,
        functionName: 'join',
        args: [address, amountWei],
      });

      return depositHash;
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawCollateral = async (amount: string) => {
    if (!address) throw new Error('Wallet not connected');

    setIsLoading(true);
    try {
      const amountWei = parseEther(amount);

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.GEM_JOIN as `0x${string}`,
        abi: GemJoinABI,
        functionName: 'exit',
        args: [address, amountWei],
      });

      return hash;
    } finally {
      setIsLoading(false);
    }
  };

  const borrowINRC = async (amount: string) => {
    if (!address) throw new Error('Wallet not connected');

    setIsLoading(true);
    try {
      const amountWei = parseEther(amount);

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.INRC_JOIN as `0x${string}`,
        abi: INRCJoinABI,
        functionName: 'exit',
        args: [address, amountWei],
      });

      return hash;
    } finally {
      setIsLoading(false);
    }
  };

  const repayINRC = async (amount: string) => {
    if (!address) throw new Error('Wallet not connected');

    setIsLoading(true);
    try {
      const amountWei = parseEther(amount);

      // First approve the stablecoin
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.STABLECOIN as `0x${string}`,
        abi: ERC20ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.INRC_JOIN, amountWei],
      });

      // Then repay
      const repayHash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.INRC_JOIN as `0x${string}`,
        abi: INRCJoinABI,
        functionName: 'join',
        args: [address, amountWei],
      });

      return repayHash;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    depositCollateral,
    withdrawCollateral,
    borrowINRC,
    repayINRC,
    isLoading,
  };
}