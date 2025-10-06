import { useAccount, useReadContracts } from 'wagmi';
import { CONTRACT_ADDRESSES, COLLATERAL_TYPE } from '../config/contracts';
import CDPEngineABI from '../abis/CDPEngine.json';
import ERC20ABI from '../abis/ERC20.json';
import { formatEther } from 'viem';

export function useBankingData() {
  const { address } = useAccount();

  // Read multiple contract values at once
  const { data, isLoading, refetch } = useReadContracts({
    contracts: [
      // User's collateral balance in CDP Engine
      {
        address: CONTRACT_ADDRESSES.CDP_ENGINE as `0x${string}`,
        abi: CDPEngineABI,
        functionName: 'getCollateralBalance',
        args: [COLLATERAL_TYPE, address],
      },
      // User's DAI balance in CDP Engine
      {
        address: CONTRACT_ADDRESSES.CDP_ENGINE as `0x${string}`,
        abi: CDPEngineABI,
        functionName: 'getDaiBalance',
        args: [address],
      },
      // User's collateral token balance (wallet)
      {
        address: CONTRACT_ADDRESSES.COLLATERAL_TOKEN as `0x${string}`,
        abi: ERC20ABI,
        functionName: 'balanceOf',
        args: [address],
      },
      // User's stablecoin balance (wallet)
      {
        address: CONTRACT_ADDRESSES.STABLECOIN as `0x${string}`,
        abi: ERC20ABI,
        functionName: 'balanceOf',
        args: [address],
      },
      // Collateral token allowance for GemJoin
      {
        address: CONTRACT_ADDRESSES.COLLATERAL_TOKEN as `0x${string}`,
        abi: ERC20ABI,
        functionName: 'allowance',
        args: [address, CONTRACT_ADDRESSES.GEM_JOIN],
      },
      // Stablecoin allowance for DaiJoin
      {
        address: CONTRACT_ADDRESSES.STABLECOIN as `0x${string}`,
        abi: ERC20ABI,
        functionName: 'allowance',
        args: [address, CONTRACT_ADDRESSES.DAI_JOIN],
      },
    ],
    query: {
      enabled: !!address,
    },
  });

  const [
    collateralInVault,
    daiDebt,
    collateralBalance,
    stablecoinBalance,
    collateralAllowance,
    stablecoinAllowance,
  ] = data || [];

  return {
    // Balances
    collateralInVault: collateralInVault?.result ? formatEther(collateralInVault.result as bigint) : '0',
    daiDebt: daiDebt?.result ? formatEther(daiDebt.result as bigint) : '0',
    collateralBalance: collateralBalance?.result ? formatEther(collateralBalance.result as bigint) : '0',
    stablecoinBalance: stablecoinBalance?.result ? formatEther(stablecoinBalance.result as bigint) : '0',

    // Allowances
    collateralAllowance: collateralAllowance?.result ? formatEther(collateralAllowance.result as bigint) : '0',
    stablecoinAllowance: stablecoinAllowance?.result ? formatEther(stablecoinAllowance.result as bigint) : '0',

    // Computed values
    collateralizationRatio: calculateCollateralizationRatio(
      collateralInVault?.result as bigint,
      daiDebt?.result as bigint
    ),

    // Utils
    isLoading,
    refetch,
  };
}

function calculateCollateralizationRatio(collateral: bigint, debt: bigint): string {
  if (!collateral || !debt || debt === 0n) return '∞';

  // Assuming 1:1 price for simplicity (in production, use price oracle)
  const ratio = (collateral * 100n) / debt;
  return ratio.toString() + '%';
}