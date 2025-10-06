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
  CDP_ENGINE: '0xYourCDPEngineAddress',
  GEM_JOIN: '0xYourGemJoinAddress',
  DAI_JOIN: '0xYourDaiJoinAddress',
  STABLECOIN: '0xYourStablecoinAddress',
  COLLATERAL_TOKEN: '0xYourCollateralTokenAddress', // WETH or test token
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