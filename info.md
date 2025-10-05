
1. **VAT Contract**: This is like the core vault and collateral accounting contract. It keeps track of all collateral, debt, and the system's overall balance.

2. **GemJoin Contract**: This is used for joining collateral into the system. Basically, it converts collateral tokens into the system's internal accounting format.

3. **DaiJoin Contract**: This handles the opposite—it lets you withdraw Dai from the system, essentially converting the internal accounting back into actual Dai tokens.

4. **CDP Manager Contract**: This is the contract that manages the Collateralized Debt Positions (CDPs), allowing users to create and manage their positions.

5. **PIP Contract**: It’s used to feed price data into the system. MakerDAO relies on oracles to get accurate price data, and PIPs are basically these price feeds.

6. **Spotter Contract**: It’s responsible for determining the global collateralization ratio by pulling data from the PIP contracts.

7. **Wow Contract**: This one is involved in liquidations. It defines the conditions under which collateral is liquidated if it’s under-collateralized.

8. **Flopper Contract**: This is another liquidation mechanism but it typically deals with different types of collateral or different liquidation conditions.

9. **Surprise Auction**: This auction happens when the collateral is liquidated, and it’s a way to quickly sell off collateral to cover the debt.

10. **Debt Auction**: This is used when there’s a shortfall in the system. It auctions off debt to raise funds and stabilize the system.

11. **Put Contract**: This contract allows users to put (sell) collateral into the system and get Dai in return, essentially converting collateral into debt.

12. **Juk Contract**: This is a bit more niche, typically used for managing more complex operations or specific collateral types.

