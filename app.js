// Database of the 5 trading days parsed from the veteran mentor's uploaded images.
const ledgerData = {
    "Mon, Jan 26": {
        dateString: "Monday, January 26, 2026",
        notes: "Macro bias is risk-on in equities but heavily guarded with hedges. Metals shorts are showing strength, while crypto is hedged at critical support levels. Capital preservation is priority #1.",
        categories: {
            "Currencies": [
                { name: "USDX", symbol: "DXY", type: "long", position: "Long 99.30, stop/hedge 98.60", size: "10%", chng: "15 Jan", reasoning: "US Dollar Index holds long bias. Hard stop/hedge placed 0.70 pts below entry to lock in core downside limit." }
            ],
            "Stocks/ETF's": [
                { name: "SPX500", symbol: "SPX", type: "long", position: "Long 6883, stop/hedge TBA", size: "30%", chng: "20 Jan", reasoning: "Core equity index position. Trend remains bullish, stop/hedge level is TBA pending weekly price structure." },
                { name: "NASDAQ", symbol: "NDX", type: "long", position: "Long 25110 (20%), stop/hedge 25110. Long 25390 (10%)", size: "30%", chng: "8 Jan", reasoning: "Double entry structure. 20% size stop is moved to breakeven (25110) protecting against deep reversion. Added 10% on momentum breakout at 25390." },
                { name: "GER30", symbol: "DE30", type: "long", position: "Long 24900, stop/hedge TBA", size: "10%", chng: "22 Jan", reasoning: "Small tactical exposure to European index. Riding standard daily trend channel." },
                { name: "NVDA", symbol: "NVDA", type: "long", position: "Long 180.0, stop/hedge 187.0", size: "45%", chng: "18 Dec", reasoning: "High conviction tech position. Stop/hedge is at 187.0, which is higher than entry (180.0), guaranteeing a profitable exit on trend breakdown (Risk-Free Trade)." },
                { name: "PLTR", symbol: "PLTR", type: "long", position: "Long 174.60, stop/hedge TBA", size: "10%", chng: "12 Jan", reasoning: "Defensive growth trade. Position sized at a conservative 10% while waiting for volatility to compress." },
                { name: "COIN", symbol: "COIN", type: "long", position: "Long 256.30, stop/hedge 192", size: "100%", chng: "26 Jan", reasoning: "High beta crypto equity play. Fully allocated sub-portfolio size (100%) but insulated with a strict stop/hedge at 192 (25% max risk on asset level, equivalent to 25% sub-portfolio drawdown limit)." },
                { name: "MSTR", symbol: "MSTR", type: "long", position: "Long 299.0, Long 170.20, 10%", size: "100%", chng: "9 Dec", reasoning: "Proxy leverage play. Sized at 100% due to dual entry average around 235. The secondary 10% allocation acts as a cash-flow buffer." },
                { name: "CRCL", symbol: "CRCL", type: "long", position: "Long 80.50, stop/hedge TBA", size: "20%", chng: "15 Dec", reasoning: "Medium conviction equity hold, riding standard trend lines." },
                { name: "TSLA", symbol: "TSLA", type: "long", position: "Long 469.40, stop/hedge TBA", size: "30%", chng: "30 Dec", reasoning: "Bullish consolidation breakout trade, stop level under construction based on weekly candle close." },
                { name: "AVGO", symbol: "AVGO", type: "long", position: "Long 357.10, stop/hedge TBA", size: "10%", chng: "13 Jan", reasoning: "Conservative semicap play to balance tech sector exposure." }
            ],
            "Metals": [
                { name: "Gold", symbol: "XAUUSD", type: "short", position: "Short 4482, fully hedged at 4660. Short 5110 (20%), stop/hedge 5110", size: "60%", chng: "26 Jan", reasoning: "Major resistance short. The 4482 short is fully hedged at 4660. Added 20% short at 5110 with stop at entry (5110) to cap risk." },
                { name: "Silver", symbol: "XAGUSD", type: "short", position: "Short 90.40, fully hedged at 93.52, stop break even", size: "7.5%", chng: "19 Jan", reasoning: "Precious metals bear hedge. Fully hedged at 93.52, stop-loss adjusted to entry for a risk-free bearish play." },
                { name: "Copper", symbol: "HG1!", type: "short", position: "Short 5.01, fully hedged at 5.18, stop break even", size: "25%", chng: "14 Jan", reasoning: "Industrial metals short. Strictly hedged at 5.18, stops at break even." }
            ],
            "Crypto": [
                { name: "Bitcoin", symbol: "BTCUSD", type: "long", position: "Long 91200, 33.3% hedged at 87900", size: "30%", chng: "26 Jan", reasoning: "Core crypto holding. Sized at 30%. Defensive 1/3 hedge order activated at 87900 to protect against liquidation sweeps." },
                { name: "ETH", symbol: "ETHUSD", type: "long", position: "Long 3090, 50% hedged at 3170", size: "30%", chng: "20 Jan", reasoning: "Hedged long. Long from 3090, with a 50% hedge active at 3170 (locking in partial profit and neutralising downside risk)." },
                { name: "XRP", symbol: "XRPUSD", type: "long", position: "Long 2.05, stop/hedge TBA", size: "30%", chng: "23 Dec", reasoning: "Momentum play, stop TBA." },
                { name: "SOL", symbol: "SOLUSD", type: "long", position: "Long 132.0, stop/hedge TBA", size: "30%", chng: "23 Dec", reasoning: "High speed layer-1 asset, riding support, stop TBA." }
            ],
            "Energies": [
                { name: "NGAS.F", symbol: "NG1!", type: "long", position: "Long 3.50, stop/hedge TBA", size: "10%", chng: "26 Jan", reasoning: "Commodity dip play. Sized at a minimal 10% due to structural volatility." },
                { name: "WTI", symbol: "CL1!", type: "short", position: "Short 59.70, stop/hedge TBA", size: "40%", chng: "14 Jan", reasoning: "Crude short. Looking for macroeconomic demand destruction, stops TBA." },
                { name: "URA", symbol: "URA", type: "long", position: "Long 46.95, stop/hedge TBA", size: "25%", chng: "20 Nov", reasoning: "Long term structural energy play on Uranium miners." }
            ],
            "Commodities": [
                { name: "Cotton", symbol: "CT1!", type: "long", position: "Long 64.70, stop/hedge TBA", size: "30%", chng: "6 Jan", reasoning: "Soft commodities consolidation trade." },
                { name: "Wheat", symbol: "W1!", type: "long", position: "Long 513.80, stop/hedge TBA", size: "30%", chng: "6 Jan", reasoning: "Inflation hedge allocation." },
                { name: "SoyB", symbol: "S1!", type: "long", position: "Long 1066, stop/hedge TBA", size: "20%", chng: "6 Jan", reasoning: "Agricultural rotation play." }
            ]
        }
    },
    "Tue, Jan 27": {
        dateString: "Tuesday, January 27, 2026",
        notes: "Currencies adjusted. USDX long re-entry at 98.15 with double size (20%). Precious metal shorts are scaling in (added Silver short at 112.00). Energies risk-managed with trailing stops on NGAS and WTI.",
        categories: {
            "Currencies": [
                { name: "USDX", symbol: "DXY", type: "long", position: "Long 98.15, stop/hedge 98.60", size: "20%", chng: "27 Jan", reasoning: "USDX position re-allocated. Entry lowered to 98.15, size doubled to 20% to exploit support bounce. Stop/hedge locks profit above entry." }
            ],
            "Stocks/ETF's": [
                { name: "SPX500", symbol: "SPX", type: "long", position: "Long 6883, stop/hedge TBA", size: "30%", chng: "20 Jan", reasoning: "Bull market continuation hold." },
                { name: "NASDAQ", symbol: "NDX", type: "long", position: "Long 25110 (20%), stop/hedge 25110. Long 25390 (10%)", size: "30%", chng: "8 Jan", reasoning: "Core positions maintained, break-even active on primary entry." },
                { name: "GER30", symbol: "DE30", type: "long", position: "Long 24900, stop/hedge TBA", size: "10%", chng: "22 Jan", reasoning: "European index support check." },
                { name: "NVDA", symbol: "NVDA", type: "long", position: "Long 180.0, stop/hedge 187.0", size: "45%", chng: "18 Dec", reasoning: "Locking in gain of +7 points on large 45% size if trend breaks." },
                { name: "PLTR", symbol: "PLTR", type: "long", position: "Long 174.60, stop/hedge TBA", size: "10%", chng: "12 Jan", reasoning: "Patience play on growth stock." },
                { name: "COIN", symbol: "COIN", type: "long", position: "Long 256.30, stop/hedge 192", size: "100%", chng: "26 Jan", reasoning: "Conviction hold with risk capped strictly at 192." },
                { name: "MSTR", symbol: "MSTR", type: "long", position: "Long 299.0, Long 170.20, 10%", size: "100%", chng: "9 Dec", reasoning: "Consolidated holding on crypto equities proxy." },
                { name: "CRCL", symbol: "CRCL", type: "long", position: "Long 80.50, stop/hedge TBA", size: "20%", chng: "15 Dec", reasoning: "Holding breakout range." },
                { name: "TSLA", symbol: "TSLA", type: "long", position: "Long 469.40, stop/hedge TBA", size: "30%", chng: "30 Dec", reasoning: "Momentum holds above daily moving averages." },
                { name: "AVGO", symbol: "AVGO", type: "long", position: "Long 357.10, stop/hedge TBA", size: "10%", chng: "13 Jan", reasoning: "Defensive semiconductor hold." }
            ],
            "Metals": [
                { name: "Gold", symbol: "XAUUSD", type: "short", position: "Short 4482, fully hedged at 4660. Short 5110 (20%), stop/hedge 5110", size: "60%", chng: "26 Jan", reasoning: "Gold shorts holding tight risk. Break-even stop on the 5110 portion protects against flash upward spikes." },
                { name: "Silver", symbol: "XAGUSD", type: "short", position: "Short 90.40, fully hedged at 93.52, stop break even. Short 112.00 (10%)", size: "17.5%", chng: "27 Jan", reasoning: "Precious metals bear exposure increased. Added short position at 112.00 (10% size) as silver fails key resistance level." },
                { name: "Copper", symbol: "HG1!", type: "short", position: "Short 5.01, fully hedged at 5.18, stop break even", size: "25%", chng: "14 Jan", reasoning: "Industrial demand weakness trade intact." }
            ],
            "Crypto": [
                { name: "Bitcoin", symbol: "BTCUSD", type: "long", position: "Long 91200, 33.3% hedge order at 85900", size: "30%", chng: "26 Jan", reasoning: "Hedge order adjusted down from 87900 to 85900 to give the position breathing room around swing lows." },
                { name: "ETH", symbol: "ETHUSD", type: "long", position: "Long 3090, 50% hedged at 3170", size: "30%", chng: "20 Jan", reasoning: "Locked hedge continues to neutralise downside risk." },
                { name: "XRP", symbol: "XRPUSD", type: "long", position: "Long 2.05, stop/hedge TBA", size: "30%", chng: "23 Dec", reasoning: "Holding XRP momentum position." },
                { name: "SOL", symbol: "SOLUSD", type: "long", position: "Long 132.0, stop/hedge TBA", size: "30%", chng: "23 Dec", reasoning: "Relative strength outperformer, holding." }
            ],
            "Energies": [
                { name: "NGAS.F", symbol: "NG1!", type: "long", position: "Long 3.50, stop/hedge 3.50. Long 3.74, stop/hedge 3.63", size: "20%", chng: "27 Jan", reasoning: "Natural gas exposure doubled to 20%. Added 3.74 entry with a trailing stop at 3.63, while locking the initial 3.50 entry at break-even (3.50)." },
                { name: "WTI", symbol: "CL1!", type: "short", position: "Short 59.70, stop/hedge 62.65", size: "40%", chng: "14 Jan", reasoning: "Added hard stop/hedge on WTI at 62.65, capping maximum risk on this 40% sized trade to 2.95 points." },
                { name: "URA", symbol: "URA", type: "long", position: "Long 46.95, stop/hedge TBA", size: "25%", chng: "20 Nov", reasoning: "Long term Uranium portfolio hold." }
            ],
            "Commodities": [
                { name: "Cotton", symbol: "CT1!", type: "long", position: "Long 64.70, stop/hedge TBA", size: "30%", chng: "6 Jan", reasoning: "Ranging market, holding core size." },
                { name: "Wheat", symbol: "W1!", type: "long", position: "Long 513.80, stop/hedge TBA", size: "30%", chng: "6 Jan", reasoning: "Macro supply concern play." },
                { name: "SoyB", symbol: "S1!", type: "long", position: "Long 1066, stop/hedge TBA", size: "20%", chng: "6 Jan", reasoning: "Consolidation support play." }
            ]
        }
    },
    "Wed, Jan 28": {
        dateString: "Wednesday, January 28, 2026",
        notes: "Major risk reduction: SPX500 and NASDAQ stops moved to absolute breakeven. Bitcoin trailing hedge raised to 89300. Gold short adjusted to 5277 with tighter hedge. WTI stops adjusted.",
        categories: {
            "Currencies": [
                { name: "USDX", symbol: "DXY", type: "long", position: "Long 98.15, stop/hedge 98.60", size: "20%", chng: "27 Jan", reasoning: "Uptrend continues, lock in gains." }
            ],
            "Stocks/ETF's": [
                { name: "SPX500", symbol: "SPX", type: "long", position: "Long 6883, stop/hedge 6883", size: "30%", chng: "28 Jan", reasoning: "Risk-Free Mode. Stop/hedge moved to entry (6883). Capital is now 100% protected on SPX." },
                { name: "NASDAQ", symbol: "NDX", type: "long", position: "Long 25110 (20%), stop/hedge 25110", size: "30%", chng: "28 Jan", reasoning: "NASDAQ trade simplified, secondary entry closed/consolidated. Primary 20% exposure locked at breakeven stop." },
                { name: "GER30", symbol: "DE30", type: "long", position: "Long 24900, stop/hedge TBA", size: "10%", chng: "22 Jan", reasoning: "Holding range, stop TBA." },
                { name: "NVDA", symbol: "NVDA", type: "long", position: "Long 180.0, stop/hedge 187.0", size: "45%", chng: "18 Dec", reasoning: "Protected winner." },
                { name: "PLTR", symbol: "PLTR", type: "long", position: "Long 174.60, stop/hedge TBA", size: "10%", chng: "12 Jan", reasoning: "No changes." },
                { name: "COIN", symbol: "COIN", type: "long", position: "Long 256.30, stop/hedge 192", size: "100%", chng: "26 Jan", reasoning: "Volatile consolidation, hedge remains firm." },
                { name: "MSTR", symbol: "MSTR", type: "long", position: "Long 299.0, Long 170.20, 10%", size: "100%", chng: "9 Dec", reasoning: "Strong daily trend, support holding." },
                { name: "CRCL", symbol: "CRCL", type: "long", position: "Long 80.50, stop/hedge TBA", size: "20%", chng: "15 Dec", reasoning: "Consolidating gains." },
                { name: "TSLA", symbol: "TSLA", type: "long", position: "Long 469.40, stop/hedge TBA", size: "30%", chng: "30 Dec", reasoning: "Consolidation continues." },
                { name: "AVGO", symbol: "AVGO", type: "long", position: "Long 357.10, stop/hedge TBA", size: "10%", chng: "13 Jan", reasoning: "No change." }
            ],
            "Metals": [
                { name: "Gold", symbol: "XAUUSD", type: "short", position: "Short 4482, fully hedged at 4660. Short 5277 (10%), hedged 5330", size: "60%", chng: "28 Jan", reasoning: "Gold short modified. One leg rolled over to a short entry at 5277 (10% size) with a tight hedge at 5330 to adjust for higher price drift." },
                { name: "Silver", symbol: "XAGUSD", type: "short", position: "Short 90.40, fully hedged at 93.52, SBE. Short 112.00 (10%)", size: "17.5%", chng: "27 Jan", reasoning: "Silver shorts maintain dual entries. Lower leg is risk-free (stop break even)." },
                { name: "Copper", symbol: "HG1!", type: "short", position: "Short 5.01, fully hedged at 5.18, stop break even", size: "25%", chng: "14 Jan", reasoning: "Industrial short maintained." }
            ],
            "Crypto": [
                { name: "Bitcoin", symbol: "BTCUSD", type: "long", position: "Long 91200, 33.3% hedged at 89300", size: "30%", chng: "28 Jan", reasoning: "Trailing protection activated. The 1/3 hedge is raised to 89300 (trailing hedge) locking in minimal loss if bitcoin undergoes a deep reversal." },
                { name: "ETH", symbol: "ETHUSD", type: "long", position: "Long 3090, 50% hedged at 3170", size: "30%", chng: "20 Jan", reasoning: "No change, locked range." },
                { name: "XRP", symbol: "XRPUSD", type: "long", position: "Long 2.05, stop/hedge TBA", size: "30%", chng: "23 Dec", reasoning: "Bull flag breakout pending." },
                { name: "SOL", symbol: "SOLUSD", type: "long", position: "Long 132.0, stop/hedge TBA", size: "30%", chng: "23 Dec", reasoning: "Consolidation support." }
            ],
            "Energies": [
                { name: "NGAS.F", symbol: "NG1!", type: "long", position: "Long 3.50, stop/hedge 3.50. Long 3.74, hedged 3.63", size: "20%", chng: "27 Jan", reasoning: "Gas positions protected. Lower leg at breakeven, upper leg hedged at 3.63." },
                { name: "WTI", symbol: "CL1!", type: "short", position: "Short 59.70, stop/hedge TBA", size: "40%", chng: "28 Jan", reasoning: "Crude oil short hedge adjusted back to TBA as range breaks down." },
                { name: "URA", symbol: "URA", type: "long", position: "Long 46.95, stop/hedge TBA", size: "25%", chng: "20 Nov", reasoning: "Holding long term." }
            ],
            "Commodities": [
                { name: "Cotton", symbol: "CT1!", type: "long", position: "Long 64.70, stop/hedge TBA", size: "30%", chng: "6 Jan", reasoning: "Holding." },
                { name: "Wheat", symbol: "W1!", type: "long", position: "Long 513.80, stop/hedge TBA", size: "30%", chng: "6 Jan", reasoning: "Holding." },
                { name: "SoyB", symbol: "S1!", type: "long", position: "Long 1066, stop/hedge TBA", size: "20%", chng: "6 Jan", reasoning: "Holding." }
            ]
        }
    },
    "Thu, Jan 29": {
        dateString: "Thursday, January 29, 2026",
        notes: "Aggressive hedging deployed. Crypto longs (XRP, SOL) fully hedged. Staggered multi-layer hedges added to Bitcoin and Ethereum. Gold short size increased to 75% at 5467.",
        categories: {
            "Currencies": [
                { name: "USDX", symbol: "DXY", type: "long", position: "Long 98.15, stop/hedge 98.60", size: "20%", chng: "27 Jan", reasoning: "Dollar strength solidifies." }
            ],
            "Stocks/ETF's": [
                { name: "SPX500", symbol: "SPX", type: "long", position: "Long 6883, stop/hedge 6883", size: "30%", chng: "28 Jan", reasoning: "Breakeven protection active." },
                { name: "NASDAQ", symbol: "NDX", type: "long", position: "Long 25110 (20%), stop/hedge 25110", size: "30%", chng: "28 Jan", reasoning: "Consolidation near highs." },
                { name: "GER30", symbol: "DE30", type: "long", position: "Long 24900, stop/hedge TBA", size: "10%", chng: "22 Jan", reasoning: "No change." },
                { name: "NVDA", symbol: "NVDA", type: "long", position: "Long 180.0, stop/hedge 187.0", size: "45%", chng: "18 Dec", reasoning: "Risk-free tech holding." },
                { name: "PLTR", symbol: "PLTR", type: "long", position: "Long 174.60, stop/hedge TBA", size: "10%", chng: "12 Jan", reasoning: "Holding support." },
                { name: "COIN", symbol: "COIN", type: "long", position: "Long 256.30, stop/hedge 192", size: "100%", chng: "26 Jan", reasoning: "Unchanged allocation." },
                { name: "MSTR", symbol: "MSTR", type: "long", position: "Long 299.0, Long 170.20, 10%", size: "100%", chng: "9 Dec", reasoning: "High conviction hold." },
                { name: "CRCL", symbol: "CRCL", type: "long", position: "Long 80.50, stop/hedge TBA", size: "20%", chng: "15 Dec", reasoning: "No change." },
                { name: "TSLA", symbol: "TSLA", type: "long", position: "Long 469.40, stop/hedge TBA", size: "30%", chng: "30 Dec", reasoning: "No change." },
                { name: "AVGO", symbol: "AVGO", type: "long", position: "Long 357.10, stop/hedge TBA", size: "10%", chng: "13 Jan", reasoning: "No change." }
            ],
            "Metals": [
                { name: "Gold", symbol: "XAUUSD", type: "short", position: "Short 4482, fully hedged at 4660. Short 5467 (20% size)", size: "75%", chng: "29 Jan", reasoning: "Gold short size boosted to 75%. Entered a short at 5467 on macro liquidity sweep, expecting a swift correction." },
                { name: "Silver", symbol: "XAGUSD", type: "short", position: "Short 90.40, hedged at 93.52, SBE. Short 112.50 (20%), 1/2 hedged at 121.30", size: "17.5%", chng: "29 Jan", reasoning: "Silver short rolled. Upper leg adjusted from 112 to 112.50 (20% size) with a half-hedge active at 121.30 to curb tail risk." },
                { name: "Copper", symbol: "HG1!", type: "short", position: "Short 5.01, fully hedged at 5.18, stop break even", size: "25%", chng: "14 Jan", reasoning: "Breakeven short holding." }
            ],
            "Crypto": [
                { name: "Bitcoin", symbol: "BTCUSD", type: "long", position: "Long 91200, 33.3% hedged at 89300. 33% at 86900. 33% at 85900", size: "30%", chng: "29 Jan", reasoning: "Multi-layer staggered hedge active. Sized at 30% long, protected by trailing hedges at 89300, 86900, and 85900. Limits maximum possible loss to less than 3%." },
                { name: "ETH", symbol: "ETHUSD", type: "long", position: "Long 3090, 50% hedged at 3170. 50% at 2850", size: "30%", chng: "29 Jan", reasoning: "ETH hedged symmetrically. 50% hedge at 3170 and 50% hedge at 2850 to create structural market-neutral bands." },
                { name: "XRP", symbol: "XRPUSD", type: "long", position: "Long 2.05, fully hedged at 1.8250", size: "30%", chng: "29 Jan", reasoning: "XRP fully hedged. Long from 2.05 is now 100% hedged at 1.8250, locking in a minor defined maximum risk." },
                { name: "SOL", symbol: "SOLUSD", type: "long", position: "Long 132.0, fully hedged at 119.80", size: "30%", chng: "29 Jan", reasoning: "SOL fully hedged at 119.80, capping maximum asset downside." }
            ],
            "Energies": [
                { name: "NGAS.F", symbol: "NG1!", type: "long", position: "Long 3.50. Long 3.80, 50% hedged at 3.63", size: "30%", chng: "29 Jan", reasoning: "Gas position increased to 30%. Added entry at 3.80 with a 50% hedge activated at 3.63 to manage volatility." },
                { name: "WTI", symbol: "CL1!", type: "short", position: "Short 61.89, stop/hedge TBA", size: "60%", chng: "29 Jan", reasoning: "Crude short size increased to 60%. Average entry adjusted up to 61.89 as market tests range highs." },
                { name: "URA", symbol: "URA", type: "long", position: "Long 46.95, stop/hedge TBA", size: "25%", chng: "20 Nov", reasoning: "No change." }
            ],
            "Commodities": [
                { name: "Cotton", symbol: "CT1!", type: "long", position: "Long 64.70, stop/hedge TBA", size: "30%", chng: "6 Jan", reasoning: "Holding." },
                { name: "Wheat", symbol: "W1!", type: "long", position: "Long 513.80, stop/hedge TBA", size: "30%", chng: "6 Jan", reasoning: "Holding." },
                { name: "SoyB", symbol: "S1!", type: "long", position: "Long 1066, stop/hedge TBA", size: "20%", chng: "6 Jan", reasoning: "Holding." }
            ]
        }
    },
    "Fri, Jan 30": {
        dateString: "Friday, January 30, 2026",
        notes: "Weekend De-risking. Trimmed SPX500 and NASDAQ sizes. Closed Natural Gas (NGAS.F) completely. Gold short completely closed and flipped to Long (10% size) on massive trend reversal. Added Long Silver hedge spread.",
        categories: {
            "Currencies": [
                { name: "USDX", symbol: "DXY", type: "long", position: "Long 98.15, stop/hedge 98.60", size: "20%", chng: "27 Jan", reasoning: "Dollar index long position maintained." }
            ],
            "Stocks/ETF's": [
                { name: "SPX500", symbol: "SPX", type: "long", position: "Long 6883, stop/hedge 6883", size: "15%", chng: "30 Jan", reasoning: "Take Profit! Slashed position size by half from 30% to 15% to lock in cash and reduce weekend risk exposure." },
                { name: "NASDAQ", symbol: "NDX", type: "long", position: "Long 25110 (20%), stop/hedge 25110", size: "20%", chng: "30 Jan", reasoning: "Take Profit! Slashed size from 30% to 20% before weekend close, locking in substantial tech equity gains." },
                { name: "GER30", symbol: "DE30", type: "long", position: "Long 24900, stop/hedge TBA", size: "10%", chng: "22 Jan", reasoning: "Holding small exposure." },
                { name: "NVDA", symbol: "NVDA", type: "long", position: "Long 180.0, stop/hedge 187.0", size: "45%", chng: "18 Dec", reasoning: "No changes, core long term winner." },
                { name: "PLTR", symbol: "PLTR", type: "long", position: "Long 174.60, stop/hedge TBA", size: "10%", chng: "12 Jan", reasoning: "Holding." },
                { name: "COIN", symbol: "COIN", type: "long", position: "Long 256.30, stop/hedge 192", size: "100%", chng: "26 Jan", reasoning: "100% conviction equity play remains active with hard stop." },
                { name: "MSTR", symbol: "MSTR", type: "long", position: "Long 299.0, Long 170.20, 10%", size: "100%", chng: "9 Dec", reasoning: "Core momentum holdings untouched." },
                { name: "CRCL", symbol: "CRCL", type: "long", position: "Long 80.50, stop/hedge TBA", size: "20%", chng: "15 Dec", reasoning: "Holding." },
                { name: "TSLA", symbol: "TSLA", type: "long", position: "Long 469.40, stop/hedge TBA", size: "30%", chng: "30 Dec", reasoning: "Holding." },
                { name: "AVGO", symbol: "AVGO", type: "long", position: "Long 357.10, stop/hedge TBA", size: "10%", chng: "13 Jan", reasoning: "Holding." }
            ],
            "Metals": [
                { name: "Gold", symbol: "XAUUSD", type: "long", position: "Long 4920, stop/hedge TBA", size: "10%", chng: "30 Jan", reasoning: "Complete Reversal! Closed out the 75% Short position and flipped to a 10% Long position at 4920. Gold broke out of key structural resistance, triggering an immediate regime-shift." },
                { name: "Silver", symbol: "XAGUSD", type: "hedged", position: "Short 90.40 (7.5%), hedged 93.52. Long 105.30, 50% hedged at 84", size: "20%", chng: "30 Jan", reasoning: "Market Neutral Spread. Added a Long position at 105.30 (50% hedged at 84) to offset the remaining 90.40 Short, creating a complex hedge play." },
                { name: "Copper", symbol: "HG1!", type: "hedged", position: "Short 5.01, fully hedged 5.18. Long 5.97 (10%)", size: "25%", chng: "30 Jan", reasoning: "Added Long 5.97 (10% size) to hedge existing Short 5.01 position, transitioning to a neutral volatility profile." }
            ],
            "Crypto": [
                { name: "Bitcoin", symbol: "BTCUSD", type: "long", position: "Long 91200, 33.3% hedged at 89300. 33% at 86900. 33% at 85900", size: "30%", chng: "29 Jan", reasoning: "Symmetric protection remains active for weekend volatility." },
                { name: "ETH", symbol: "ETHUSD", type: "long", position: "Long 3090, 50% hedged at 3170", size: "30%", chng: "30 Jan", reasoning: "Hedge structure simplified back to 50% at 3170 as price action stabilizes near support." },
                { name: "XRP", symbol: "XRPUSD", type: "long", position: "Long 2.05, stop/hedge TBA", size: "30%", chng: "30 Jan", reasoning: "Hedge removed. Price broke resistance, resetting stop/hedge to TBA to allow trend run." },
                { name: "SOL", symbol: "SOLUSD", type: "long", position: "Long 132.0, stop/hedge TBA", size: "30%", chng: "30 Jan", reasoning: "Consolidation breakout. Core hedge removed, stop/hedge reset to TBA." }
            ],
            "Energies": [
                { name: "WTI", symbol: "CL1!", type: "short", position: "Short 61.89, stop/hedge TBA", size: "60%", chng: "29 Jan", reasoning: "Crude short size maintained at 60% with stops TBA." },
                { name: "URA", symbol: "URA", type: "long", position: "Long 46.95, stop/hedge TBA", size: "25%", chng: "20 Nov", reasoning: "Long term hold." }
            ],
            "Commodities": [
                { name: "Cotton", symbol: "CT1!", type: "long", position: "Long 64.70, stop/hedge TBA", size: "30%", chng: "6 Jan", reasoning: "Holding." },
                { name: "Wheat", symbol: "W1!", type: "long", position: "Long 513.80, stop/hedge TBA", size: "30%", chng: "6 Jan", reasoning: "Holding." },
                { name: "SoyB", symbol: "S1!", type: "long", position: "Long 1066, stop/hedge TBA", size: "20%", chng: "6 Jan", reasoning: "Holding." }
            ]
        }
    }
};

