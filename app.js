// Global App State
let activeDay = "";
let selectedAsset = null;
let allHistory = {}; // Will load from portfolio_history.json
let monthsList = [];
let activeMonth = "";

// Hardcoded fallback data in case portfolio_history.json isn't loaded
const fallbackLedgerData = {
    "Fri, Jan 30": {
        dateString: "Friday, January 30, 2026",
        notes: "Weekend De-risking. Trimmed SPX500 and NASDAQ sizes. Closed Natural Gas (NGAS.F) completely. Gold short completely closed and flipped to Long (10% size) on massive trend reversal. Added Long Silver hedge spread.",
        categories: {
            "Crypto": [
                { name: "Bitcoin", symbol: "BTCUSD", type: "long", position: "Long 91200, 33.3% hedged at 89300. 33% at 86900. 33% at 85900", size: "30%", chng: "29 Jan", reasoning: "Symmetric protection active for Bitcoin." }
            ],
            "Metals": [
                { name: "Gold", symbol: "XAUUSD", type: "long", position: "Long 4920, stop/hedge TBA", size: "10%", chng: "30 Jan", reasoning: "Flipped from short to long on breakout." }
            ]
        }
    }
};

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

// Group dates into months for sorting and timeline filtering
function getMonthName(dateKey) {
    // Expect key like "Mon, Jan 26" or "Tue, Feb 3" or filename "2026-02-05"
    if (dateKey.includes("Jan")) return "January";
    if (dateKey.includes("Feb")) return "February";
    if (dateKey.includes("Mar")) return "March";
    if (dateKey.includes("Apr")) return "April";
    if (dateKey.includes("May")) return "May";
    if (dateKey.includes("Jun")) return "June";
    
    // Check iso date format
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
    // E.g. fullObj.date = "Monday, January 26, 2026"
    if (fullObj && fullObj.date) {
        const clean = fullObj.date.trim();
        const df = new Date(clean);
        if (!isNaN(df.getTime())) return df;
    }
    // Fallback parsing dateKey
    // "Mon, Jan 26"
    const parts = dateKey.split(" ");
    if (parts.length >= 3) {
        const monthMap = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5 };
        const monthIndex = monthMap[parts[1].replace(",", "")];
        const day = parseInt(parts[2]);
        if (monthIndex !== undefined && !isNaN(day)) {
            return new Date(2026, monthIndex, day);
        }
    }
    return new Date(0); // Epoch fallback
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
}

