# Frontend Setup Guide

## 1. Install Dependencies

```bash
cd frontend
npm install
```

## 2. Configure Contracts

After deploying your smart contracts, update the contract addresses in:
`src/config/contracts.ts`

```typescript
export const CONTRACT_ADDRESSES = {
  CDP_ENGINE: '0xYourCDPEngineAddress', // Main CDP Engine (Vat)
  GEM_JOIN: '0xYourGemJoinAddress', // Collateral adapter
  INRC_JOIN: '0xYourINRCJoinAddress', // Stablecoin adapter
  STABLECOIN: '0xYourStablecoinAddress', // INRC token
  COLLATERAL_TOKEN: '0xYourCollateralTokenAddress', // WETH or test token
  POT: '0xYourPotAddress', // Savings contract
  LIQUIDATION_ENGINE: '0xYourLiquidationEngineAddress', // Liquidation engine
  DS_ENGINE: '0xYourDSEngineAddress', // Debt and surplus engine
  JUG: '0xYourJugAddress', // Stability fee engine
  SPOTTER: '0xYourSpotterAddress', // Price feed and liquidation ratios
};
```

## 3. Configure WalletConnect (Optional)

Get a project ID from https://cloud.walletconnect.com and update:
`src/config/wagmi.ts`

```typescript
projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
```

## 4. Start Development Server

```bash
npm run dev
```

## 5. Build for Production

```bash
npm run build
```

## Features Implemented

✅ **Wallet Connection** - MetaMask integration with RainbowKit
✅ **Dashboard** - Real-time balance and position tracking
✅ **Collateral Management** - Deposit/withdraw ETH collateral
✅ **Stablecoin Operations** - Borrow/repay BANK tokens
✅ **Savings (DSR)** - Earn interest on BANK tokens via Pot contract
✅ **Liquidation Monitor** - Track position health and liquidate unsafe positions
✅ **System Management** - Update stability fees and price feeds
✅ **Advanced Analytics** - Collateralization ratios, liquidation prices, and system stats

## New Components Added

- **SavingsManager** - Interface for depositing/withdrawing from the Pot contract
- **LiquidationMonitor** - Monitor position health and perform liquidations
- **SystemManager** - Update stability fees (Jug) and price feeds (Spotter)
- **Updated ABIs** - Support for all contracts: Pot, LiquidationEngine, GemJoin, INRCJoin, Jug, Spotter

## New Contract ABIs

- **GemJoin.json** - Collateral deposit/withdrawal adapter
- **INRCJoin.json** - INRC stablecoin mint/burn adapter
- **Jug.json** - Stability fee management
- **Spotter.json** - Price feed and liquidation ratio management
- **Pot.json** - Savings rate functionality
- **LiquidationEngine.json** - Liquidation system
✅ **Health Monitoring** - Collateralization ratio tracking
✅ **Responsive Design** - Mobile-friendly interface

## Usage Flow

1. **Connect Wallet** - Click connect button in top right
2. **Deposit Collateral** - Lock ETH to secure loans
3. **Borrow Stablecoins** - Mint BANK tokens (max 50% of collateral)
4. **Monitor Health** - Keep ratio above 150%
5. **Repay & Withdraw** - Close position to unlock collateral

## Contract Integration

The frontend integrates with your banking contracts:
- **CDPEngine** - Tracks collateral and debt balances
- **GemJoin** - Handles collateral deposits/withdrawals
- **DaiJoin** - Manages stablecoin minting/burning
- **ERC20 Tokens** - Collateral and stablecoin tokens

## Next Steps

1. Deploy contracts and update addresses
2. Test on localhost/testnet
3. Add price oracle integration
4. Implement liquidation warnings
5. Add transaction history
6. Deploy to production