// Global App State
let activeDay = "Fri, Jan 30";
let selectedAsset = null;

// Map simple tickers to TradingView symbols
function mapTickerToTVSymbol(symbol) {
    const mappings = {
        "DXY": "TVC:DXY",
        "SPX": "SP:SPX",
        "NDX": "NASDAQ:NDX",
        "DE30": "FOREXCOM:DE30",
        "NVDA": "NASDAQ:NVDA",
        "PLTR": "NYSE:PLTR",
        "COIN": "NASDAQ:COIN",
        "MSTR": "NASDAQ:MSTR",
        "CRCL": "NASDAQ:CRCL",
        "TSLA": "NASDAQ:TSLA",
        "AVGO": "NASDAQ:AVGO",
        "XAUUSD": "OANDA:XAUUSD",
        "XAGUSD": "OANDA:XAGUSD",
        "HG1!": "COMEX:HG1!",
        "LIT": "NYSE:LIT",
        "BTCUSD": "COINBASE:BTCUSD",
        "ETHUSD": "COINBASE:ETHUSD",
        "XRPUSD": "COINBASE:XRPUSD",
        "SOLUSD": "COINBASE:SOLUSD",
        "NG1!": "NYMEX:NG1!",
        "CL1!": "NYMEX:CL1!",
        "URA": "NYSE:URA",
        "CT1!": "NYBOT:CT1!",
        "W1!": "CBOT:W1!",
        "S1!": "CBOT:S1!"
    };
    return mappings[symbol] || symbol;
}

