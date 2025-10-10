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
        functionName: 'gem',
        args: [COLLATERAL_TYPE, address],
      },
      // User's INRC balance in CDP Engine
      {
        address: CONTRACT_ADDRESSES.CDP_ENGINE as `0x${string}`,
        abi: CDPEngineABI,
        functionName: 'inrc',
        args: [address],
      },
      // User's position (collateral and debt)
      {
        address: CONTRACT_ADDRESSES.CDP_ENGINE as `0x${string}`,
        abi: CDPEngineABI,
        functionName: 'positions',
        args: [COLLATERAL_TYPE, address],
      },
      // Collateral info (for rates and limits)
      {
        address: CONTRACT_ADDRESSES.CDP_ENGINE as `0x${string}`,
        abi: CDPEngineABI,
        functionName: 'collaterals',
        args: [COLLATERAL_TYPE],
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
      // Stablecoin allowance for INRCJoin
      {
        address: CONTRACT_ADDRESSES.STABLECOIN as `0x${string}`,
        abi: ERC20ABI,
        functionName: 'allowance',
        args: [address, CONTRACT_ADDRESSES.INRC_JOIN],
      },
    ],
    query: {
      enabled: !!address,
    },
  });

  const [
    gemBalance,
    inrcBalance,
    userPosition,
    collateralInfo,
    collateralBalance,
    stablecoinBalance,
    collateralAllowance,
    stablecoinAllowance,
  ] = data || [];

  // Extract position data
  const positionCollateral = userPosition?.result ? (userPosition.result as [bigint, bigint])[0] : 0n;
  const positionDebt = userPosition?.result ? (userPosition.result as [bigint, bigint])[1] : 0n;

  // Extract collateral info
  const collateralData = collateralInfo?.result as [bigint, bigint, bigint, bigint, bigint] | undefined;
  const accRate = collateralData?.[1] || 1000000000000000000000000000n; // Default RAY

  return {
    // Balances
    gemBalance: gemBalance?.result ? formatEther(gemBalance.result as bigint) : '0',
    inrcBalance: inrcBalance?.result ? formatEther(inrcBalance.result as bigint) : '0',
    collateralInVault: formatEther(positionCollateral),
    daiDebt: formatEther(positionDebt * accRate / 1000000000000000000000000000n), // Convert from normalized debt
    collateralBalance: collateralBalance?.result ? formatEther(collateralBalance.result as bigint) : '0',
    stablecoinBalance: stablecoinBalance?.result ? formatEther(stablecoinBalance.result as bigint) : '0',

    // Allowances
    collateralAllowance: collateralAllowance?.result ? formatEther(collateralAllowance.result as bigint) : '0',
    stablecoinAllowance: stablecoinAllowance?.result ? formatEther(stablecoinAllowance.result as bigint) : '0',

    // Raw position data for calculations
    positionCollateral,
    positionDebt,
    accRate,

    // Computed values
    collateralizationRatio: calculateCollateralizationRatio(positionCollateral, positionDebt),

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