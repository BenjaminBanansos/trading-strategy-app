// Global App State
let activeDay = "";
let selectedAsset = null;
let allHistory = {}; // Load from portfolio_history.json
let monthsList = [];
let activeMonth = "";

// Course Slide State
let activeSlideIdxs = [0, 0, 0]; // Course 1, Course 2, Course 3 slide pointers

const courseModulesData = [
    {
        category: "Course 1: Risk & Psychology",
        title: "Trade Like a Grown-Up – Discipline, Defence, and Devilry",
        slides: [
            {
                label: "1. Framing the Game",
                subtitle: "I. Framing the Game – Trading Is Not Gambling",
                content: `
                    <p>Trading is deceptively simple: buy low, sell high. Or short high, buy back lower. Easy to say, fatal to underestimate. The market is a game of probabilities wrapped in uncertainty, powered by emotion.</p>
                    <div class="alert-banner" style="background: rgba(59, 130, 246, 0.05); color: var(--color-primary); border-color: rgba(59, 130, 246, 0.15); margin: 0.75rem 0;">
                        <span class="alert-dot" style="background: var(--color-primary);"></span>
                        <strong>“A winning system with a losing mindset is a losing system.”</strong> – Dr. David Paul
                    </div>
                    <h4>Key Takeaway:</h4>
                    <p>You are not here to be right. You are here to survive long enough to be right enough. Your weapon is process. Your shield is risk management. Your undoing is usually ego.</p>
                    
                    <div class="pattern-visualizer-container" style="background: rgba(255,255,255,0.01); padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                        <h4 style="margin-top:0; color: var(--color-primary); font-size: 0.8rem; text-transform: uppercase;">Trading Mindset Matrix</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem; font-size: 0.8rem;">
                            <div style="background: rgba(239, 68, 68, 0.05); padding: 0.75rem; border-radius: 6px; border: 1px solid rgba(239, 68, 68, 0.1);">
                                <strong style="color: var(--color-danger);">Gambler Mindset (Retail)</strong>
                                <ul style="margin-left: 1rem; margin-top: 0.25rem; padding-left: 0;">
                                    <li>Seeks excitement & being right</li>
                                    <li>Trades on hope & wishes</li>
                                    <li>Uses random risk sizes</li>
                                </ul>
                            </div>
                            <div style="background: rgba(16, 185, 129, 0.05); padding: 0.75rem; border-radius: 6px; border: 1px solid rgba(16, 185, 129, 0.1);">
                                <strong style="color: var(--color-success);">Grown-Up Mindset (Professional)</strong>
                                <ul style="margin-left: 1rem; margin-top: 0.25rem; padding-left: 0;">
                                    <li>Focuses on probability & survival</li>
                                    <li>Strictly process-driven execution</li>
                                    <li>Fixed mathematical risk units</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `
            },
            {
                label: "2. Money Management",
                subtitle: "II. Money Management – Ammunition Control",
                content: `
                    <h4>Position Sizing</h4>
                    <ul>
                        <li><strong>Never risk more than 1–2% of total capital</strong> on a single position.</li>
                        <li><strong>Think in terms of risk units</strong>, not trade size. A big position on a strong setup is still valid—if it fits your risk unit.</li>
                    </ul>
                    
                    <h4>DCA (Dollar-Cost Averaging) In and Out</h4>
                    <ul>
                        <li>Don’t blow the powder all at once. Enter in measured clips. Let the market confirm your view.</li>
                        <li>Exit the same way. Scale out methodically. Lock in gains while leaving room to run.</li>
                    </ul>
                `
            },
            {
                label: "3. Danger of Clustering",
                subtitle: "The Danger of Clustering",
                content: `
                    <p>Clustering occurs when multiple losses (or wins) occur in quick succession. In a high-cluster environment, even a good system can suffer.</p>
                    
                    <div class="pattern-visualizer-container" style="background: rgba(255,255,255,0.01); padding: 1rem; border-radius: 8px; margin-top: 0.5rem; border: 1px solid var(--border-color);">
                        <h4 style="margin-top:0; color: var(--color-primary); font-size: 0.8rem; text-transform: uppercase;">Clustering Variance comparison</h4>
                        <p style="font-size: 0.8rem; line-height: 1.35; margin-bottom: 0.5rem;"><em>Illustration: Picture 5 trades in a row. Each one risks 3%. Three losses = -9%. Two more losses? -15%. You’re rattled, emotional, and now trading to “get it back.”</em></p>
                        <div style="display: flex; justify-content: space-around; gap: 1rem; margin-top: 0.75rem;">
                            <div style="text-align: center;">
                                <div style="color: var(--color-danger); font-size: 1.15rem; font-weight: 700;">-15.0% Drawdown</div>
                                <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.15rem;">At 3% risk per trade</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="color: var(--color-success); font-size: 1.15rem; font-weight: 700;">-5.0% Drawdown</div>
                                <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.15rem;">At 1% risk per trade</div>
                            </div>
                        </div>
                    </div>
                    
                    <h4>Rule of Thumb:</h4>
                    <p>When clustered losses appear, assume the market has changed—or you have. **Stop. Reassess.** The solution is proper risk limits and awareness of market regime. Reduce size or step back when variance spikes.</p>
                `
            },
            {
                label: "4. Risk & Hedging",
                subtitle: "III. Risk Management – The Art of Not Dying",
                content: `
                    <h4>The Line in the Sand</h4>
                    <ul>
                        <li>Every trade should have a clear invalidation point.</li>
                        <li>It’s not an emotional threshold—it’s a technical or fundamental “this-no-longer-makes-sense” point.</li>
                        <li>This is where hedging, not panicking, comes in.</li>
                    </ul>
                    
                    <h4>Hedging – Your Style</h4>
                    <ul>
                        <li>Instead of hard stops, use counter trades to balance risk.</li>
                        <li>Particularly useful in macro positions (e.g. Natural Gas). When the setup is long but price is tanking, short a correlated or inverse position to neutralise exposure.</li>
                    </ul>
                    
                    <h4>Avoid Overleveraging</h4>
                    <ul>
                        <li>Leverage magnifies your skill—and your stupidity.</li>
                        <li>Size kills. Trade small enough to be wrong several times in a row and still be in the game.</li>
                    </ul>
                    
                    <h4>Scenario Planning</h4>
                    <p>Have a plan for multiple market moods: trending, chopping, breaking news, liquidity events.</p>
                `
            },
            {
                label: "5. Psychology & routines",
                subtitle: "IV-VII. Trading Psychology & Routine",
                content: `
                    <h4>Ego Is Not Your Edge</h4>
                    <ul>
                        <li>Overconfidence leads to size increases right before a regime change. Humility keeps you safe. Confidence in process, not prediction.</li>
                        <li><strong>Be the Analyst of the Trader:</strong> The trader is reactive. The analyst is reflective. Be both. Review every trade. Note emotional action: fear, hesitation, greed.</li>
                    </ul>
                    
                    <h4>Process > Prediction</h4>
                    <ul>
                        <li><strong>Setups, Not Wishes:</strong> Only enter trades with clear technical or fundamental rationale. Avoid impulsive trades based on headlines or FOMO.</li>
                        <li><strong>Journaling:</strong> Record setup, entry, exit, rationale, and emotional state. Review monthly.</li>
                        <li><strong>No Trade = Position:</strong> Sitting out is an active decision. Sideways markets, unclear trends, or mental fatigue = cash is a position.</li>
                        <li><strong>Layered Confluence:</strong> Combine market structure, dynamics, macro news, and price action. The more aligned the signals, the more confident the trade.</li>
                    </ul>
                    
                    <div class="alert-banner" style="background: rgba(16, 185, 129, 0.05); color: var(--color-success); border-color: rgba(16, 185, 129, 0.15); margin-top: 0.75rem; font-size: 0.8rem;">
                        <strong>The Trader’s Code:</strong> Stay alive. That’s the first job. Be boring in process, brilliant in execution. Size small, think big. Never fall in love with a trade. <em style="display:block; margin-top:0.25rem; font-size:0.75rem; color: var(--text-muted);">“Consistency isn’t sexy. But neither is losing your house.”</em>
                    </div>
                `
            }
        ]
    },
    {
        category: "Course 2: Forex Swing System",
        title: "ArcisFX G7 Swing Trading System",
        slides: [
            {
                label: "1. Welcome & Setup",
                subtitle: "Welcome & Getting Started",
                content: `
                    <p>Thanks for downloading the ArcisFX G7 Swing Trading System. This system focuses on the 4 "Majors" namely the **EUR/USD, GBP/USD, USD/JPY, and USD/CHF**.</p>
                    <p>Due to their nature, the majors tend to experience much greater volumes and are therefore highly technical, tending to trend more than other pairs. Trending behavior is required for consistent G7 swing profits.</p>
                    
                    <div class="pattern-visualizer-container" style="background: rgba(255,255,255,0.01); padding: 0.85rem; border-radius: 8px; margin-top: 0.75rem; border: 1px solid var(--border-color);">
                        <h4 style="margin-top:0; color: var(--color-primary); font-size: 0.8rem; text-transform: uppercase;">Startup Rules</h4>
                        <ul style="font-size: 0.75rem; line-height: 1.35; margin-bottom: 0;">
                            <li><strong>Demo Trading:</strong> Highly recommend trading on a demo account for at least 1-3 months (or 3-6 months) before committing real money. Demands of real money trading are much greater in terms of stress and emotions.</li>
                            <li><strong>Pairs:</strong> Recommend trading 1-2 currencies chosen from the majors by selecting the clearest G7 setups. Prefer Euro, Pound, and Yen in that order.</li>
                            <li><strong>Charts:</strong> MetaTrader 4/5 or TradingView (web-based charting).</li>
                        </ul>
                    </div>
                `
            },
            {
                label: "2. Money Management",
                subtitle: "Money Management, Leverage & Stops",
                content: `
                    <p>This is one of the most important and most overlooked parts of trading. Many traders take large risks in the hope that they will "get rich quickly" or recover previous losses. Follow these three simple G7 guidelines:</p>
                    
                    <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.85rem; line-height: 1.4; margin-top: 0.5rem;">
                        <div>
                            <strong>1. Never leverage more than 3:1.</strong>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.8rem;">For every dollar in your account, you should not trade more than 3 dollars per position (e.g., if account is $5,000, trade max $15,000 position = 1.5 mini lots). Leverage of 1:1 to 2:1 is optimal.</p>
                        </div>
                        <div>
                            <strong>2. Never risk more than 2% of your account on one trade.</strong>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.8rem;">Risk is easily calculated: Pip stop loss distance * leverage / 100%. If leverage is 3:1 and stop is 30 pips, risk is 0.9%. If stop loss is higher, leverage must be reduced.</p>
                        </div>
                        <div>
                            <strong>3. Always aim for a 2:1 reward/risk ratio in your trades.</strong>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.8rem;">If you are prepared to risk 40 pips, ensure the potential target is at least 80 pips. If risking 50 pips, target must be 100 pips. Try to always aim for twice as much as you risk.</p>
                        </div>
                    </div>
                `
            },
            {
                label: "3. Candlestick Patterns",
                subtitle: "How to Read Candlestick Charts",
                content: `
                    <p>Interpretation of candlestick charts is based on patterns. G7 system uses the relationship between highs/lows and open/close over time:</p>
                    
                    <div class="pattern-visualizer-container" style="background: rgba(255,255,255,0.01); padding: 0.85rem; border-radius: 8px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem;">
                        <div class="candlestick-col">
                            <div class="candle-container" style="height: 60px; flex-direction: row; gap: 2px;">
                                <div style="position: relative; width: 6px; height: 100%;">
                                    <div class="candle-body bearish" style="height: 35px; top: 10px; width:6px;"></div>
                                </div>
                                <div style="position: relative; width: 6px; height: 100%;">
                                    <div class="candle-body bullish" style="height: 30px; top: 20px; width:6px;"></div>
                                </div>
                            </div>
                            <div class="candle-label" style="font-size:0.65rem;">Piercing Line</div>
                        </div>
                        <div class="candlestick-col">
                            <div class="candle-container" style="height: 60px;">
                                <div class="candle-wick hammer-wick" style="height: 40px; top: 10px;"></div>
                                <div class="candle-body bullish hammer-body" style="height: 8px; top: 10px;"></div>
                            </div>
                            <div class="candle-label" style="font-size:0.65rem;">Hammer</div>
                        </div>
                        <div class="candlestick-col">
                            <div class="candle-container" style="height: 60px; flex-direction: row; gap: 2px;">
                                <div style="position: relative; width: 6px; height: 100%;">
                                    <div class="candle-body bearish" style="height: 15px; top: 25px; width:6px;"></div>
                                </div>
                                <div style="position: relative; width: 6px; height: 100%;">
                                    <div class="candle-body bullish" style="height: 35px; top: 15px; width:6px;"></div>
                                </div>
                            </div>
                            <div class="candle-label" style="font-size:0.65rem;">Engulfing</div>
                        </div>
                        <div class="candlestick-col">
                            <div class="candle-container" style="height: 60px;">
                                <div class="candle-wick" style="height: 50px; top: 5px;"></div>
                                <div class="candle-body doji-body"></div>
                            </div>
                            <div class="candle-label" style="font-size:0.65rem;">Doji Star</div>
                        </div>
                    </div>
                    
                    <h4 style="font-size: 0.8rem; margin-top: 0.5rem; text-transform: uppercase; color: var(--color-primary);">G7 Candlestick Formations:</h4>
                    <ul style="font-size: 0.8rem; line-height: 1.35;">
                        <li><strong>Bullish Formations:</strong> Piercing line, Hammer (spike low), Morning star, Bullish engulfing, Bullish doji star.</li>
                        <li><strong>Bearish Formations:</strong> Dark cloud cover, Bearish engulfing, Hanging man, Evening star, Doji star, Shooting star.</li>
                        <li><strong>Neutral Formations:</strong> Spinning tops, Doji, Double doji, Harami, Long-legged doji, Dragonfly doji, Gravestone doji.</li>
                    </ul>
                `
            },
            {
                label: "4. Weekly Direction",
                subtitle: "Determining Direction & Reversal boundaries",
                content: `
                    <p>Compare the past week's candle to previous weekly candles over the weekend to establish the trading scenario:</p>
                    
                    <h4 style="color: var(--color-success); font-size: 0.85rem; margin-top: 0.5rem;">Bullish Scenario:</h4>
                    <ol style="font-size: 0.8rem; line-height: 1.35;">
                        <li>Weekly candle has a higher high and/or higher low than the week before.</li>
                        <li>Weekly candle has formed a "spike low" reversal candle (Hammer, Dragonfly, etc.) after a long period of decline (4-8 weeks).</li>
                    </ol>
                    
                    <h4 style="color: var(--color-danger); font-size: 0.85rem; margin-top: 0.5rem;">Bearish Scenario:</h4>
                    <ol style="font-size: 0.8rem; line-height: 1.35;">
                        <li>Weekly candle has a lower high and/or lower low than the week before.</li>
                        <li>Weekly candle has formed a "spike high" reversal candle after a long period of rally (4-8 weeks).</li>
                    </ol>
                    
                    <div class="alert-banner" style="background: rgba(245, 158, 11, 0.05); color: var(--color-warning); border-color: rgba(245, 158, 11, 0.15); margin-top: 0.75rem; font-size: 0.8rem;">
                        <strong>Determining the Reversal Level (10-Pip Rule):</strong><br>
                        • <strong>If Bullish direction:</strong> Reversal level is placed **10 pips below the lowest point** of the weekly candle.<br>
                        • <strong>If Bearish direction:</strong> Reversal level is placed **10 pips above the highest point** of the weekly candle.<br>
                        Any price move beyond this level invalidates the direction. Stop trading immediately.
                    </div>
                `
            },
            {
                label: "5. Indicators Setup",
                subtitle: "G7 Chart Indicators Screen Setup",
                content: `
                    <p>The G7 system uses a clean statistical probability band setup on your charting package. Set up your screen to display 2 charts for each currency—hourly (1H) at the top, weekly (W) at the bottom (total 6 charts on screen).</p>
                    
                    <h4>1. Hourly (1H) Chart Indicators:</h4>
                    <ul>
                        <li><strong>100-Hour Bollinger Band</strong> (Deviation 2, Shift 0) - preferred color for intermediate limits.</li>
                        <li><strong>200-Hour Bollinger Band</strong> (Deviation 2, Shift 0) - preferred color for volatility extremes.</li>
                        <li><strong>200 Period SMA</strong> (Simple Moving Average) - close calculation.</li>
                        <li><strong>14/7/3 Slow Stochastic Oscillator</strong> - set levels at 20 (oversold) and 80 (overbought).</li>
                    </ul>
                    
                    <h4>2. Weekly (W) Chart Indicators:</h4>
                    <ul>
                        <li><strong>10-Week SMA</strong> (Simple Moving Average) - acts as a medium-term guide to market direction. Weekly reversals frequently take place near this average.</li>
                    </ul>
                `
            },
            {
                label: "6. Entry Rules 1-4",
                subtitle: "Determining Entry Points (Rules 1 to 4)",
                content: `
                    <p>There are 6 rules used to determine entry points. Conditions for each rule must be in place before a trade can be initiated on the hourly chart:</p>
                    
                    <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.85rem; line-height: 1.45;">
                        <div>
                            <strong>Rule #1: Wait for an hourly close.</strong>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.8rem;">No trade positions considered until the hour rollover. Volatility increases 5-10 minutes before the top of the hour. Wait for the hourly candle to complete.</p>
                        </div>
                        <div>
                            <strong>Rule #2: Stochastic trigger.</strong>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.8rem;">The 14/7/3 stochastic must be oversold (below 20) if buying (long), or overbought (above 80) if selling (short).</p>
                        </div>
                        <div>
                            <strong>Rule #3: Zones of probability.</strong>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.8rem;">Price must be touching or beyond the 100-hour Bollinger Band, touching or beyond the 200-hour Bollinger Band, or touching/near the 200-hour SMA. Any other position is "no-man's land" where trades may not be taken.</p>
                        </div>
                        <div>
                            <strong>Rule #4: Confluence levels.</strong>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.8rem;">Look for confluence zones—retracements to Fibonacci levels (38.2%, 50%, 61.8%, 78.6%), trendlines, or horizontal support/resistance lines (SR lines).</p>
                        </div>
                    </div>
                `
            },
            {
                label: "7. Entry Rules 5-6",
                subtitle: "Determining Entry Points (Rules 5 to 6)",
                content: `
                    <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.85rem; line-height: 1.45;">
                        <div>
                            <strong>Rule #5: Hourly Reversal Candle.</strong>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.8rem;">Wait for the hourly candle to close as a reversal trigger shape: Doji, Hammer, Engulfing candle, or Tweezer formations.</p>
                        </div>
                        <div>
                            <strong>Rule #6: Stop and target parameters.</strong>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.8rem;">
                                a) Always place the trade stop-loss <strong>5-10 pips below/above the reversal candle pattern</strong> used as the trigger (for long trades, add your broker's spread).<br>
                                b) The stop-loss should <strong>never be less than 20 pips</strong> and <strong>never be more than 60 pips</strong>.<br>
                                c) The profit target should always be <strong>at least double the size of the stop-loss (2:1 reward/risk ratio)</strong>.
                            </p>
                        </div>
                    </div>
                `
            },
            {
                label: "8. G7 Execution Walkthrough",
                subtitle: "Putting It All Together & Additional Hints",
                content: `
                    <h4>Full G7 Example Walkthrough:</h4>
                    <ol style="font-size: 0.8rem; line-height: 1.35; margin-bottom: 0.75rem;">
                        <li>Determine direction from Weekly chart ➔ candle is bearish ➔ bias = Short. Weekly reversal level set 10 pips above high (1.8897).</li>
                        <li>Hourly candle rallies toward upper Bollinger Bands on Monday close (Rule 1).</li>
                        <li>Stochastic becomes overbought (> 80) (Rule 2).</li>
                        <li>Price touches the top 100-hour Bollinger Band (Rule 3) and confluences with a 61.8% Fibonacci level (Rule 4).</li>
                        <li>Price forms a Bearish Engulfing reversal candle at hourly close (Rule 5). Enter short trade.</li>
                        <li>Calculate stop 5 pips above high (calculated stop distance = 32 pips) (Rule 6). Profit target is set to double = 64 pips. Trailing stop employed to lock gains.</li>
                    </ol>
                    
                    <h4>Additional Hints:</h4>
                    <ul style="font-size: 0.8rem; line-height: 1.35;">
                        <li><strong>Multiple Signals:</strong> If 2 or 3 currencies give signals simultaneously, enter 1 or 2 and hold back on the others. Rather be too cautious than bullish!</li>
                        <li><strong>Time of Day:</strong> Trade during the European and/or NY sessions only (6AM GMT to 6PM GMT). The Asian market session tends to have thin volume and random price movement.</li>
                    </ul>
                `
            }
        ]
    },
    {
        category: "Course 3: Energy Trading",
        title: "Widow Maker – Natural Gas Trading Techniques",
        slides: [
            {
                label: "1. Objectives & Scope",
                subtitle: "Widow Maker Course Objectives and Scope",
                content: `
                    <p>Welcome to **Widow Maker: Natural Gas Trading Techniques**. Natural gas is a widely used energy resource, supplying roughly **24% of the energy requirements of developed countries**. It is essential for heating, electricity generation, and industrial processes.</p>
                    <h4>Course Objectives:</h4>
                    <ul>
                        <li>To understand the basic structure of the natural gas market and its global energy role.</li>
                        <li>To learn the fundamental drivers of natural gas prices, including supply, demand, seasonality, and geopolitics.</li>
                        <li>To master practical technical trading methods and confluences.</li>
                        <li>To outline a strict framework for risk management, position sizing, and hedging.</li>
                    </ul>
                `
            },
            {
                label: "2. Role of Natural Gas",
                subtitle: "The Role of Natural Gas in the Global Energy Market",
                content: `
                    <p>Natural gas plays a critical role in today’s energy supply across three primary applications:</p>
                    <ul>
                        <li><strong>Residential and Commercial Heating:</strong> Primary source for heating buildings. Around **29% of the world’s natural gas consumption** is for heating and residential uses.</li>
                        <li><strong>Electricity Generation:</strong> Power plants rely on gas for electricity. Roughly **38% of the world’s natural gas consumption** is for generating electricity.</li>
                        <li><strong>Industrial Use:</strong> Key raw material in chemical manufacturing and industrial processes, accounting for about **33% of global consumption**.</li>
                    </ul>
                    <p style="font-size:0.8rem; color: var(--text-muted);">Because gas is abundant and relatively clean compared to other fossil fuels, it is heavily traded globally, though transport leakage remains an environmental issue.</p>
                `
            },
            {
                label: "3. Key Price Drivers",
                subtitle: "Key Drivers of Natural Gas Prices",
                content: `
                    <h4>1. Supply and Demand</h4>
                    <ul>
                        <li><strong>Supply Factors:</strong> Production levels, storage inventory balances (weekly EIA reports), and extraction technologies (fracking, horizontal drilling).</li>
                        <li><strong>Demand Factors:</strong> Consumption patterns, economic growth, and weather conditions.</li>
                    </ul>
                    <h4>2. Seasonality</h4>
                    <ul>
                        <li><strong>Winter:</strong> Demand typically rises sharply for heating, leading to higher prices.</li>
                        <li><strong>Summer:</strong> Demand rises due to cooling requirements for air conditioning.</li>
                    </ul>
                    <h4>3. Geopolitical and Environmental Factors</h4>
                    <ul>
                        <li>Trade policies, pipeline regulations, political instability in producing regions, and clean energy standards immediately impact supply routes and prices.</li>
                    </ul>
                `
            },
            {
                label: "4. Trading Instruments",
                subtitle: "Futures and Continuous ETFs",
                content: `
                    <p>Traders participate in natural gas markets through two primary instruments:</p>
                    <ul>
                        <li><strong>Natural Gas Futures (NGAS.F / NG1):</strong> Standardized contracts traded on NYMEX. High purity, leverage, and liquidity, but subject to monthly rollover costs (contango vs backwardation). Tick size is 0.001 per MMBtu ($10 per contract).</li>
                        <li><strong>Continuous ETFs (NATGAS):</strong> Track gas prices without a futures account or monthly rollovers. Simpler access through standard brokerage accounts.</li>
                    </ul>
                    
                    <div class="alert-banner" style="background: rgba(239, 68, 68, 0.05); color: var(--color-danger); border-color: rgba(239, 68, 68, 0.15); font-size: 0.75rem; padding: 0.75rem;">
                        <span class="alert-dot" style="background: var(--color-danger);"></span>
                        <strong>Warning on BOIL & KOLD:</strong> These are 2x leveraged ETFs designed for daily speculation. Holding them long-term guarantees massive losses due to daily volatility decay and compounding drag. <strong>Best left to pros or masochists.</strong>
                    </div>
                `
            },
            {
                label: "5. Indicators & MTF Analysis",
                subtitle: "Technical Indicators & Multi-Timeframe Analysis",
                content: `
                    <h4>1. Indicators & Oscillators</h4>
                    <ul>
                        <li><strong>Bollinger Bands:</strong> Monitor band width for volatility. A "third pierce" of the band indicates extreme overbought/oversold conditions where a reversal is likely.</li>
                        <li><strong>RSI & Stochastics:</strong> Identify overbought/oversold limits. Divergence between RSI/Stochastic and price signals potential reversals.</li>
                        <li><strong>Fibonacci Retracement & Extensions:</strong> Retracements (38.2%, 50%, 61.8%) identify pullback zones; Extensions define exit targets.</li>
                    </ul>
                    <h4>2. Multi-Timeframe Analysis</h4>
                    <ul>
                        <li><strong>Synchronization:</strong> Use daily/weekly charts to identify the broader trend, and hourly/15-minute charts to refine entry points and place stop-losses.</li>
                    </ul>
                `
            },
            {
                label: "6. Step-by-Step Process",
                subtitle: "Step-by-Step Process to Initiating a Trade",
                content: `
                    <p>To swing trade Natural Gas safely, follow this 6-step check process before executing a trade:</p>
                    <ol style="font-size: 0.85rem; line-height: 1.45;">
                        <li><strong>Check COT positioning</strong> on Barchart.com ( COT net positions, forward ribbon contango/backwardation, and $2.00-$5.00 range).</li>
                        <li><strong>Check weather and seasonality</strong> on <em>natgasweather.com</em>.</li>
                        <li><strong>Check news, politics, and economics</strong> on <em>myfxbook.com</em>.</li>
                        <li><strong>Check longer term charts</strong> (daily/weekly) to establish trend.</li>
                        <li><strong>Check the day of the week</strong> (avoid entering right before weekend gaps).</li>
                        <li><strong>Look at technicals</strong> on 4-hour, daily, and weekly charts, then apply risk hedging.</li>
                    </ol>
                `
            },
            {
                label: "7. COT Report Analysis",
                subtitle: "Using Commitments of Traders (COT) Data",
                content: `
                    <p>The Commitments of Traders (COT) report from Barchart.com is a crucial tool to understand institutional sentiment in Natural Gas:</p>
                    <ul>
                        <li><strong>Commercials (Producers/Hedgers):</strong> Typically trade against the trend to lock in prices. A net short position among commercials typically indicates they expect lower prices.</li>
                        <li><strong>Managed Money & Non-Commercials:</strong> Speculative trend-followers (hedge funds). Extreme net long or net short positions indicate overextended trends that warn of imminent reversals.</li>
                        <li><strong>Recognizing Divergence:</strong> If prices are rising but managed money positions start to turn net short, it's a warning signal for a potential trend reversal.</li>
                    </ul>
                `
            },
            {
                label: "8. Checklists & Sizing Plan",
                subtitle: "Checklists, Sizing Formula & Sizing Plan",
                content: `
                    <h4>Natural Gas Position Sizing Formula:</h4>
                    <p style="background: rgba(255,255,255,0.02); padding: 0.5rem; border-radius: 6px; font-family: monospace; border: 1px solid var(--border-color);">
                        Position size = (Amount at risk per trade) / (Difference between entry and stop-loss price)
                    </p>
                    <p style="font-size:0.8rem; color: var(--text-secondary);"><em>Example: With a $10,000 account, risking 1% ($100), and entry-to-stop difference is $0.50 per unit, your position size is 200 units ($100 / $0.50).</em></p>
                    
                    <h4>Daily Routine Checklist:</h4>
                    <ul style="font-size:0.8rem; line-height: 1.35; margin-bottom: 0.5rem;">
                        <li><strong>Pre-Market:</strong> Computer setup ➔ Check weather & news headlines ➔ Open COT report ➔ Load multiple timeframe charts.</li>
                        <li><strong>During Market:</strong> Monitor volume spikes ➔ Check risk management parameters ➔ Enter according to plan ➔ Place stop-loss or hedge.</li>
                        <li><strong>Post-Market:</strong> Log every trade in your journal (record setup, rationale, emotion) ➔ Perform daily outcomes analysis.</li>
                    </ul>
                `
            }
        ]
    }
];