// Render the multi-asset grid
function renderLedger() {
    const data = ledgerData[activeDay];
    const container = document.getElementById("ledger-groups");
    container.innerHTML = "";

    document.getElementById("active-date-label").innerText = data.dateString;
    document.getElementById("active-summary-banner").innerText = data.notes;

    for (const [groupName, assets] of Object.entries(data.categories)) {
        if (assets.length === 0) continue;

        const groupDiv = document.createElement("div");
        groupDiv.className = "asset-group";

        const title = document.createElement("div");
        title.className = "asset-group-title";
        title.innerText = groupName;
        groupDiv.appendChild(title);

        const grid = document.createElement("div");
        grid.className = "asset-grid";

        assets.forEach(asset => {
            const row = document.createElement("div");
            row.className = `asset-row ${selectedAsset && selectedAsset.name === asset.name ? 'active' : ''}`;
            row.onclick = () => selectAsset(asset);

            row.innerHTML = `
                <div class="asset-name">
                    <span class="asset-type-badge ${asset.type}"></span>
                    ${asset.name}
                </div>
                <div class="asset-position">${asset.position}</div>
                <div class="asset-size">${asset.size}</div>
                <div class="asset-chng">${asset.chng}</div>
            `;
            grid.appendChild(row);
        });

        groupDiv.appendChild(grid);
        container.appendChild(groupDiv);
    }
}

