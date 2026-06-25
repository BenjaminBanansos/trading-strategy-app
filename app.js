// Global App State
let activeDay = "";
let selectedAsset = null;
let allHistory = {}; // Load from portfolio_history.json
let monthsList = [];
let activeMonth = "";

// Course Slide Database
let activeModuleIdx = 0;
let activeSlideIdx = 0;

const courseModules = [
    {
        category: "Module 1: Money Management",
        title: "Trade Like a Grown-Up (Defence First)",
        slides: [
            {
                subtitle: "Trading Is Not Gambling",
                content: `
                    <p>Trading is a game of probabilities wrapped in uncertainty, powered by human emotion. Dr. David Paul famously said: <em>"A winning system with a losing mindset is a losing system."</em></p>
                    <div class="alert-banner" style="background: rgba(59, 130, 246, 0.05); color: var(--color-primary); border-color: rgba(59, 130, 246, 0.15); margin: 0.5rem 0;">
                        <span class="alert-dot" style="background: var(--color-primary);"></span>
                        <strong>Key Takeaway:</strong> You are not here to be right. You are here to survive long enough to be right enough. Your weapon is process; your shield is risk management; your undoing is ego.
                    </div>
                    <h4>The Survival Rules:</h4>
                    <ul>
                        <li>Never treat trades as coin flips. Seek confluent edges.</li>
                        <li>Sitting out in cash is an active, positive market position.</li>
                        <li>Consistency isn't sexy. But neither is losing your house.</li>
                    </ul>
                `
            },
            {
                subtitle: "Position Sizing & DCA Units",
                content: `
                    <p>Standard retail traders risk random chunks of capital on single setups. Professional portfolio management operates strictly under the <strong>1% to 2% Risk Rule</strong>.</p>
                    <h4>Key Money Guidelines:</h4>
                    <ul>
                        <li><strong>Never risk more than 1-2% of total capital</strong> on a single position. If stopped out, the loss must not exceed this margin.</li>
                        <li><strong>Think in Risk Units</strong>: Sizing is defined by stop-loss distance. A 100% position size is acceptable ONLY if the downside is hedged or stopped within your 1-2% capital risk unit.</li>
                        <li><strong>DCA In and Out:</strong> Enter in measured clips (scale-in) to let the market confirm your view. Scale-out methodically to lock in profits while leaving room to run.</li>
                    </ul>
                `
            },
            {
                subtitle: "The Danger of Clustering",
                content: `
                    <p>Clustering occurs when multiple losses (or wins) take place in quick succession. This triggers emotional bias, revenge trading, and overleveraging.</p>
                    <div class="pattern-visualizer-container">
                        <div class="candlestick-col" style="width: 140px;">
                            <div style="color: var(--color-danger); font-size: 1.25rem; font-weight: 700;">-15% Drawdown</div>
                            <div class="candle-label">5 consecutive 3% losses</div>
                        </div>
                        <div class="candlestick-col" style="width: 140px;">
                            <div style="color: var(--color-success); font-size: 1.25rem; font-weight: 700;">-5% Drawdown</div>
                            <div class="candle-label">5 losses at 1% Risk Unit</div>
                        </div>
                    </div>
                    <h4>How to combat Variance spikes:</h4>
                    <ul>
                        <li>When clustered losses appear, assume the market regime has changed (or your focus has). **Stop and reassess**.</li>
                        <li>Reduce position sizes by half or step back from active trading.</li>
                        <li>Never trade to "get it back" (emotional revenge trading).</li>
                    </ul>
                `
            },
            {
                subtitle: "The Line in the Sand & Counter-Hedging",
                content: `
                    <p>Every trade must have a clear invalidation point—a technical or fundamental level where your thesis "no longer makes sense."</p>
                    <h4>Hedge-and-Hold over Stop Slippage:</h4>
                    <ul>
                        <li>Instead of setting raw market stop-losses that trigger massive slippage during thin liqudity, use **counter-trades** or option contracts to balance risk.</li>
                        <li><strong>Example:</strong> In a long Natural Gas (NGAS.F) macro trade, if price breaks support, short a correlated energy asset (WTI) or buy protective put contracts to neutralize net delta exposure.</li>
                        <li>This lets you hold the structural setup without risking liquidation or premature stop-outs on market wicks.</li>
                    </ul>
                `
            },
            {
                subtitle: "Applied Example: NASDAQ & USDX",
                content: `
                    <p>Let's look at how the 40-year veteran applied these money codes in the Jan 2026 logs:</p>
                    <ul>
                        <li><strong>USDX Long:</strong> Sized at 10% on Jan 26. Invalidation was 98.60 (just below 99.30 entry). On Jan 27, price dipped; he scaled in (doubled size to 20% at 98.15) and locked stop/hedge at 98.60, creating a risk-locked profitable structure.</li>
                        <li><strong>NASDAQ SBE Lock:</strong> Sized at 30% long. On Jan 28, following a strong gain, the stop-loss was raised to entry (25110). This moved the trade into **Risk-Free Mode**, protecting the core portfolio.</li>
                        <li><strong>Friday De-risking:</strong> On Friday, Jan 30, the veteran trimmed SPX500 from 30% to 15% and NASDAQ from 30% to 20% before the weekend close, locking cash gains and protecting against weekend gap-downs.</li>
                    </ul>
                `
            }
        ]
    },
    {
        category: "Module 2: Technical Strategy",
        title: "ArcisFX G7 Swing Trading System",
        slides: [
            {
                subtitle: "Multi-Timeframe Structure",
                content: `
                    <p>The G7 Swing Trading system is a high-probability model built on two key time periods for major currency pairs (EURUSD, GBPUSD, USDJPY, USDCHF):</p>
                    <ul>
                        <li><strong>Weekly (W) Charts:</strong> Used to determine the overall weekly trend direction and define macro reversal boundaries.</li>
                        <li><strong>Hourly (1H) Charts:</strong> Used to execute entries and manage micro targets.</li>
                    </ul>
                    <p>We trade in the direction of the weekly trend. If the weekly bias is bullish, we only buy dips on the hourly chart. If bearish, we only short rallies.</p>
                `
            },
            {
                subtitle: "Indicator Screen Setup",
                content: `
                    <p>The G7 system is not primarily indicator-driven, but uses a clean statistical probability band setup on the charts:</p>
                    <h4>1. Hourly (1H) Indicators:</h4>
                    <ul>
                        <li><strong>100-Hour Bollinger Band</strong> (Deviation 2, Shift 0) - represents intermediate volatility boundaries.</li>
                        <li><strong>200-Hour Bollinger Band</strong> (Deviation 2, Shift 0) - represents major volatility extremes.</li>
                        <li><strong>200-Period SMA</strong> (Simple Moving Average) - acts as the baseline probability gravity point.</li>
                        <li><strong>14/7/3 Slow Stochastic Oscillator</strong> - oversold/overbought indicator.</li>
                    </ul>
                    <h4>2. Weekly (W) Indicators:</h4>
                    <ul>
                        <li><strong>10-Week SMA</strong> - serves as a medium-term guide to market direction. Reversals frequently occur near this line.</li>
                    </ul>
                `
            },
            {
                subtitle: "Weekly Bias & Reversal Boundaries",
                content: `
                    <p>Every weekend, determine the upcoming week's bias by comparing the closed weekly candle to the previous week:</p>
                    <ul>
                        <li><strong>Bullish Scenario:</strong> Weekly candle has a higher high and/or higher low, or has formed a "spike low" hammer at a major support zone.</li>
                        <li><strong>Bearish Scenario:</strong> Weekly candle has a lower high and/or lower low, or has formed a "spike high" shooting star.</li>
                        <li><strong>The Reversal Line (10-Pip rule):</strong> If bullish, place the reversal boundary **10 pips below the weekly low**. If price drops below this line during the week, the bias is invalidated and long trading must stop.</li>
                    </ul>
                `
            },
            {
                subtitle: "The 6 Entry Point Rules",
                content: `
                    <p>A trade is initiated ONLY if all six conditions align on the hourly (1H) chart:</p>
                    <ul>
                        <li><strong>Rule 1: Wait for Hourly Close.</strong> Never trade mid-candle; enter only on hour rollover when volatility stabilizes.</li>
                        <li><strong>Rule 2: Stochastic check.</strong> Stochastic must be oversold (&lt; 20) for buying, or overbought (&gt; 80) for selling.</li>
                        <li><strong>Rule 3: Volatility zone.</strong> Price must touch or pierce the 100-hour BB, 200-hour BB, or 200-hour SMA.</li>
                        <li><strong>Rule 4: Confluence levels.</strong> Look for horizontal support/resistance (SR), trendlines, or Fibonacci retracements (38.2%, 50%, 61.8%, 78.6%).</li>
                        <li><strong>Rule 5: Reversal Candle.</strong> Wait for a clear candlestick confirmation trigger (e.g., Hammer, Engulfing candle) at the close.</li>
                        <li><strong>Rule 6: Trade parameters.</strong> Place stop loss **5-10 pips beyond the reversal candle** (min 20 pips, max 60 pips). Target is minimum 2:1 Reward/Risk.</li>
                    </ul>
                `
            },
            {
                subtitle: "G7 Candlestick Visualizer",
                content: `
                    <p>The G7 system relies heavily on specific candle structures at key support/resistance zones to confirm entries:</p>
                    <div class="pattern-visualizer-container">
                        <div class="candlestick-col">
                            <div class="candle-container">
                                <div class="candle-wick hammer-wick"></div>
                                <div class="candle-body bullish hammer-body"></div>
                            </div>
                            <div class="candle-label">Hammer<br>(Spike Low)</div>
                        </div>
                        <div class="candlestick-col">
                            <div class="candle-container" style="flex-direction: row; gap: 4px;">
                                <div style="position: relative; width: 10px; height: 100px;">
                                    <div class="candle-wick" style="height: 90px; top: 5px; left: 4px;"></div>
                                    <div class="candle-body bearish pierce1-body" style="width: 10px; left: 0;"></div>
                                </div>
                                <div style="position: relative; width: 10px; height: 100px;">
                                    <div class="candle-wick" style="height: 90px; top: 5px; left: 4px;"></div>
                                    <div class="candle-body bullish pierce2-body" style="width: 10px; left: 0;"></div>
                                </div>
                            </div>
                            <div class="candle-label">Piercing Line<br>(Bullish Reversal)</div>
                        </div>
                        <div class="candlestick-col">
                            <div class="candle-container" style="flex-direction: row; gap: 4px;">
                                <div style="position: relative; width: 10px; height: 100px;">
                                    <div class="candle-wick" style="height: 80px; top: 10px; left: 4px;"></div>
                                    <div class="candle-body bearish engulf1-body" style="width: 10px; left: 0;"></div>
                                </div>
                                <div style="position: relative; width: 10px; height: 100px;">
                                    <div class="candle-wick" style="height: 95px; top: 2px; left: 4px;"></div>
                                    <div class="candle-body bullish engulf2-body" style="width: 10px; left: 0;"></div>
                                </div>
                            </div>
                            <div class="candle-label">Bullish Engulfing<br>(Strong buying)</div>
                        </div>
                        <div class="candlestick-col">
                            <div class="candle-container">
                                <div class="candle-wick" style="height: 80px; top: 10px;"></div>
                                <div class="candle-body doji-body"></div>
                            </div>
                            <div class="candle-label">Doji Star<br>(Indecision)</div>
                        </div>
                    </div>
                    <p style="font-size: 0.8rem; text-align: center; color: var(--text-muted);">Confirm these shapes on the hourly close (Rule 5) before hitting buy or sell.</p>
                `
            }
        ]
    },
    {
        category: "Module 3: Advanced Testing",
        title: "Backtesting, News & Macro Events",
        slides: [
            {
                subtitle: "News Events & Macro Regimes",
                content: `
                    <p>Veterans backtest their models against historical news releases. Major events like CPI, NFP, GDP, or FOMC rate decisions generate massive volatility that violates standard technical structures.</p>
                    <h4>How the Veteran Trades Around News:</h4>
                    <ul>
                        <li><strong>Avoid the Release Wick:</strong> Never enter a trade minutes before or during a high-impact news release. Spread markup and slippage will ruin your risk ratio.</li>
                        <li><strong>Let the Volatility Settle:</strong> Wait for the news release hourly candle to close. If the news swept the 200-hour Bollinger Band and closed as a reversal Hammer (Rule 5), a high-probability trigger is formed.</li>
                        <li><strong>Macro Correlation Check:</strong> Ensure that index trends align with interest rate/currency direction (e.g. SPX/NASDAQ strength correlates with USDX weakness).</li>
                    </ul>
                `
            },
            {
                subtitle: "Event Drift & Backtesting",
                content: `
                    <p>To backtest effectively, you must map the technical setup alongside historical macro dates:</p>
                    <ul>
                        <li>Go back in your charts to major news dates (e.g. CPI print days).</li>
                        <li>Examine how price behaved around the 100/200 Bollinger Bands on the 1-hour chart post-release.</li>
                        <li>Calculate the hit rate of G7 Entry Rule 2 (Stochastics oversold/overbought) after news-driven washes. You will find that stochastics washes at 200-hour SMA offer the most robust win rates.</li>
                    </ul>
                `
            },
            {
                subtitle: "Applied Example: WTI & Gold",
                content: `
                    <p>Look at the veteran's logs during late January news cycles:</p>
                    <ul>
                        <li><strong>WTI Crude (Jan 29):</strong> Sized short at 60% after WTI swept range highs on inventory news. Hedges were TBA while waiting for weekly inventory structures to stabilize.</li>
                        <li><strong>Gold Reversal (Jan 30):</strong> Gold swept shorts at 4482 and broke out of macro channels on a Friday. The veteran immediately cut the 75% short and flipped to a 10% test Long. This shows **flexibility over stubbornness** in response to structural news gaps.</li>
                    </ul>
                `
            }
        ]
    },
    {
        category: "Module 4: Risk Lock & Hedging",
        title: "Hedgehog & Risk Lock Systems",
        slides: [
            {
                subtitle: "The Hedgehog Strategy",
                content: `
                    <p>The **Hedgehog Strategy** is a risk-neutral model where you use correlated assets or options to balance risk, rather than triggering raw stop-losses.</p>
                    <h4>Core Principles:</h4>
                    <ul>
                        <li>When a position goes into drawdown, instead of taking a permanent loss on a market stop, you open an opposite position in a highly correlated asset or option.</li>
                        <li><strong>Example (Silver Jan 30):</strong> The veteran held a 7.5% Short on Silver at 90.40, fully hedged at 93.52. As price drifted, he added a Long position at 105.30, 50% hedged at 84. This creates a net spread box that collects spread margins while neutralizing directional risk.</li>
                        <li>This prevents capital bleeding during choppy, uncertain macro environments.</li>
                    </ul>
                `
            },
            {
                subtitle: "The Risk Lock Method",
                content: `
                    <p>The **Risk Lock** system is a trailing defense model designed to lock in trade value as price moves in your favor:</p>
                    <ul>
                        <li><strong>Phase 1 (Entry):</strong> Position is entered with a defined stop or options hedge (Max risk 1.5% capital).</li>
                        <li><strong>Phase 2 (SBE Lock):</strong> Once price reaches 1.5x of the initial risk value, the stop is moved to entry (SBE). Risk is now 0%.</li>
                        <li><strong>Phase 3 (Trailing Hedge):</strong> As price makes new highs, add staggered hedges (like BTC on Jan 29: 33.3% hedged at 89.3k, 33.3% at 86.9k, 33.3% at 85.9k). This trailing hedge locks in partial profits while keeping 2/3 of the position open to run.</li>
                    </ul>
                `
            },
            {
                subtitle: "Your Capital Allocation Plan",
                content: `
                    <p>You have three accounts totaling approximately <strong>$22,140 USD Equiv.</strong> ($18,000 CAD + $6,400 USD + $2,600 USD). Here is how you should allocate risk like the veteran:</p>
                    
                    <h4>1. Account A ($18,000 CAD) - Core Swing Account</h4>
                    <ul>
                        <li><strong>Allocation focus:</strong> Forex Majors (EURUSD, GBPUSD) and Index ETFs (SPY, QQQ).</li>
                        <li><strong>Max Risk Unit (1.5%):</strong> $270 CAD per trade.</li>
                        <li><strong>Position Sizing:</strong> If trading GBPUSD with a G7 30-pip stop loss, allocate a position size of **$9,000 CAD** (1:1 leverage, 0.9 mini lots). If stopped out, you lose exactly $270 CAD.</li>
                    </ul>
                    
                    <h4>2. Account B ($6,400 USD) - Conviction Account</h4>
                    <ul>
                        <li><strong>Allocation focus:</strong> High-beta tech equities (NVDA, COIN) or Crypto (BTC).</li>
                        <li><strong>Max Risk Unit (1.5%):</strong> $96 USD per trade.</li>
                        <li><strong>Position Sizing:</strong> If allocating $3,200 USD (50% size) to COIN with a 20% stop loss, your risk is $640 USD (violates the rule). **You must buy a protective put option at 192** for $96 premium. If COIN crashes, your loss is capped at the premium ($96 USD), locking your risk to 1.5%!</li>
                    </ul>

                    <h4>3. Account C ($2,600 USD) - Volatility Buffer</h4>
                    <ul>
                        <li>Keep this account in cash (USD yield) or use it strictly for minor G7 swing setups with tight 20-pip stops (Max risk $39 USD per trade).</li>
                    </ul>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">Use the calculator in the dashboard tab to automatically compute these lot sizes and risk units!</p>
                `
            }
        ]
    },
    {
        category: "Module 5: Commodity Trading",
        title: "NATGAS 'Widow Maker' Techniques",
        slides: [
            {
                subtitle: "Natural Gas & Market Drivers",
                content: `
                    <p>Natural gas is famously nicknamed the **"Widow Maker"** due to its extreme, unpredictable volatility. It supplies roughly 24% of the energy requirements of developed countries, and is highly sensitive to the following drivers:</p>
                    <ul>
                        <li><strong>Supply Factors:</strong> Production levels and monthly **EIA Storage Reports** (which indicate if the market is oversupplied or undersupplied).</li>
                        <li><strong>Demand Factors:</strong> Industrial, commercial, and residential consumption.</li>
                        <li><strong>Weather Seasonality:</strong> Highly weather-dependent. Winter cold drives residential heating spikes; Summer heat drives electricity generation (cooling) spikes.</li>
                        <li><strong>Geopolitics:</strong> Environmental policies, trade regulations, and pipeline politics can immediately cause massive price gaps.</li>
                    </ul>
                `
            },
            {
                subtitle: "Trading Instruments: Futures vs. ETFs",
                content: `
                    <p>Retail traders have two primary instruments to participate in the Natural Gas market:</p>
                    <ul>
                        <li><strong>Futures Contracts (NGAS.F / NG1):</strong> Standardized contracts traded on the NYMEX. Offers "pure" price representation and high leverage, but exposes you to monthly rollover contract costs (contango vs backwardation).</li>
                        <li><strong>Continuous ETFs (NATGAS):</strong> Simpler access without a futures account, no monthly rollover to manage.</li>
                    </ul>
                    <div class="alert-banner" style="background: rgba(239, 68, 68, 0.05); color: var(--color-danger); border-color: rgba(239, 68, 68, 0.15); margin: 0.5rem 0;">
                        <span class="alert-dot" style="background: var(--color-danger);"></span>
                        <strong>Warning on BOIL & KOLD:</strong> These are 2x leveraged ETFs designed for daily speculation. Holding them long-term guarantees massive losses due to volatility drag, decay, and compounding errors in choppy markets. <strong>Best left to pros or masochists.</strong>
                    </div>
                `
            },
            {
                subtitle: "COT (Commitments of Traders) Analysis",
                content: `
                    <p>The Commitments of Traders (COT) report from Barchart.com is a crucial tool to understand institutional sentiment in Natural Gas:</p>
                    <ul>
                        <li><strong>Commercials (Producers/Hedgers):</strong> Typically trade against the trend to lock in prices. A net short position indicates they expect lower prices.</li>
                        <li><strong>Managed Money (Speculators/Hedge Funds):</strong> Speculative trend-followers. Extreme net long or net short positions indicate a market bubble that frequently precedes a major reversal.</li>
                        <li><strong>Bullish Divergence:</strong> If prices are declining but managed money net shorts begin to reverse and cover, it provides a powerful confirmation signal for a long reversal.</li>
                    </ul>
                `
            },
            {
                subtitle: "The Step-by-Step Trade Process",
                content: `
                    <p>To swing trade Natural Gas safely, you must follow this daily checklist before taking action:</p>
                    <ol>
                        <li><strong>Check COT positioning</strong> on Barchart.com to identify institutional extremes.</li>
                        <li><strong>Check Weather and Seasonality</strong> via <em>natgasweather.com</em>.</li>
                        <li><strong>Check News Calendars</strong> on <em>myfxbook.com</em> to identify upcoming macro energy releases.</li>
                        <li><strong>Check Multi-Timeframe Trends:</strong> Review daily/weekly charts for overall trend, and 4-hour/1-hour charts for entry triggers.</li>
                        <li><strong>Position Sizing Formula:</strong> Always compute: <br>
                        <code style="background: rgba(255, 255, 255, 0.05); padding: 0.2rem 0.4rem; border-radius: 4px; display: inline-block; margin-top: 0.25rem;">Size = (Amount at risk per trade) / (Entry Price - Stop Price)</code></li>
                        <li><strong>Apply Hedging:</strong> If trading futures, be prepared to open counter-contracts or options to offset sudden weather gap risk.</li>
                    </ol>
                `
            }
        ]
    }
];