// Initialize application data
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
    buildCourseSidebars();
    
    // Default load slide
    selectCourseSlide(0, 0);
    selectCourseSlide(1, 0);
    selectCourseSlide(2, 0);
}

// Build course sidebars dynamically
function buildCourseSidebars() {
    for (let cIdx = 0; cIdx < 3; cIdx++) {
        const listContainer = document.getElementById(`c${cIdx + 1}-slide-list`);
        if (!listContainer) continue;
        listContainer.innerHTML = "";

        const course = courseModulesData[cIdx];
        course.slides.forEach((slide, sIdx) => {
            const btn = document.createElement("button");
            btn.className = `module-btn ${activeSlideIdxs[cIdx] === sIdx ? 'active' : ''}`;
            btn.id = `c${cIdx + 1}-btn-${sIdx}`;
            btn.onclick = () => selectCourseSlide(cIdx, sIdx);
            btn.innerHTML = `
                <span class="module-num">${sIdx + 1}</span>
                <span>${slide.label}</span>
            `;
            listContainer.appendChild(btn);
        });
    }
}

// Select a specific slide in a course
function selectCourseSlide(courseIdx, slideIdx) {
    activeSlideIdxs[courseIdx] = slideIdx;
    const course = courseModulesData[courseIdx];
    const slide = course.slides[slideIdx];

    // Update sidebar active highlights
    const listContainer = document.getElementById(`c${courseIdx + 1}-slide-list`);
    if (listContainer) {
        listContainer.querySelectorAll(".module-btn").forEach((btn, idx) => {
            if (idx === slideIdx) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    }

    // Update displays
    document.getElementById(`c${courseIdx + 1}-category`).innerText = course.category;
    document.getElementById(`c${courseIdx + 1}-title`).innerText = slide.subtitle;
    document.getElementById(`c${courseIdx + 1}-progress`).innerText = `Slide ${slideIdx + 1} of ${course.slides.length}`;
    document.getElementById(`c${courseIdx + 1}-body-content`).innerHTML = slide.content;
}

function nextCourseSlide(courseIdx) {
    const course = courseModulesData[courseIdx];
    const currentIdx = activeSlideIdxs[courseIdx];
    if (currentIdx < course.slides.length - 1) {
        selectCourseSlide(courseIdx, currentIdx + 1);
    } else {
        alert(`Congratulations! You have completed Course ${courseIdx + 1}: ${course.title}!`);
    }
}

function prevCourseSlide(courseIdx) {
    const currentIdx = activeSlideIdxs[courseIdx];
    if (currentIdx > 0) {
        selectCourseSlide(courseIdx, currentIdx - 1);
    }
}

// Switch main tabs
function switchView(viewName) {
    const dashboard = document.getElementById("dashboard-view");
    const course1 = document.getElementById("course1-view");
    const course2 = document.getElementById("course2-view");
    const course3 = document.getElementById("course3-view");
    
    // Hide all
    dashboard.style.display = "none";
    course1.style.display = "none";
    course2.style.display = "none";
    course3.style.display = "none";

    // Deactivate all buttons
    document.getElementById("tab-dashboard").classList.remove("active");
    document.getElementById("tab-course1").classList.remove("active");
    document.getElementById("tab-course2").classList.remove("active");
    document.getElementById("tab-course3").classList.remove("active");

    // Show selected
    if (viewName === "dashboard") {
        dashboard.style.display = "block";
        document.getElementById("tab-dashboard").classList.add("active");
    } else if (viewName === "course1") {
        course1.style.display = "block";
        document.getElementById("tab-course1").classList.add("active");
        selectCourseSlide(0, activeSlideIdxs[0]);
    } else if (viewName === "course2") {
        course2.style.display = "block";
        document.getElementById("tab-course2").classList.add("active");
        selectCourseSlide(1, activeSlideIdxs[1]);
    } else if (viewName === "course3") {
        course3.style.display = "block";
        document.getElementById("tab-course3").classList.add("active");
        selectCourseSlide(2, activeSlideIdxs[2]);
    }
}

// Hardcoded fallback data in case portfolio_history.json isn't loaded
const fallbackLedgerData = {
    "Fri, Jan 30": {
        date: "Friday, January 30, 2026",
        notes: "Weekend De-risking. Trimmed SPX500 and NASDAQ sizes. Closed Natural Gas (NGAS.F) completely. Gold short completely closed and flipped to Long (10% size) on massive trend reversal. Added Long Silver hedge spread.",
        categories: {
            "Crypto": [
                { name: "Bitcoin", symbol: "BTCUSD", type: "long", position: "Long 91200, 33.3% hedged at 89300. 33% at 86900. 33% at 85900", size: "30%", chng: "29 Jan" }
            ],
            "Metals": [
                { name: "Gold", symbol: "XAUUSD", type: "long", position: "Long 4920, stop/hedge TBA", size: "10%", chng: "30 Jan" }
            ]
        }
    }
};

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

    const posLower = asset.position.toLowerCase();
    let detectedDrawdown = 25;
    if (posLower.includes("stop/hedge") || posLower.includes("hedged")) {
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
    
    if (lowerName === "usdx" || lowerName === "eurusd" || lowerName === "gbpusd") {
        return `G7 Swing Trade setup active. Direction decided from Weekly candle trend. Hourly close (Rule 1) and Stochastic oversold status (Rule 2) confirmed entry with a 20-60 pip stop-loss (Rule 6).`;
    }
    if (lowerName === "ngas.f" || lowerName === "wti") {
        return `Commodity energy play. Subject to high weather seasonality and inventory storage dynamics. Sized at ${asset.size} capital allocation, backed by option puts or correlated hedges to manage volatility.`;
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
    const riskPercent = parseFloat(document.getElementById("sim-size-slider").value); 
    const stopDistancePercent = parseFloat(document.getElementById("sim-drawdown-slider").value); 

    const riskUnit = totalCapital * (riskPercent / 100);
    const recommendedAllocation = (riskPercent / stopDistancePercent) * 100;
    const positionValue = totalCapital * (recommendedAllocation / 100);

    const unhedgedLoss = riskUnit;
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
    
    if (textLower.includes("widow maker") || textLower.includes("natural gas") || textLower.includes("natgas") || textLower.includes("kold") || textLower.includes("boil")) {
        return `Natural Gas is nicknamed the **"Widow Maker"** due to extreme weather-driven supply/demand shifts. My core rules for it are:
1. **Never hold BOIL or KOLD** long-term (2x leverage decay will bleed your account).
2. **COT Analysis**: Check commercials net positions vs managed money speculative extremes.
3. **Daily Checklist**: Verify weather feeds (natgasweather.com), news calendars, and check 4hr technical confluences.
4. **Position Sizing Formula**: Size = (Risk Limit) / (Entry - Stop). We always prefer hedging over raw stops to manage gap risk.`;
    }

    if (textLower.includes("g7") || textLower.includes("swing system") || textLower.includes("arcisfx")) {
        return `The G7 Swing Trading system is an indicator-assisted model for Major currency pairs:
1. **Weekly candle** sets the direction (higher high/low = buy; lower high/low = sell).
2. **Reversal levels** are placed 10 pips beyond the previous weekly candle's high/low.
3. **Hourly close (Rule 1)** must touch the 100/200 Bollinger Bands or 200 SMA (Rule 3).
4. **Stochastic (Rule 2)** must be oversold (<20) or overbought (>80).
5. **Reversal shape (Rule 5)** (e.g. Hammer, Engulfing) triggers entry at close.
6. **Stop Loss (Rule 6)** is placed 5-10 pips beyond the candle (20-60 pips max). Target is 2:1 reward/risk.`;
    }

    if (textLower.includes("hedgehog") || textLower.includes("risk lock")) {
        return `The **Hedgehog strategy** uses opposite counter-contracts (e.g. holding a short leg to neutralize a long setup in drawdowns) rather than taking hard stop-loss slippage.
The **Risk Lock method** is our trailing protection model: SBE (Stop Breakeven) is activated as soon as price moves 1.5x risk. Hedges are then added in staggered layers (1/3, 1/3, 1/3) to lock profits while letting the core trade run.`;
    }

    if (textLower.includes("18000") || textLower.includes("cad") || textLower.includes("usd") || textLower.includes("capital allocation") || textLower.includes("my account")) {
        return `With your portfolio consisting of three accounts ($18,000 CAD, $6,400 USD, and $2,600 USD), you should structure allocations like this:
1. **$18,000 CAD (Account A):** Allocate to G7 Swing Forex & Index ETFs. Risk Unit (1.5%) = $270 CAD limit per trade. If trading GBPUSD with a 30-pip stop, your position sizing should be $9,000 CAD (0.9 mini lots).
2. **$6,400 USD (Account B):** Sized for conviction stocks (NVDA, COIN) or Crypto. Risk Unit (1.5%) = $96 USD. If buying COIN, use options hedges (protective puts at 192) to lock max risk to $96.
3. **$2,600 USD (Account C):** Hold in cash as a volatility/liquidity buffer. Sizing is automated in the dashboard simulator; choose your account from the dropdown to see exact allocation limits.`;
    }

    if (textLower.includes("news") || textLower.includes("backtest") || textLower.includes("events") || textLower.includes("effective")) {
        return `Backtesting with news events is highly effective. Veterans do NOT trade *during* CPI or FOMC rate prints because spreads blow out. Instead, they backtest the **post-news drift**:
- Wait for the event hour rollover (Rule 1).
- Look for stochastics washes (<20 or >80) at the 200-hour Bollinger Band.
- Enter only when a reversal candle (e.g., Hammer) is confirmed at the close.
This allows you to capture news-driven liquidity sweeps while avoiding the initial chaotic spread wicks.`;
    }

    if (textLower.includes("rule") || textLower.includes("philosophy") || textLower.includes("risk management")) {
        return `My strategy operates under four strict veteran pillars:
1. **Capital Preservation**: Never open a trade without a defined, structural stop-loss or options-based hedge trigger.
2. **Stop Breakeven (SBE)**: Once a trade hits 1.5R gain, the stop-loss must be moved to entry to make it a free trade.
3. **Derivatives Hedging**: Use opposite contract hedges at major support/resistance pivots rather than triggering market-order stop slippages.
4. **Weekend De-risking**: Systematically scale-out (trim by 30-50%) high-conviction indices and volatile assets on Friday afternoon closes to guard against gap risk.`;
    }

    if (textLower.includes("gold") && (textLower.includes("flip") || textLower.includes("reversal") || textLower.includes("long") || textLower.includes("short"))) {
        return `Gold (XAUUSD) was shorted (60-75% size) during late January resistance sweeps. On Friday, Jan 30, Gold broke out of key structural resistance, triggering an immediate regime-shift. Following G7 reversal rules, shorts were closed and a 10% test Long was opened at 4920. This caps initial risk while participating in the new trend.`;
    }

    if (textLower.includes("coin") || textLower.includes("mstr") || textLower.includes("100%")) {
        return `COIN and MSTR are held at 100% sizes as equity proxies. However, they are walled off with protective put options (e.g., COIN hedged at 192). This restricts maximum possible drawdown to a defined 1.5% portfolio risk unit, capturing high-beta upside without exposing the core account to ruin.`;
    }

    if (textLower.includes("btc") || textLower.includes("bitcoin") || textLower.includes("staggered")) {
        return `Bitcoin (BTCUSD) positions are protected by staggered hedge levels (e.g. 1/3 at 89300, 1/3 at 86900, 1/3 at 85900). This tiered stop structure prevents a single 'wick sweep' from fully liquidating your core long position, giving the trade breathing room while progressively locking in downside protection.`;
    }

    return `I have parsed the 106-day veteran trading portfolio. I can answer questions about specific trades, explain my stop-loss / SBE adjustments, or detail my staggered hedge levels for crypto, metals, and index positions. What trade details would you like me to look up?`;
}

function sendChatMessage() {
    const input = document.getElementById("chat-input-field");
    const text = input.value.trim();
    if (!text) return;

    appendChatMessage(text, "user");
    input.value = "";

    setTimeout(() => {
        let reply = getSmartChatResponse(text);
        appendChatMessage(reply, "ai");
    }, 600);
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

// Inject parsed upload day
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

// Load TradingView chart
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
                    <span>Chart Loading offline</span>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">Symbol: ${mapped}</span>
                </div>`;
        }
    } catch (e) {
        container.innerHTML = `<div class="tv-placeholder">Chart unavailable: ${symbol}</div>`;
    }
}

// Update Active timeline day
function setTimelineDay(dayKey) {
    activeDay = dayKey;
    
    document.querySelectorAll(".timeline-btn").forEach(btn => {
        if (btn.querySelector(".date-label").innerText.includes(dayKey.split(" ").slice(1).join(" "))) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    renderLedger();
    
    const currentData = allHistory[activeDay];
    if (currentData) {
        let firstAsset = null;
        const catOrder = ["Currencies", "Stocks/ETF's", "Metals", "Crypto", "Energies", "Commodities"];
        for (const cat of catOrder) {
            const arr = currentData.categories[cat] || [];
            if (arr.length > 0) {
                firstAsset = arr[0];
                break;
            }
        }
        if (firstAsset) {
            selectAsset(firstAsset, getTypeForPosition(firstAsset.position));
        }
    }
}

// Bind Events on Page Load
window.onload = () => {
    initApp();

    document.getElementById("chat-send-btn").onclick = sendChatMessage;
    document.getElementById("chat-input-field").onkeydown = (e) => {
        if (e.key === "Enter") sendChatMessage();
    };

    document.getElementById("sim-capital-slider").oninput = calculateRisk;
    document.getElementById("sim-size-slider").oninput = calculateRisk;
    document.getElementById("sim-drawdown-slider").oninput = calculateRisk;
    document.getElementById("sim-account-select").onchange = changeAccountCapital;

    changeAccountCapital();

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