// Select an asset to display chart and reasoning
function selectAsset(asset) {
    selectedAsset = asset;
    
    // Highlight selected row in DOM
    document.querySelectorAll(".asset-row").forEach(el => el.classList.remove("active"));
    
    // Find and highlight in the generated DOM
    const rows = document.querySelectorAll(".asset-row");
    rows.forEach(row => {
        if (row.innerText.includes(asset.name)) {
            row.classList.add("active");
        }
    });

    // Update details panel
    document.getElementById("selected-asset-name").innerText = asset.name;
    
    const badge = document.getElementById("selected-asset-badge");
    badge.innerText = asset.type;
    badge.className = `chart-direction-badge ${asset.type}`;

    document.getElementById("stat-position").innerText = asset.position;
    document.getElementById("stat-size").innerText = asset.size;
    document.getElementById("stat-chng").innerText = asset.chng;
    document.getElementById("strategy-reasoning-content").innerText = asset.reasoning;

    // Load TradingView chart
    loadTradingViewChart(asset.symbol);

    // Sync Sizing Simulator
    const sizePct = parseInt(asset.size) || 10;
    document.getElementById("sim-size-slider").value = sizePct;
    document.getElementById("sim-size-val").innerText = sizePct + "%";
    calculateRisk();
}

// Initialize TradingView Widget
function loadTradingViewChart(symbol) {
    const container = document.getElementById("tradingview-chart-div");
    container.innerHTML = "";

    const mapped = mapTickerToTVSymbol(symbol);

    try {
        if (typeof TradingView !== 'undefined') {
            new TradingView.widget({
                "autosize": true,
                "symbol": mapped,
                "interval": "D",
                "timezone": "Etc/UTC",
                "theme": "dark",
                "style": "1",
                "locale": "en",
                "toolbar_bg": "#121824",
                "enable_publishing": false,
                "hide_side_toolbar": false,
                "allow_symbol_change": true,
                "container_id": "tradingview-chart-div"
            });
        } else {
            container.innerHTML = `
                <div class="tv-placeholder">
                    <span>Chart loading disabled (Offline Mode)</span>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">Symbol: ${mapped}</span>
                </div>`;
        }
    } catch (e) {
        console.error("TV widget load error", e);
        container.innerHTML = `<div class="tv-placeholder">Error loading chart: ${symbol}</div>`;
    }
}