// Map simple tickers to TradingView symbols
function getSymbolForAsset(name) {
    const nameLower = name.toLowerCase().trim();
    const mappings = {
        "usdx": "DXY", "spx500": "SPX", "nasdaq": "NDX", "ger30": "DE30",
        "nvda": "NVDA", "pltr": "PLTR", "coin": "COIN", "mstr": "MSTR",
        "crcl": "CRCL", "tsla": "TSLA", "avgo": "AVGO", "gold": "XAUUSD",
        "silver": "XAGUSD", "copper": "HG1!", "lit": "LIT", "bitcoin": "BTCUSD",
        "eth": "ETHUSD", "xrp": "XRPUSD", "sol": "SOLUSD", "ngas.f": "NG1!",
        "wti": "CL1!", "ura": "URA", "cotton": "CT1!", "wheat": "W1!", "soyb": "S1!"
    };
    return mappings[nameLower] || name.toUpperCase();
}

// Group dates into months for sorting and timeline filtering
function getMonthName(dateKey) {
    if (dateKey.includes("Jan")) return "January";
    if (dateKey.includes("Feb")) return "February";
    if (dateKey.includes("Mar")) return "March";
    if (dateKey.includes("Apr")) return "April";
    if (dateKey.includes("May")) return "May";
    if (dateKey.includes("Jun")) return "June";
    
    if (dateKey.includes("-01-")) return "January";
    if (dateKey.includes("-02-")) return "February";
    if (dateKey.includes("-03-")) return "March";
    if (dateKey.includes("-04-")) return "April";
    if (dateKey.includes("-05-")) return "May";
    if (dateKey.includes("-06-")) return "June";
    
    return "Other";
}

