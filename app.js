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
        category: "Course 1: Risk & Psychology",
        title: "Trade Like a Grown-Up – Discipline, Defence, and Devilry",
        slides: [
            {
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
                    
                    <div class="pattern-visualizer-container" style="background: rgba(255,255,255,0.01); padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                        <h4 style="margin-top:0; color: var(--color-primary); font-size: 0.8rem; text-transform: uppercase;">The Danger of Clustering</h4>
                        <p style="font-size: 0.8rem; line-height: 1.35; margin-bottom: 0.5rem;"><em>Illustration: Picture 5 trades in a row. Each one risks 3%. Three losses = -9%. Two more losses? -15%. You’re rattled, emotional, and now trading to “get it back.”</em></p>
                        <ul style="font-size: 0.8rem; line-height: 1.3;">
                            <li><strong>Clustering</strong> is when multiple losses (or wins) occur in quick succession. Even a good system can suffer.</li>
                            <li><strong>Solution:</strong> Proper risk limits and awareness of market regime. Reduce size or step back when variance spikes.</li>
                        </ul>
                        <div class="alert-banner" style="background: rgba(245, 158, 11, 0.05); color: var(--color-warning); border-color: rgba(245, 158, 11, 0.15); padding: 0.5rem; margin-top: 0.5rem; font-size: 0.75rem;">
                            <strong>Rule of Thumb:</strong> When clustered losses appear, assume the market has changed—or you have. Stop. Reassess.
                        </div>
                    </div>
                `
            },
            {
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
                subtitle: "IV. Trading Psychology – The Inner Arena",
                content: `
                    <h4>Ego Is Not Your Edge</h4>
                    <ul>
                        <li>Overconfidence leads to size increases right before a regime change.</li>
                        <li>Humility keeps you safe. Confidence in process, not prediction.</li>
                    </ul>
                    
                    <h4>Emotional Mastery</h4>
                    <ul>
                        <li>Fight/Flight leads to revenge trades, overtrading, and stubbornness.</li>
                        <li>Cultivate mindfulness. Observe yourself as you trade. Use journaling.</li>
                    </ul>
                    
                    <div class="pattern-visualizer-container" style="background: rgba(59, 130, 246, 0.03); padding: 1rem; border-radius: 8px; margin-top: 1rem; border: 1px solid rgba(59, 130, 246, 0.15);">
                        <h4 style="margin-top:0; color: var(--color-primary); font-size: 0.8rem; text-transform: uppercase;">Be the Analyst of the Trader</h4>
                        <p style="font-size: 0.8rem; line-height: 1.45; margin-bottom: 0.5rem;">The trader is reactive. The analyst is reflective. Be both.</p>
                        <ul style="font-size: 0.8rem; margin-bottom: 0;">
                            <li>Review every trade.</li>
                            <li>Note not just price action, but emotional action: fear, hesitation, greed.</li>
                        </ul>
                    </div>
                `
            },
            {
                subtitle: "V. Process > Prediction & VI. Building Edge",
                content: `
                    <h4>Setups, Not Wishes</h4>
                    <ul>
                        <li>Only enter trades with clear technical or fundamental rationale.</li>
                        <li>Avoid impulsive trades based on headlines or FOMO.</li>
                    </ul>
                    
                    <h4>Journaling</h4>
                    <ul>
                        <li>Record setup, entry, exit, rationale, and emotional state.</li>
                        <li>Review monthly. Look for patterns in behaviour.</li>
                        <li><strong>No Trade = Position:</strong> Sitting out is an active decision. Sideways markets, unclear trends, or mental fatigue = cash is a position.</li>
                    </ul>
                    
                    <h4>Building Edge – Brick by Brick</h4>
                    <ul>
                        <li><strong>Layered Confluence:</strong> Combine market structure, dynamics, macro news, and price action. The more aligned the signals, the more confident the trade.</li>
                        <li><strong>Ritual and Routine:</strong> Pre-market scan. Key level mapping. Daily brief (your own or in group). Trade review, even if no trades.</li>
                        <li><strong>Trade Community:</strong> Solitary trading leads to blind spots. Use your Discord room: test ideas, vent losses, share setups. Iron sharpens iron.</li>
                    </ul>
                    
                    <div class="alert-banner" style="background: rgba(16, 185, 129, 0.05); color: var(--color-success); border-color: rgba(16, 185, 129, 0.15); margin-top: 0.75rem; font-size: 0.8rem;">
                        <strong>VII. Final Punch – The Trader’s Code:</strong><br>
                        • Stay alive. That’s the first job.<br>
                        • Be boring in process, brilliant in execution.<br>
                        • Size small, think big. Never fall in love with a trade.<br>
                        <em style="display:block; margin-top:0.25rem; font-size:0.75rem; color: var(--text-muted);">“Consistency isn’t sexy. But neither is losing your house.”</em>
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
                subtitle: "Welcome & Getting Started",
                content: `
                    <p>Welcome to the ArcisFX G7 Swing Trading System. This swing trading model focuses on the 4 "Majors" namely the **EUR/USD, GBP/USD, USD/JPY, and USD/CHF**.</p>
                    <p>Due to their nature, the majors experience much greater volumes and are therefore highly technical, tending to trend more than other pairs. Trending behavior is required for consistent G7 swing profits.</p>
                    
                    <div class="pattern-visualizer-container" style="background: rgba(255,255,255,0.01); padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                        <h4 style="margin-top:0; color: var(--color-primary); font-size: 0.8rem; text-transform: uppercase;">Essential Startup Rules</h4>
                        <ul style="font-size: 0.8rem; line-height: 1.35;">
                            <li><strong>Demo First:</strong> Highly recommended to "demo" trade for at least 1-3 months (or 3-6 months) before committing real money. Demands of live trading are much greater in terms of stress and emotions.</li>
                            <li><strong>Patience on Pairs:</strong> Recommend trading 1-2 currencies most of the time, choosing the clearest G7 setups. Trade Euro, Pound, and then Yen in that preference order.</li>
                            <li><strong>Charts Needed:</strong> MetaTrader 4/5 or TradingView (web-based charting).</li>
                        </ul>
                    </div>
                `
            },
            {
                subtitle: "Chart & Indicators Screen Setup",
                content: `
                    <p>The G7 system uses 2 time periods for each currency: <strong>Weekly (W)</strong> and <strong>Hourly (1H)</strong>. Display 2 charts for each currency—hourly on top, weekly on bottom (total 6 charts on screen). Charts must be set to display **candlesticks**.</p>
                    
                    <div class="pattern-visualizer-container" style="background: rgba(59, 130, 246, 0.02); padding: 1.25rem; border-radius: 8px; border: 1px solid rgba(59, 130, 246, 0.15); display: flex; flex-direction: column; gap: 0.75rem;">
                        <h4 style="margin-top:0; color: var(--color-primary); font-size: 0.85rem; text-transform: uppercase; display:flex; align-items:center; gap:0.4rem;">
                            <i class="fa-solid fa-sliders"></i> Required Indicator Configurations
                        </h4>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem; font-size: 0.8rem; line-height: 1.35;">
                            <div>
                                <strong style="color: var(--text-primary);">Hourly Chart (1H) Setup:</strong>
                                <ol style="margin-left:1rem; margin-top:0.25rem; padding-left:0;">
                                    <li><strong>100-Hour Bollinger Band</strong> (Dev: 2, Shift: 0)</li>
                                    <li><strong>200-Hour Bollinger Band</strong> (Dev: 2, Shift: 0)</li>
                                    <li><strong>200-Period SMA</strong> (Simple Moving Average)</li>
                                    <li><strong>14/7/3 Slow Stochastic</strong> (Levels: 20/80)</li>
                                </ol>
                            </div>
                            <div>
                                <strong style="color: var(--text-primary);">Weekly Chart (W) Setup:</strong>
                                <ol style="margin-left:1rem; margin-top:0.25rem; padding-left:0;">
                                    <li><strong>10-Week SMA</strong> (Simple Moving Average)</li>
                                    <li style="color: var(--text-muted); list-style-type: none; margin-top:0.25rem;"><em>No other indicators are required on weekly charts.</em></li>
                                </ol>
                            </div>
                        </div>
                    </div>
                `
            },
            {
                subtitle: "Weekly Direction & Reversal Levels",
                content: `
                    <p>The G7 Swing Logic dictates that we determine trading direction weekly over the weekend using the previous week's closed candle:</p>
                    
                    <h4 style="color: var(--color-success); margin-top: 0.5rem;">Bullish Scenarios (Long Trades):</h4>
                    <ol>
                        <li>Weekly candle has a higher high and/or higher low than the week before.</li>
                        <li>Weekly candle has formed a "spike low" reversal candle (Doji, Hammer, Dragonfly, Hanging Man) after a long period of decline (4-8 weeks).</li>
                    </ol>
                    
                    <h4 style="color: var(--color-danger); margin-top: 0.5rem;">Bearish Scenarios (Short Trades):</h4>
                    <ol>
                        <li>Weekly candle has a lower high and/or lower low than the week before.</li>
                        <li>Weekly candle has formed a "spike high" reversal candle after a long period of rally (4-8 weeks).</li>
                    </ol>
                    
                    <div class="alert-banner" style="background: rgba(245, 158, 11, 0.05); color: var(--color-warning); border-color: rgba(245, 158, 11, 0.15); margin-top: 0.75rem; font-size: 0.8rem;">
                        <strong>Determining the Reversal Line (10-Pip Rule):</strong><br>
                        • <strong>If Bullish:</strong> Place the reversal level **10 pips below the lowest point** of the weekly candle.<br>
                        • <strong>If Bearish:</strong> Place the reversal level **10 pips above the highest point** of the weekly candle.<br>
                        If price crosses this boundary during the week, the direction is wrong. Stop trading immediately.
                    </div>
                `
            },
            {
                subtitle: "G7 Entry Point Rules (1 to 4)",
                content: `
                    <p>To initiate a trade, you must switch to the hourly (1H) chart and ensure the following conditions are met:</p>
                    
                    <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.85rem; line-height: 1.4;">
                        <div>
                            <strong>Rule #1: Wait for an hourly close.</strong>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.8rem;">No trade positions should be considered until the hour rollover. Volatility spikes 5-10 minutes before the top of the hour. Let it close.</p>
                        </div>
                        <div>
                            <strong>Rule #2: Stochastic trigger.</strong>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.8rem;">14/7/3 stochastic must be oversold (below 20) if buying, or overbought (above 80) if selling.</p>
                        </div>
                        <div>
                            <strong>Rule #3: Zones of probability.</strong>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.8rem;">Only enter when price is touching or beyond the 100-hour Bollinger Band, 200-hour Bollinger Band, or close to the 200-hour SMA. Any other position is "no-man's land".</p>
                        </div>
                        <div>
                            <strong>Rule #4: Support, Resistance & Fibs.</strong>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.8rem;">Identify confluence lines—look for retracements to Fibonacci levels (38.2%, 50%, 61.8%, 78.6%), trendlines, or horizontal SR lines.</p>
                        </div>
                    </div>
                `
            },
            {
                subtitle: "G7 Entry Point Rules (5 & 6)",
                content: `
                    <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.85rem; line-height: 1.4;">
                        <div>
                            <strong>Rule #5: Hourly Reversal Candle.</strong>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.8rem;">Given Rules 1-4 are met, wait for the hourly candle to close as a reversal trigger shape: Doji, Hammer, Engulfing lines, or Tweezer formations.</p>
                        </div>
                        
                        <div class="pattern-visualizer-container" style="background: rgba(255,255,255,0.01); padding: 0.75rem; border-radius: 8px; display: flex; justify-content: space-around; align-items: center;">
                            <div class="candlestick-col" style="width: 70px;">
                                <div class="candle-container" style="height: 60px;">
                                    <div class="candle-wick hammer-wick" style="height: 45px; top: 10px;"></div>
                                    <div class="candle-body bullish hammer-body" style="height: 10px; top: 10px;"></div>
                                </div>
                                <div class="candle-label" style="font-size:0.65rem;">Hammer Close</div>
                            </div>
                            <div class="candlestick-col" style="width: 70px;">
                                <div class="candle-container" style="height: 60px; flex-direction: row; gap: 2px;">
                                    <div style="position: relative; width: 6px; height: 100%;">
                                        <div class="candle-wick" style="height: 40px; top: 10px; left: 2px;"></div>
                                        <div class="candle-body bearish" style="height: 15px; top: 20px; width:6px;"></div>
                                    </div>
                                    <div style="position: relative; width: 6px; height: 100%;">
                                        <div class="candle-wick" style="height: 50px; top: 5px; left: 2px;"></div>
                                        <div class="candle-body bullish" style="height: 35px; top: 10px; width:6px;"></div>
                                    </div>
                                </div>
                                <div class="candle-label" style="font-size:0.65rem;">Engulfing Close</div>
                            </div>
                        </div>

                        <div>
                            <strong>Rule #6: Trade risk limits (Stop & Target).</strong>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.8rem;">
                                • Place stop-loss <strong>5-10 pips below/above the reversal candle pattern</strong> used as the trigger.<br>
                                • Stop loss must never be less than <strong>20 pips</strong> and never more than <strong>60 pips</strong>.<br>
                                • Profit target must always be <strong>at least double the size of the stop loss (2:1 ratio)</strong>.
                            </p>
                        </div>
                    </div>
                `
            },
            {
                subtitle: "Putting It All Together – Full Example",
                content: `
                    <h4>Step-by-Step G7 Walkthrough:</h4>
                    <ol style="font-size: 0.85rem; line-height: 1.45;">
                        <li><strong>Determine Direction (Weekly):</strong> Closed weekly candle is bearish. Direction for next week = Short. Reversal level set 10 pips above weekly high (1.8897).</li>
                        <li><strong>Monitor Hourly (Rule 1):</strong> Monday session rallies toward upper Bollinger Bands. Wait for hourly candle to close.</li>
                        <li><strong>Check Stochastics (Rule 2):</strong> Stochastic becomes overbought (> 80) near the upper bands.</li>
                        <li><strong>Confirm Zone & Confluence (Rules 3 & 4):</strong> Price touches upper 100-hour Bollinger Band, and coincides with a 61.8% Fibonacci retracement level.</li>
                        <li><strong>Trigger Entry (Rule 5):</strong> Hourly candle closes as a Bearish Engulfing pattern. Enter Short immediately.</li>
                        <li><strong>Manage Risk (Rule 6):</strong> Stop placed 5 pips above the engulfing high (calculated stop distance = 32 pips). Profit target set to 2:1 ratio = 64 pips. Trailing stops applied once in profit to lock gains.</li>
                    </ol>
                `
            }
        ]
    },
    {
        category: "Course 3: Energy Trading",
        title: "Widow Maker – Natural Gas Trading Techniques",
        slides: [
            {
                subtitle: "Module 1-2: Market Overview & Drivers",
                content: `
                    <p>Natural gas is a widely used energy resource, supplying roughly **24% of the energy requirements of developed countries**. Because it burns cleaner than coal and oil, it is valued in the global energy mix. However, transportation leakage issues and methane release represent environmental downsides.</p>
                    
                    <h4>Key Drivers of Natural Gas Prices:</h4>
                    <ul>
                        <li><strong>Supply and Demand:</strong> Extraction levels, storage inventory balances, and technological advances (e.g. hydraulic fracturing / fracking and horizontal drilling).</li>
                        <li><strong>Seasonality:</strong> Winter cold drives massive residential and commercial heating demand. Summer heat drives power plant cooling demands.</li>
                        <li><strong>Geopolitical Influences:</strong> Trade policies, pipeline pipeline regulations, and political instability in major producing zones.</li>
                        <li><strong>Market Data Sources:</strong> EIA Storage Reports, weather forecasts (<em>natgasweather.com</em>), economic indicators.</li>
                    </ul>
                `
            },
            {
                subtitle: "Module 3: Futures vs. Continuous ETFs",
                content: `
                    <p>Retail commodity traders have two primary instruments to participate in the natural gas market:</p>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.8rem; margin: 0.5rem 0;">
                        <div style="background: rgba(255,255,255,0.01); border: 1px solid var(--border-color); padding: 0.75rem; border-radius: 6px;">
                            <strong>Natural Gas Futures (NGAS.F / NG1)</strong>
                            <p style="margin: 0; margin-top: 0.25rem; font-size: 0.75rem; color: var(--text-secondary);">Traded on NYMEX. High purity, leverage, and liquidity, but requires managing rollover risks (contango/backwardation costs).</p>
                        </div>
                        <div style="background: rgba(255,255,255,0.01); border: 1px solid var(--border-color); padding: 0.75rem; border-radius: 6px;">
                            <strong>Continuous ETFs (NATGAS)</strong>
                            <p style="margin: 0; margin-top: 0.25rem; font-size: 0.75rem; color: var(--text-secondary);">No monthly rollover to manage. Simpler access through standard brokerage accounts with lower capital requirements.</p>
                        </div>
                    </div>
                    
                    <div class="alert-banner" style="background: rgba(239, 68, 68, 0.05); color: var(--color-danger); border-color: rgba(239, 68, 68, 0.15); font-size: 0.75rem; padding: 0.75rem;">
                        <span class="alert-dot" style="background: var(--color-danger);"></span>
                        <strong>Warning on BOIL & KOLD:</strong> These are 2x leveraged ETFs. They are designed for short-term daily trading. Holding them long-term guarantees losses due to daily volatility decay and compounding drag. <strong>Best left to pros or masochists.</strong>
                    </div>
                `
            },
            {
                subtitle: "Module 4-5: Technical Analysis & Hedging",
                content: `
                    <p>Technical analysis in natural gas relies on multiple timeframes: daily/weekly charts to define the overall trend, and hourly/4-hourly charts to execute entries.</p>
                    
                    <h4>Key Technical Indicators:</h4>
                    <ul>
                        <li><strong>Bollinger Bands:</strong> Monitor band width for volatility. A "third pierce" of the band indicates extreme overbought/oversold conditions where a reversal is highly likely.</li>
                        <li><strong>Moving Averages:</strong> Short-term (20 SMA/EMA) and long-term (50 or 200 SMA) confirm trend directions.</li>
                        <li><strong>Fibonacci Retracement & Extensions:</strong> Retracements (38.2%, 50%, 61.8%) mark pullback entries; extensions set profit targets once trend resumes.</li>
                    </ul>
                    
                    <h4>Hedging and Roll Management:</h4>
                    <ul>
                        <li>Use opposing futures positions or protective options (puts for long positions, calls for short) to offset volatility risk.</li>
                        <li>In contango markets, rolling front-month futures contracts incurs negative roll yields. Switch to continuous ETFs when roll costs become significant.</li>
                    </ul>
                `
            },
            {
                subtitle: "Module 6: Step-by-Step Trade Initiation Process",
                content: `
                    <p>Before executing any Natural Gas position, follow this 6-step check process:</p>
                    
                    <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem; line-height: 1.4;">
                        <div><strong>Step 1: Check COT positioning</strong> on Barchart.com (analyze extreme positions, contango/backwardation, and $2.00-$5.00 range).</div>
                        <div><strong>Step 2: Check weather and seasonality</strong> on <em>natgasweather.com</em>.</div>
                        <div><strong>Step 3: Check news, politics, and economics</strong> on <em>myfxbook.com</em>.</div>
                        <div><strong>Step 4: Check longer-term charts</strong> (daily/weekly) for trend direction.</div>
                        <div><strong>Step 5: Check the day of the week</strong> (be mindful of weekend gap risk).</div>
                        <div><strong>Step 6: Look at technicals</strong> on 4-hour, daily, and weekly charts, then apply risk hedging.</div>
                    </div>
                `
            },
            {
                subtitle: "Module 9: COT Report Analysis",
                content: `
                    <p>The Commitments of Traders (COT) report details the positions of different market participants. Barchart.com displays this report in simple categories:</p>
                    <ul>
                        <li><strong>Commercials:</strong> Typically producers and hedgers who trade to manage price risk. A net short position indicates they expect lower prices.</li>
                        <li><strong>Managed Money & Non-Commercials:</strong> Large speculative hedge funds. Extreme net long or net short positions indicate overextended trends that warn of imminent reversals.</li>
                        <li><strong>Recognizing Divergence:</strong> If prices are rising but managed money positions start to turn net short, it's a warning signal for a potential trend reversal.</li>
                    </ul>
                    <p style="font-size: 0.8rem; font-style: italic; color: var(--text-muted); margin-top: 0.5rem;">Cross-reference speculative COT extremes with hourly bullish/bearish engulfing patterns near support/resistance zones to confirm entries.</p>
                `
            },
            {
                subtitle: "Trading Checklists & Psychology",
                content: `
                    <h4>Natural Gas Daily Checklist:</h4>
                    <ul style="font-size: 0.8rem; line-height: 1.35;">
                        <li><strong>Pre-Market Setup:</strong> Boot up platform ➔ Check energy news & weather forecasts ➔ Open COT report ➔ Mark key support/resistance lines on multiple timeframes.</li>
                        <li><strong>During Market Hours:</strong> Monitor volume spikes ➔ Wait for confirmed technical signals ➔ Verify risk parameters are in place ➔ Execute according to plan.</li>
                        <li><strong>Trade Management:</strong> Adjust stops to SBE ➔ Log every trade in your journal.</li>
                        <li><strong>Post-Market Review:</strong> Save charts ➔ Analyze outcomes ➔ Update checklist.</li>
                    </ul>
                    
                    <h4>Trading Psychology (Module 8):</h4>
                    <ul>
                        <li><strong>Ego is not your edge:</strong> Overconfidence leads to size increases right before market changes. Humility keeps you safe.</li>
                        <li><strong>Techniques for Managing Emotions:</strong> Take regular breaks, practice mindfulness to clear the mind, and rehearse scenario plans.</li>
                    </ul>
                `
            }
        ]
    }
];