// Change active timeline day
function setTimelineDay(dayKey) {
    activeDay = dayKey;
    document.querySelectorAll(".timeline-btn").forEach(btn => {
        if (btn.innerText.includes(dayKey)) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    renderLedger();
    
    // Auto-select first asset of the new day if none selected, or keep selection if exists
    const currentAssets = ledgerData[activeDay].categories;
    let found = null;
    for (const assets of Object.values(currentAssets)) {
        if (assets.length > 0) {
            found = assets[0];
            break;
        }
    }
    
    if (selectedAsset) {
        // Try to find the same asset in the new day's categories
        let matched = null;
        for (const assets of Object.values(currentAssets)) {
            const match = assets.find(a => a.name === selectedAsset.name);
            if (match) {
                matched = match;
                break;
            }
        }
        selectAsset(matched || found);
    } else if (found) {
        selectAsset(found);
    }
}

// Risk & Sizing Calculator
function calculateRisk() {
    const portfolioValue = parseFloat(document.getElementById("sim-capital-slider").value);
    const positionSizePercent = parseFloat(document.getElementById("sim-size-slider").value);
    const drawdownPercent = parseFloat(document.getElementById("sim-drawdown-slider").value);

    // Calculate unhedged loss
    const positionValue = portfolioValue * (positionSizePercent / 100);
    const unhedgedLoss = positionValue * (drawdownPercent / 100);

    // Veteran Hedging strategy rules:
    // 1. Core hedge offsets 50% to 100% of the position drawdown below the trigger level.
    // 2. We assume the hedge is activated halfway through the drawdown or is standard 50% protection.
    // 3. Option/contract premium costs roughly 1.5% of the position size.
    const hedgeCost = positionValue * 0.015; 
    const hedgeProtectionRatio = 0.70; // 70% downside protection on average
    
    let hedgedLoss = unhedgedLoss * (1 - hedgeProtectionRatio) + hedgeCost;
    if (hedgedLoss > unhedgedLoss) {
        // Under very small drawdowns, the cost of the hedge might exceed the protection.
        hedgedLoss = unhedgedLoss + (hedgeCost * 0.2); 
    }

    const capitalSaved = Math.max(0, unhedgedLoss - hedgedLoss);

    // Update UI numbers
    document.getElementById("sim-capital-val").innerText = "$" + portfolioValue.toLocaleString();
    document.getElementById("sim-size-val").innerText = positionSizePercent + "%";
    document.getElementById("sim-drawdown-val").innerText = drawdownPercent + "%";

    document.getElementById("result-unhedged").innerText = "$" + Math.round(unhedgedLoss).toLocaleString();
    document.getElementById("result-hedged").innerText = "$" + Math.round(hedgedLoss).toLocaleString();
    document.getElementById("result-saved").innerText = "$" + Math.round(capitalSaved).toLocaleString();

    // Update bar sizes
    const maxLoss = Math.max(unhedgedLoss, hedgedLoss, 1);
    const unhedgedWidth = (unhedgedLoss / maxLoss) * 100;
    const hedgedWidth = (hedgedLoss / maxLoss) * 100;

    document.getElementById("bar-unhedged").style.width = unhedgedWidth + "%";
    document.getElementById("bar-hedged").style.width = hedgedWidth + "%";
}

// Chat AI Mentor responses database
const chatBotResponses = [
    {
        keywords: ["gold", "short", "long", "flip", "reversal"],
        response: "On Friday, Jan 30, Gold underwent a critical macro structural breakout above 4900. Having held a 75% short posture through Thursday to exploit the range-high resistance sweeps, the breakout confirmation forced a systematic invalidation. Standard retail blowouts happen here because traders double-down on losing shorts. A 40-year veteran rule dictates: **Immediately close shorts when key resistance flips to support, and take a 10% test long**. I did exactly this at 4920 to participate in the momentum while keeping initial risk tight."
    },
    {
        keywords: ["coin", "mstr", "100%", "size", "allocation"],
        response: "Sizing a volatile asset like COIN or MSTR at 100% seems reckless to standard retail, but look closely at the hedging framework. In the COIN trade (Long 256.30), a hard stop/hedge is locked at 192. This represents a max loss of ~25% on the position. Since this is 100% of a specific sub-portfolio allocation, the net absolute portfolio drawdown is strictly capped at 25%. This is equitized leverage: using highly convex assets to drive alpha, but protecting the downside with structural contract hedges. It is not raw buy-and-hold; it's a managed options-synthetic structure."
    },
    {
        keywords: ["btc", "bitcoin", "staggered", "hedge", "levels"],
        response: "On Thursday, Jan 29, I implemented a staggered hedge on Bitcoin (Long 91200): 33.3% hedged at 89300, 33.3% at 86900, and 33.3% at 85900. In highly volatile markets, a single stop-loss level triggers a full exit right before a market rebound (a 'stop hunt'). By staggering the hedges, we scale-out of risk. If price drops to 89300, we hedge 1/3. If it rebounds, we keep 2/3 exposure. If it flattens to 85900, we are fully hedged and delta-neutral, preventing catastrophic liquidation."
    },
    {
        keywords: ["silver", "neutral", "spread", "105.30"],
        response: "On Jan 30, Silver was transitioned into a spread. The initial Short at 90.40 was protected by a breakeven stop. I then added a Long position at 105.30 with a 50% hedge trigger at 84. This creates a market-neutral volatility box. We harvest theta/delta variance between the 90.40 short and the 105.30 long, capturing spread margins while protecting the overall account balance."
    },
    {
        keywords: ["philosophy", "rules", "rule", "management", "risk"],
        response: "My trading model rests on four veteran pillars: \n\n1. **Capital Preservation First**: Never take a trade without a defined, structural stop or option hedge (No TBA stops on high-risk positions overnight).\n2. **The Breakeven Rule (SBE)**: Once a trade moves 1.5x of the risk parameter in your favor, the stop-loss must be moved to entry to guarantee a risk-free position.\n3. **Hedge, Don't Just Stop**: Use derivatives or spread correlation to protect core holdings rather than incurring slippage on market stops.\n4. **Weekend De-risking**: On Fridays, systematically trim high-beta sizes (as done on SPX and NASDAQ from 30% to 15%/20%) to shield capital from weekend black swan events."
    }
];

// Trigger Chat Reply
function sendChatMessage() {
    const input = document.getElementById("chat-input-field");
    const text = input.value.trim();
    if (!text) return;

    // Append user message
    appendChatMessage(text, "user");
    input.value = "";

    // Show simulated typing
    setTimeout(() => {
        let matchedResponse = "I have analyzed your ledger upload. Focus on risk management: specifically, look at how the stop-loss levels are adjusted to breakeven (SBE) on SPX and NASDAQ, and the staggered hedges on BTC. What specific position sizing or hedging logic would you like me to explain?";
        
        const lowerText = text.toLowerCase();
        for (const item of chatBotResponses) {
            if (item.keywords.some(keyword => lowerText.includes(keyword))) {
                matchedResponse = item.response;
                break;
            }
        }

        appendChatMessage(matchedResponse, "ai");
    }, 600);
}

function appendChatMessage(text, sender) {
    const container = document.getElementById("chat-messages-container");
    const msg = document.createElement("div");
    msg.className = `msg ${sender}`;
    
    // Convert newlines to breaks
    const formattedText = text.replace(/\n/g, "<br>");
    
    msg.innerHTML = `
        <div>${formattedText}</div>
        <div class="msg-timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    `;
    
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}

// Drag & Drop / File Upload OCR Simulation
function handleFileUpload(e) {
    const files = e.target.files || e.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];
    if (!file.type.match('image.*')) {
        alert("Please upload a valid ledger image file.");
        return;
    }

    // Activate scanner UI overlay
    const overlay = document.getElementById("ocr-scanner-overlay");
    const progress = document.getElementById("scanner-progress");
    const statusText = document.getElementById("scanner-status-text");
    
    overlay.classList.add("active");
    progress.style.width = "0%";
    
    const steps = [
        { progress: 20, text: "Reading image matrix..." },
        { progress: 45, text: "Running OCR layout engine..." },
        { progress: 70, text: "Extracting asset rows and sizing vectors..." },
        { progress: 90, text: "Validating stop/hedge levels against TradingView API..." },
        { progress: 100, text: "Compiling veteran rules and strategies..." }
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
        if (stepIdx < steps.length) {
            progress.style.width = steps[stepIdx].progress + "%";
            statusText.innerText = steps[stepIdx].text;
            stepIdx++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                overlay.classList.remove("active");
                injectMockLedger();
            }, 500);
        }
    }, 500);
}