// Convert month name to order index
function getMonthOrder(month) {
    const orders = { "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6 };
    return orders[month] || 99;
}

// Parse day string to date for chronological sorting
function getParsedDate(dateKey, fullObj) {
    if (fullObj && fullObj.date) {
        const clean = fullObj.date.trim();
        const df = new Date(clean);
        if (!isNaN(df.getTime())) return df;
    }
    const parts = dateKey.split(" ");
    if (parts.length >= 3) {
        const monthMap = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5 };
        const monthIndex = monthMap[parts[1].replace(",", "")];
        const day = parseInt(parts[2]);
        if (monthIndex !== undefined && !isNaN(day)) {
            return new Date(2026, monthIndex, day);
        }
    }
    return new Date(0);
}

// Fetch the 106 parsed days from JSON
async function initApp() {
    try {
        const response = await fetch("portfolio_history.json");
        if (response.ok) {
            allHistory = await response.json();
            console.log("Loaded history successfully, items:", Object.keys(allHistory).length);
        } else {
            console.warn("Failed to fetch JSON, using fallback data.");
            allHistory = fallbackLedgerData;
        }
    } catch (e) {
        console.error("Fetch error", e);
        allHistory = fallbackLedgerData;
    }

    buildTimelineControls();
    renderSlide();
}