// Switch views between dashboard and academy
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

// Render active slide
function renderSlide() {
    const mod = courseModules[activeModuleIdx];
    if (!mod) return;
    const slide = mod.slides[activeSlideIdx];
    if (!slide) return;

    document.getElementById("slide-category").innerText = mod.category;
    document.getElementById("slide-title").innerText = slide.subtitle;
    document.getElementById("slide-progress").innerText = `Slide ${activeSlideIdx + 1} of ${mod.slides.length}`;
    
    document.getElementById("slide-body-content").innerHTML = slide.content;

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

// Render dynamic position rows inside active ledger
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

// Resolve visual type based on position description
function getTypeForPosition(pos) {
    const lower = pos.toLowerCase();
    if (lower.includes("short")) return "short";
    if (lower.includes("hedged") || lower.includes("hedge")) return "hedged";
    return "long";
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

    // Risk Unit = Capital * Risk%
    const riskUnit = totalCapital * (riskPercent / 100);

    // Recommended position sizing allocation = Risk % / Stop Distance %
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
        return `Looking at the historical data, Gold (XAUUSD) was shorted (up to 75% size) during late January resistance tests. However, on Friday, Jan 30, Gold confirmed a structural breakout above key resistance. In veteran trading, you never fight the momentum breakout. The short positions were closed, and a 10% test Long position was initiated at 4920. This caps trade risk while allowing participation in the new trend.`;
    }

    if (textLower.includes("coin") || textLower.includes("mstr") || textLower.includes("100%")) {
        return `COIN and MSTR are held at 100% sizes as equity proxies. However, they are walled off with protective put options (e.g., COIN hedged at 192). This restricts maximum possible drawdown to a defined 1.5% portfolio risk unit, capturing high-beta upside without exposing the core account to ruin.`;
    }

    if (textLower.includes("btc") || textLower.includes("bitcoin") || textLower.includes("staggered")) {
        return `Bitcoin (BTCUSD) positions are protected by staggered hedge levels (e.g. 1/3 at 89300, 1/3 at 86900, 1/3 at 85900). This tiered stop structure prevents a single 'wick sweep' from fully liquidating your core long position, giving the trade breathing room while progressively locking in downside protection.`;
    }

    const count = Object.keys(allHistory).length;
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