// Inject a new parsed date into the timeline once OCR completes
function injectMockLedger() {
    const dayKey = "Mon, Feb 2";
    
    if (ledgerData[dayKey]) {
        alert("Ledger data for February 2 already loaded!");
        setTimelineDay(dayKey);
        return;
    }

    // Define mock parsed ledger data representing the next trading day
    ledgerData[dayKey] = {
        dateString: "Monday, February 2, 2026",
        notes: "Post-Weekend Gap. Gold long position is showing strength, and stop is moved to breakeven. Bitcoin hedges adjusted upwards as price breaks above $93,000.",
        categories: {
            "Currencies": [
                { name: "USDX", symbol: "DXY", type: "long", position: "Long 98.15, stop/hedge 98.60", size: "20%", chng: "27 Jan", reasoning: "Dollar holds support." }
            ],
            "Stocks/ETF's": [
                { name: "SPX500", symbol: "SPX", type: "long", position: "Long 6883, stop/hedge 6910", size: "15%", chng: "2 Feb", reasoning: "Stops raised above entry. Locked in +27 pts." },
                { name: "NASDAQ", symbol: "NDX", type: "long", position: "Long 25110 (20%), stop/hedge 25200", size: "20%", chng: "2 Feb", reasoning: "Stops raised above entry. Locked in +90 pts." },
                { name: "COIN", symbol: "COIN", type: "long", position: "Long 256.30, stop/hedge 210", size: "100%", chng: "2 Feb", reasoning: "Hedge raised to 210, reducing max sub-portfolio drawdown risk from 25% to 18%." }
            ],
            "Metals": [
                { name: "Gold", symbol: "XAUUSD", type: "long", position: "Long 4920, stop/hedge 4920", size: "15%", chng: "2 Feb", reasoning: "Gold position increased from 10% to 15%. Stop/hedge raised to breakeven entry (4920)." }
            ],
            "Crypto": [
                { name: "Bitcoin", symbol: "BTCUSD", type: "long", position: "Long 91200, 33% hedged at 91000, 33% at 89300", size: "30%", chng: "2 Feb", reasoning: "Bitcoin hedges trailed higher. First layer is now virtually risk-free at 91000." }
            ]
        }
    };

    // Add button dynamically to timeline steps in DOM
    const stepsContainer = document.getElementById("timeline-steps-container");
    
    const newBtn = document.createElement("button");
    newBtn.className = "timeline-btn";
    newBtn.onclick = () => setTimelineDay(dayKey);
    newBtn.innerHTML = `
        <span class="day-label">Simulated OCR</span>
        <span class="date-label">Feb 2, 26</span>
    `;
    stepsContainer.appendChild(newBtn);

    // Switch to new day
    setTimelineDay(dayKey);
    
    // Notify chatbot
    appendChatMessage("I have successfully processed your uploaded image ledger for Monday, February 2, 2026. I've extracted the data, raised the stops on SPX500, NASDAQ, and Gold to lock in profits, and updated your risk allocations. Select 'Feb 2, 26' in the timeline to view details.", "ai");
}