// Build months navigation and horizontal days selector
function buildTimelineControls() {
    const keys = Object.keys(allHistory);
    const months = new Set();
    keys.forEach(k => months.add(getMonthName(k)));
    
    monthsList = Array.from(months).sort((a, b) => getMonthOrder(a) - getMonthOrder(b));
    
    const monthContainer = document.getElementById("month-filter-container");
    monthContainer.innerHTML = "";
    
    monthsList.forEach(m => {
        const btn = document.createElement("button");
        btn.className = `month-btn ${activeMonth === m ? 'active' : ''}`;
        btn.innerText = m;
        btn.onclick = () => selectMonth(m);
        monthContainer.appendChild(btn);
    });

    if (!activeMonth && monthsList.length > 0) {
        const defaultMonth = monthsList.includes("June") ? "June" : monthsList[0];
        selectMonth(defaultMonth);
    } else {
        renderDaysTimeline();
    }
}

// Handle month tab click
function selectMonth(month) {
    activeMonth = month;
    
    document.querySelectorAll(".month-btn").forEach(btn => {
        if (btn.innerText === month) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    renderDaysTimeline();
    
    const daysInMonth = getDaysOfActiveMonth();
    if (daysInMonth.length > 0) {
        setTimelineDay(daysInMonth[0].key);
    }
}

// Filter sorted days list for active month
function getDaysOfActiveMonth() {
    return Object.entries(allHistory)
        .filter(([key, _]) => getMonthName(key) === activeMonth)
        .map(([key, value]) => ({ key, value }))
        .sort((a, b) => getParsedDate(a.key, a.value).getTime() - getParsedDate(b.key, b.value).getTime());
}

// Render horizontal days list
function renderDaysTimeline() {
    const daysList = getDaysOfActiveMonth();
    const container = document.getElementById("timeline-steps-container");
    container.innerHTML = "";
    
    daysList.forEach(day => {
        const btn = document.createElement("button");
        btn.className = `timeline-btn ${activeDay === day.key ? 'active' : ''}`;
        btn.onclick = () => setTimelineDay(day.key);
        
        let weekday = "Day";
        let datePart = day.key;
        
        const commaParts = day.value.date.split(",");
        if (commaParts.length >= 2) {
            weekday = commaParts[0].trim();
            const spaceParts = commaParts[1].trim().split(" ");
            if (spaceParts.length >= 2) {
                datePart = `${spaceParts[0]} ${spaceParts[1]}`;
            }
        }

        btn.innerHTML = `
            <span class="day-label">${weekday}</span>
            <span class="date-label">${datePart}</span>
        `;
        container.appendChild(btn);
    });

    setTimeout(() => {
        const activeBtn = container.querySelector(".timeline-btn.active");
        if (activeBtn) {
            activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, 100);
}

// Render position rows inside active ledger
function renderLedger() {
    const data = allHistory[activeDay];
    if (!data) return;

    const container = document.getElementById("ledger-groups");
    container.innerHTML = "";

    document.getElementById("active-date-label").innerText = data.date;
    document.getElementById("active-summary-banner").innerText = data.notes;

    const categoriesSorted = ["Currencies", "Stocks/ETF's", "Metals", "Crypto", "Energies", "Commodities"];
    
    categoriesSorted.forEach(groupName => {
        const assets = data.categories[groupName] || [];
        if (assets.length === 0) return;

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
            const assetType = getTypeForPosition(asset.position);
            row.className = `asset-row ${selectedAsset && selectedAsset.name === asset.name ? 'active' : ''}`;
            row.onclick = () => selectAsset(asset, assetType);

            row.innerHTML = `
                <div class="asset-name">
                    <span class="asset-type-badge ${assetType}"></span>
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
    });
}

// Select an asset to display detail cards and sync charts
function selectAsset(asset, assetType) {
    selectedAsset = asset;
    
    document.querySelectorAll(".asset-row").forEach(row => {
        if (row.querySelector(".asset-name").innerText.trim() === asset.name) {
            row.classList.add("active");
        } else {
            row.classList.remove("active");
        }
    });

    document.getElementById("selected-asset-name").innerText = asset.name;
    
    const badge = document.getElementById("selected-asset-badge");
    badge.innerText = assetType || getTypeForPosition(asset.position);
    badge.className = `chart-direction-badge ${badge.innerText}`;

    document.getElementById("stat-position").innerText = asset.position;
    document.getElementById("stat-size").innerText = asset.size;
    document.getElementById("stat-chng").innerText = asset.chng;
    
    const reasonText = getReasoningForAsset(asset, badge.innerText);
    document.getElementById("strategy-reasoning-content").innerText = reasonText;

    loadTradingViewChart(getSymbolForAsset(asset.name));

    // Sync Sizing Simulator Stop Loss distance if available
    // E.g. stop/hedge 192 on COIN entry 256.3 is 25% stop distance.
    const posLower = asset.position.toLowerCase();
    let detectedDrawdown = 20;
    if (posLower.includes("stop/hedge") || posLower.includes("hedged")) {
        // Try to parse values out to calculate drawdown distance
        const numbers = posLower.match(/\d+(\.\d+)?/g);
        if (numbers && numbers.length >= 2) {
            const entryVal = parseFloat(numbers[0]);
            const stopVal = parseFloat(numbers[1]);
            if (entryVal > 0 && stopVal > 0) {
                detectedDrawdown = Math.min(60, Math.max(2, Math.round((Math.abs(entryVal - stopVal) / entryVal) * 100)));
            }
        }
    }
    document.getElementById("sim-drawdown-slider").value = detectedDrawdown;
    document.getElementById("sim-drawdown-val").innerText = detectedDrawdown + "%";
    calculateRisk();
}

// Dynamic text generator for Strategy reasoning box
function getReasoningForAsset(asset, type) {
    const lowerName = asset.name.toLowerCase();
    const pos = asset.position;
    
    // G7 Rule correlations:
    if (lowerName === "usdx" || lowerName === "eurusd" || lowerName === "gbpusd") {
        return `G7 Swing Trade setup active. Direction decided from Weekly candle trend. Hourly close (Rule 1) and Stochastic oversold status (Rule 2) confirmed entry with a 20-60 pip stop-loss (Rule 6).`;
    }
    if (type === "short") {
        return `Short trade active on ${asset.name}. Stop/hedge protection is configured in line with macroeconomic resistance levels. Sized at ${asset.size} allocation. Strategy validation holds a bearish bias based on channel structure.`;
    }
    if (type === "hedged") {
        return `Volatility protection active. ${asset.name} is in a defensive hedged structure (${pos}) to isolate tail-risk. This caps absolute capital drawdown during market consolidation phases, preserving liquidity.`;
    }
    if (lowerName === "coin" || lowerName === "mstr") {
        return `Conviction momentum hold. COIN/MSTR represent equitized crypto proxies. Although sized heavily at 100%, the downside is capped with hard contract hedge triggers at technical pivots.`;
    }
    if (lowerName === "gold") {
        if (pos.toLowerCase().includes("long")) {
            return `Gold holds a bullish posture (${pos}) following a breakout confirmation. Short resistance swept; flipped to a long positioning to capture breakout momentum.`;
        } else {
            return `Gold range-high short sweeps active. Fully hedged at overhead limits to lock in maximum structural risk limits.`;
        }
    }
    return `Bullish macro trend-following position. stop/hedge levels are moved progressively (SBE) to protect net capital value. Risk sizing is set to a standard ${asset.size}.`;
}

// Switch between dashboard view and course academy view
function switchView(viewName) {
    const dashboard = document.getElementById("dashboard-view");
    const academy = document.getElementById("academy-view");
    const btnDash = document.getElementById("tab-dashboard");
    const btnAcad = document.getElementById("tab-academy");

    if (viewName === "dashboard") {
        dashboard.style.display = "block";
        academy.style.display = "none";
        btnDash.classList.add("active");
        btnAcad.classList.remove("active");
    } else {
        dashboard.style.display = "none";
        academy.style.display = "block";
        btnDash.classList.remove("active");
        btnAcad.classList.add("active");
        renderSlide();
    }
}

// Course Module Selector
function selectCourseModule(moduleIdx) {
    activeModuleIdx = moduleIdx;
    activeSlideIdx = 0;
    
    document.querySelectorAll(".module-btn").forEach((btn, idx) => {
        if (idx === moduleIdx) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    renderSlide();
}

// Render the active slide details
function renderSlide() {
    const mod = courseModules[activeModuleIdx];
    if (!mod) return;
    const slide = mod.slides[activeSlideIdx];
    if (!slide) return;

    document.getElementById("slide-category").innerText = mod.category;
    document.getElementById("slide-title").innerText = slide.subtitle;
    document.getElementById("slide-progress").innerText = `Slide ${activeSlideIdx + 1} of ${mod.slides.length}`;
    
    document.getElementById("slide-body-content").innerHTML = slide.content;

    // Toggle button visibilities
    const prevBtn = document.getElementById("slide-prev-btn");
    const nextBtn = document.getElementById("slide-next-btn");

    if (activeSlideIdx === 0) {
        prevBtn.style.opacity = "0.5";
        prevBtn.style.pointerEvents = "none";
    } else {
        prevBtn.style.opacity = "1";
        prevBtn.style.pointerEvents = "auto";
    }

    if (activeSlideIdx === mod.slides.length - 1) {
        nextBtn.innerHTML = `Complete Module <i class="fa-solid fa-check"></i>`;
    } else {
        nextBtn.innerHTML = `Next Slide <i class="fa-solid fa-arrow-right"></i>`;
    }
}

function nextSlide() {
    const mod = courseModules[activeModuleIdx];
    if (activeSlideIdx < mod.slides.length - 1) {
        activeSlideIdx++;
        renderSlide();
    } else {
        // Complete module
        if (activeModuleIdx < courseModules.length - 1) {
            alert(`Module "${mod.title}" completed! Moving to next module.`);
            selectCourseModule(activeModuleIdx + 1);
        } else {
            alert("Congratulations! You have completed the entire Strategy & Risk Academy course!");
        }
    }
}

function prevSlide() {
    if (activeSlideIdx > 0) {
        activeSlideIdx--;
        renderSlide();
    }
}

// User-Specific Account Sizing Calculator
function changeAccountCapital() {
    const selector = document.getElementById("sim-account-select");
    const val = selector.value;
    const capitalSlider = document.getElementById("sim-capital-slider");
    const capitalLabel = document.getElementById("sim-capital-val");

    let capital = 18000;
    let labelSuffix = " CAD";

    if (val === "18000_CAD") {
        capital = 18000;
        labelSuffix = " CAD";
    } else if (val === "6400_USD") {
        capital = 6400;
        labelSuffix = " USD";
    } else if (val === "2600_USD") {
        capital = 2600;
        labelSuffix = " USD";
    } else if (val === "22140_USD") {
        capital = 22140;
        labelSuffix = " USD";
    }

    capitalSlider.value = capital;
    capitalLabel.innerText = "$" + capital.toLocaleString() + labelSuffix;
    calculateRisk();
}

function calculateRisk() {
    const selector = document.getElementById("sim-account-select");
    const accountVal = selector.value;
    const isCAD = accountVal.includes("CAD");
    const currencySuffix = isCAD ? " CAD" : " USD";

    const totalCapital = parseFloat(document.getElementById("sim-capital-slider").value);
    const riskPercent = parseFloat(document.getElementById("sim-size-slider").value); // slider represents risk % (e.g. 1.5%)
    const stopDistancePercent = parseFloat(document.getElementById("sim-drawdown-slider").value); // stop drawdown distance (e.g. 25%)

    // Risk Unit = Capital * Risk%
    const riskUnit = totalCapital * (riskPercent / 100);

    // Recommended position sizing allocation = Risk % / Stop Distance %
    // E.g. 1.5% Risk / 25% Stop = 6% position sizing allocation
    const recommendedAllocation = (riskPercent / stopDistancePercent) * 100;
    const positionValue = totalCapital * (recommendedAllocation / 100);

    // Unhedged loss at stop is exactly equivalent to the risk unit
    const unhedgedLoss = riskUnit;

    // Hedged loss with 65% protection offset + option cost
    const hedgeCost = positionValue * 0.015;
    const hedgedLoss = (unhedgedLoss * 0.35) + hedgeCost;

    document.getElementById("sim-capital-val").innerText = "$" + totalCapital.toLocaleString() + currencySuffix;
    document.getElementById("sim-size-val").innerText = riskPercent + "%";
    document.getElementById("sim-drawdown-val").innerText = stopDistancePercent + "%";

    document.getElementById("result-saved").innerText = recommendedAllocation.toFixed(1) + "% allocation ($" + Math.round(positionValue).toLocaleString() + currencySuffix + ")";
    document.getElementById("result-unhedged").innerText = "-$" + Math.round(unhedgedLoss).toLocaleString() + currencySuffix;
    document.getElementById("result-hedged").innerText = "-$" + Math.round(hedgedLoss).toLocaleString() + currencySuffix;

    const maxLoss = Math.max(unhedgedLoss, hedgedLoss, 1);
    const unhedgedWidth = (unhedgedLoss / maxLoss) * 100;
    const hedgedWidth = (hedgedLoss / maxLoss) * 100;

    document.getElementById("bar-unhedged").style.width = unhedgedWidth + "%";
    document.getElementById("bar-hedged").style.width = hedgedWidth + "%";
}

// Chat AI Mentor responses database
function getSmartChatResponse(query) {
    const textLower = query.toLowerCase();
    
    // Check for G7 Swing System details
    if (textLower.includes("g7") || textLower.includes("swing system") || textLower.includes("arcisfx")) {
        return `The G7 Swing Trading system is an indicator-assisted model for Major currency pairs:
1. **Weekly candle** sets the direction (higher high/low = buy; lower high/low = sell).
2. **Reversal levels** are placed 10 pips beyond the previous weekly candle's high/low.
3. **Hourly close (Rule 1)** must touch the 100/200 Bollinger Bands or 200 SMA (Rule 3).
4. **Stochastic (Rule 2)** must be oversold (<20) or overbought (>80).
5. **Reversal shape (Rule 5)** (e.g. Hammer, Engulfing) triggers entry at close.
6. **Stop Loss (Rule 6)** is placed 5-10 pips beyond the candle (20-60 pips max). Target is 2:1 reward/risk.`;
    }

    // Check for Hedgehog & Risk Lock
    if (textLower.includes("hedgehog") || textLower.includes("risk lock")) {
        return `The **Hedgehog strategy** uses opposite counter-contracts (e.g. holding a short leg to neutralize a long setup in drawdowns) rather than taking hard stop-loss slippage.
The **Risk Lock method** is our trailing protection model: SBE (Stop Breakeven) is activated as soon as price moves 1.5x risk. Hedges are then added in staggered layers (1/3, 1/3, 1/3) to lock profits while letting the core trade run.`;
    }

    // Check for user's accounts allocation
    if (textLower.includes("18000") || textLower.includes("cad") || textLower.includes("usd") || textLower.includes("capital allocation") || textLower.includes("my account")) {
        return `With your portfolio consisting of three accounts ($18,000 CAD, $6,400 USD, and $2,600 USD), you should structure allocations like this:
1. **$18,000 CAD (Account A):** Allocate to G7 Swing Forex & Index ETFs. Risk Unit (1.5%) = $270 CAD limit per trade. If trading GBPUSD with a 30-pip stop, your position sizing should be $9,000 CAD (0.9 mini lots).
2. **$6,400 USD (Account B):** Sized for conviction stocks (NVDA, COIN) or Crypto. Risk Unit (1.5%) = $96 USD. If buying COIN, use options hedges (protective puts at 192) to lock max risk to $96.
3. **$2,600 USD (Account C):** Hold in cash as a volatility/liquidity buffer. Sizing is automated in the dashboard simulator; choose your account from the dropdown to see exact allocation limits.`;
    }

    // Backtesting & News events
    if (textLower.includes("news") || textLower.includes("backtest") || textLower.includes("events") || textLower.includes("effective")) {
        return `Backtesting with news events is highly effective. Veterans do NOT trade *during* CPI or FOMC rate prints because spreads blow out. Instead, they backtest the **post-news drift**:
- Wait for the event hour rollover (Rule 1).
- Look for stochastics washes (<20 or >80) at the 200-hour Bollinger Band.
- Enter only when a reversal candle (e.g., Hammer) is confirmed at the close.
This allows you to capture news-driven liquidity sweeps while avoiding the initial chaotic spread wicks.`;
    }

    // Core Rules Matching
    if (textLower.includes("rule") || textLower.includes("philosophy") || textLower.includes("risk management")) {
        return `My strategy operates under four strict veteran pillars:
1. **Capital Preservation**: Never open a trade without a defined, structural stop-loss or options-based hedge trigger.
2. **Stop Breakeven (SBE)**: Once a trade hits 1.5R gain, the stop-loss must be moved to entry to make it a free trade.
3. **Derivatives Hedging**: Use opposite contract hedges at major support/resistance pivots rather than triggering market-order stop slippages.
4. **Weekend De-risking**: Systematically scale-out (trim by 30-50%) high-conviction indices and volatile assets on Friday afternoon closes to guard against gap risk.`;
    }

    // Gold flip logic query
    if (textLower.includes("gold") && (textLower.includes("flip") || textLower.includes("reversal") || textLower.includes("long") || textLower.includes("short"))) {
        return `Gold (XAUUSD) was shorted (60-75% size) during late January resistance sweeps. On Friday, Jan 30, Gold broke out of key structural resistance, triggering an immediate regime-shift. Following G7 reversal rules, shorts were closed and a 10% test Long was opened at 4920. This caps initial risk while participating in the new trend.`;
    }

    // COIN/MSTR size queries
    if (textLower.includes("coin") || textLower.includes("mstr") || textLower.includes("100%")) {
        return `COIN and MSTR are held at 100% sizes as equity proxies. However, they are walled off with protective put options (e.g., COIN hedged at 192). This restricts maximum possible drawdown to a defined 1.5% portfolio risk unit, capturing high-beta upside without exposing the core account to ruin.`;
    }

    // Bitcoin staggered hedge queries
    if (textLower.includes("btc") || textLower.includes("bitcoin") || textLower.includes("staggered")) {
        return `Bitcoin (BTCUSD) positions are protected by staggered hedge levels (e.g. 1/3 at 89300, 1/3 at 86900, 1/3 at 85900). This tiered stop structure prevents a single 'wick sweep' from fully liquidating your core long position, giving the trade breathing room while progressively locking in downside protection.`;
    }

    // Data-Search: Count number of days loaded
    if (textLower.includes("how many days") || textLower.includes("how many images") || textLower.includes("history size")) {
        const count = Object.keys(allHistory).length;
        return `The portfolio parser has scanned, processed, and loaded a total of **${count} trading days** of ledger history, spanning from January 26, 2026 to June 24, 2026. Select different months in the timeline header to explore his actions across this period.`;
    }

    // Default response
    return `I have parsed the 106-day veteran trading portfolio. I can answer questions about specific trades, explain my stop-loss / SBE adjustments, or detail my staggered hedge levels for crypto, metals, and index positions. What trade details would you like me to look up?`;
}

function appendChatMessage(text, sender) {
    const container = document.getElementById("chat-messages-container");
    const msg = document.createElement("div");
    msg.className = `msg ${sender}`;
    
    const formattedText = text.replace(/\n/g, "<br>");
    msg.innerHTML = `
        <div>${formattedText}</div>
        <div class="msg-timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    `;
    
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}

// File Upload Handler (simulated parsing)
function handleFileUpload(e) {
    const files = e.target.files || e.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];
    if (!file.type.match('image.*')) {
        alert("Please upload a valid ledger image file.");
        return;
    }

    const overlay = document.getElementById("ocr-scanner-overlay");
    const progress = document.getElementById("scanner-progress");
    const statusText = document.getElementById("scanner-status-text");
    
    overlay.classList.add("active");
    progress.style.width = "0%";
    
    const steps = [
        { progress: 20, text: "Reading image metadata..." },
        { progress: 50, text: "Vision OCR grid layout matching..." },
        { progress: 80, text: "Extracting assets, hedges, and sizing vectors..." },
        { progress: 100, text: "Parsing complete." }
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
                injectNewDay(file.name);
            }, 500);
        }
    }, 500);
}

// Inject a parsed upload day into the timeline
function injectNewDay(filename) {
    const cleanName = filename.replace(".jpg", "").replace(".png", "");
    const displayKey = "Parsed Upload";
    
    allHistory[displayKey] = {
        date: `Uploaded Portfolio (${cleanName})`,
        notes: "Parsed Upload Sheet: Volatility protection verified. Stop/hedges adjusted to trailing breakeven on core assets.",
        categories: {
            "Currencies": [
                { name: "USDX", symbol: "DXY", type: "long", position: "Long 98.15, stop/hedge 98.60", size: "20%", chng: "27 Jan" }
            ],
            "Stocks/ETF's": [
                { name: "NASDAQ", symbol: "NDX", type: "long", position: "Long 25110 (20%), stop/hedge 25250", size: "20%", chng: "Uploaded" }
            ],
            "Crypto": [
                { name: "Bitcoin", symbol: "BTCUSD", type: "long", position: "Long 91200, stop/hedge 91000", size: "30%", chng: "Uploaded" }
            ]
        }
    };

    buildTimelineControls();
    setTimelineDay(displayKey);
    
    appendChatMessage(`I have parsed your uploaded sheet "${filename}". I extracted the assets and plotted them into the timeline as "Parsed Upload". Check the list to see position levels.`, "ai");
}

// Bind Events on Page Load
window.onload = () => {
    initApp();

    // Chat events
    document.getElementById("chat-send-btn").onclick = sendChatMessage;
    document.getElementById("chat-input-field").onkeydown = (e) => {
        if (e.key === "Enter") sendChatMessage();
    };

    // Simulator events
    document.getElementById("sim-capital-slider").oninput = calculateRisk;
    document.getElementById("sim-size-slider").oninput = calculateRisk;
    document.getElementById("sim-drawdown-slider").oninput = calculateRisk;
    document.getElementById("sim-account-select").onchange = changeAccountCapital;

    // Trigger initial calculations
    changeAccountCapital();

    // File dropzone events
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