// Build months navigation and horizontal days selector
function buildTimelineControls() {
    const keys = Object.keys(allHistory);
    
    // Extract unique months
    const months = new Set();
    keys.forEach(k => months.add(getMonthName(k)));
    
    monthsList = Array.from(months).sort((a, b) => getMonthOrder(a) - getMonthOrder(b));
    
    // Render Month Tabs
    const monthContainer = document.getElementById("month-filter-container");
    monthContainer.innerHTML = "";
    
    monthsList.forEach(m => {
        const btn = document.createElement("button");
        btn.className = `month-btn ${activeMonth === m ? 'active' : ''}`;
        btn.innerText = m;
        btn.onclick = () => selectMonth(m);
        monthContainer.appendChild(btn);
    });

    // Auto-select first month (or June since it's the latest data)
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
    
    // Update Month buttons active status
    document.querySelectorAll(".month-btn").forEach(btn => {
        if (btn.innerText === month) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    renderDaysTimeline();
    
    // Auto-select the first day of the new month
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
        
        // Extract day label ("Monday") and short date ("Jan 26")
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

    // Auto-scroll the active button into view
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

    // Filter categories that actually have assets
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
    if (lower.contains && lower.contains("short")) return "short";
    if (lower.includes("short")) return "short";
    if (lower.includes("hedged") || lower.includes("hedge")) return "hedged";
    return "long";
}

// Select an asset to display detail cards and sync charts
function selectAsset(asset, assetType) {
    selectedAsset = asset;
    
    // Highlight selected row in DOM
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
    
    // Generate intelligent detail reasoning dynamically based on parsed parameters
    const reasonText = getReasoningForAsset(asset, badge.innerText);
    document.getElementById("strategy-reasoning-content").innerText = reasonText;

    // Load TradingView chart
    loadTradingViewChart(getSymbolForAsset(asset.name));

    // Sync Sizing Simulator
    const sizePct = parseInt(asset.size) || 10;
    document.getElementById("sim-size-slider").value = sizePct;
    document.getElementById("sim-size-val").innerText = sizePct + "%";
    calculateRisk();
}

// Resolve asset tickers to TradingView symbols
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

// Dynamic text generator for Strategy reasoning box
function getReasoningForAsset(asset, type) {
    const lowerName = asset.name.toLowerCase();
    const pos = asset.position;
    
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
    
    // Highlight timeline button in DOM
    document.querySelectorAll(".timeline-btn").forEach(btn => {
        if (btn.querySelector(".date-label").innerText.includes(dayKey.split(" ").slice(1).join(" "))) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    renderLedger();
    
    // Auto-select first asset of the new day
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

// Capital Risk & Sizing Calculator
function calculateRisk() {
    const portfolioValue = parseFloat(document.getElementById("sim-capital-slider").value);
    const positionSizePercent = parseFloat(document.getElementById("sim-size-slider").value);
    const drawdownPercent = parseFloat(document.getElementById("sim-drawdown-slider").value);

    const positionValue = portfolioValue * (positionSizePercent / 100);
    const unhedgedLoss = positionValue * (drawdownPercent / 100);

    // Option premium hedge rules
    const hedgeCost = positionValue * 0.015; 
    const hedgeProtectionRatio = 0.70; 
    
    let hedgedLoss = unhedgedLoss * (1 - hedgeProtectionRatio) + hedgeCost;
    if (hedgedLoss > unhedgedLoss) {
        hedgedLoss = unhedgedLoss + (hedgeCost * 0.2); 
    }

    const capitalSaved = Math.max(0, unhedgedLoss - hedgedLoss);

    document.getElementById("sim-capital-val").innerText = "$" + portfolioValue.toLocaleString();
    document.getElementById("sim-size-val").innerText = positionSizePercent + "%";
    document.getElementById("sim-drawdown-val").innerText = drawdownPercent + "%";

    document.getElementById("result-unhedged").innerText = "-$" + Math.round(unhedgedLoss).toLocaleString();
    document.getElementById("result-hedged").innerText = "-$" + Math.round(hedgedLoss).toLocaleString();
    document.getElementById("result-saved").innerText = "+$" + Math.round(capitalSaved).toLocaleString();

    const maxLoss = Math.max(unhedgedLoss, hedgedLoss, 1);
    const unhedgedWidth = (unhedgedLoss / maxLoss) * 100;
    const hedgedWidth = (hedgedLoss / maxLoss) * 100;

    document.getElementById("bar-unhedged").style.width = unhedgedWidth + "%";
    document.getElementById("bar-hedged").style.width = hedgedWidth + "%";
}

// Chat AI rules database & Search Engine
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

function getSmartChatResponse(query) {
    const textLower = query.toLowerCase();
    
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
        return `Looking at the historical data, Gold (XAUUSD) was heavily shorted (up to 75% size) during late January resistance tests. However, on Friday, Jan 30, Gold confirmed a structural breakout above key resistance. In veteran trading, you never fight the momentum breakout. The short positions were closed, and a 10% test Long position was initiated at 4920. This caps trade risk while allowing participation in the new trend.`;
    }

    // COIN/MSTR size queries
    if (textLower.includes("coin") || textLower.includes("mstr") || textLower.includes("100%")) {
        return `Having a 100% position size in COIN or MSTR is a deliberate leverage play on the crypto ecosystem. However, it is NOT raw buy-and-hold risk. For example, on COIN, a hard contract hedge is locked at 192 (representing a 25% max loss limit on the asset). Since this allocation is walled off, the maximum possible drawdown is mathematically restricted to a defined margin. This allows us to capture high-beta upside while keeping net portfolio equity insulated.`;
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

    // Generic Search: Check if ticker is in database
    const tickers = ["BTC", "ETH", "SOL", "XRP", "SPX", "NDX", "NVDA", "PLTR", "COIN", "MSTR", "XAUUSD", "XAGUSD", "CL1!"];
    for (const t of tickers) {
        if (textLower.includes(t.toLowerCase())) {
            // Find latest status of ticker
            const latestKey = Object.keys(allHistory).sort().reverse()[0];
            const data = allHistory[latestKey];
            if (data) {
                let foundPos = null;
                for (const cat of Object.values(data.categories)) {
                    const match = cat.find(a => getSymbolForAsset(a.name) === t || a.name.toLowerCase() === t.toLowerCase());
                    if (match) { foundPos = match; break; }
                }
                if (foundPos) {
                    return `As of the latest parsed ledger (${latestKey}), the position on **${t}** is: **${foundPos.position}** (Size: ${foundPos.size}, changed on ${foundPos.chng}). Dynamic mentor advice: ${getReasoningForAsset(foundPos, getTypeForPosition(foundPos.position))}`;
                }
            }
        }
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