// Window Onload bindings
window.onload = () => {
    // Initial timeline load
    setTimelineDay("Fri, Jan 30");

    // Chat submit handlers
    document.getElementById("chat-send-btn").onclick = sendChatMessage;
    document.getElementById("chat-input-field").onkeydown = (e) => {
        if (e.key === "Enter") sendChatMessage();
    };

    // Simulator input handlers
    document.getElementById("sim-capital-slider").oninput = calculateRisk;
    document.getElementById("sim-size-slider").oninput = calculateRisk;
    document.getElementById("sim-drawdown-slider").oninput = calculateRisk;

    // Trigger initial calculation
    calculateRisk();

    // File Upload handling
    const dropzone = document.getElementById("dropzone");
    const fileInput = document.getElementById("file-input");

    dropzone.onclick = () => fileInput.click();
    fileInput.onchange = handleFileUpload;

    dropzone.ondragover = (e) => {
        e.preventDefault();
        dropzone.style.borderColor = "var(--color-primary)";
        dropzone.style.background = "rgba(59, 130, 246, 0.05)";
    };

    dropzone.ondragleave = () => {
        dropzone.style.borderColor = "rgba(59, 130, 246, 0.2)";
        dropzone.style.background = "rgba(59, 130, 246, 0.02)";
    };

    dropzone.ondrop = (e) => {
        e.preventDefault();
        dropzone.style.borderColor = "rgba(59, 130, 246, 0.2)";
        dropzone.style.background = "rgba(59, 130, 246, 0.02)";
        handleFileUpload(e);
    };
};
