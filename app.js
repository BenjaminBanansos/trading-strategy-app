// Global App State
let activeDay = "";
let selectedAsset = null;
let allHistory = {}; // Load from portfolio_history.json
let monthsList = [];
let activeMonth = "";

// Course Slide State & Metadata
let coursesLoaded = [false, false, false];
let coursesData = [[], [], []]; // Dynamically loaded pages
let activeSlideIdxs = [0, 0, 0]; // Course 1, Course 2, Course 3 slide pointers

const courseMeta = [
    { id: "course1", title: "Trade Like a Grown-Up", category: "Course 1: Risk & Psychology", file: "course1_pages.json" },
    { id: "course2", title: "G7 Swing Trading System", category: "Course 2: Forex Swing System", file: "course2_pages.json" },
    { id: "course3", title: "NATGAS Widow Maker Techniques", category: "Course 3: Energy Trading", file: "course3_pages.json" }
];

// Lazy load courses on demand
async function loadCourse(courseIdx) {
    if (coursesLoaded[courseIdx]) return;
    
    const meta = courseMeta[courseIdx];
    try {
        const response = await fetch(meta.file);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        coursesData[courseIdx] = data;
        coursesLoaded[courseIdx] = true;
        console.log(`Course ${courseIdx + 1} loaded with ${data.length} pages.`);
    } catch (e) {
        console.error(`Failed to load course ${courseIdx + 1}:`, e);
        // Basic fallback in case fetch fails
        coursesData[courseIdx] = [
            { page: 1, title: "Welcome", content: ["Failed to load course contents. Please ensure the local server is running."], raw_text: "" }
        ];
        coursesLoaded[courseIdx] = true;
    }
    
    buildCourseSidebar(courseIdx);
}

// Build course sidebars dynamically
function buildCourseSidebar(courseIdx) {
    const listContainer = document.getElementById(`c${courseIdx + 1}-slide-list`);
    if (!listContainer) return;
    listContainer.innerHTML = "";

    const pages = coursesData[courseIdx];
    pages.forEach((page, pIdx) => {
        const btn = document.createElement("button");
        btn.className = `module-btn ${activeSlideIdxs[courseIdx] === pIdx ? 'active' : ''}`;
        btn.id = `c${courseIdx + 1}-btn-${pIdx}`;
        btn.onclick = () => selectCourseSlide(courseIdx, pIdx);
        
        let labelText = page.title;
        if (labelText.length > 25) {
            labelText = labelText.substring(0, 22) + "...";
        }

        btn.innerHTML = `
            <span class="module-num">${page.page}</span>
            <span title="${page.title}">${labelText}</span>
        `;
        listContainer.appendChild(btn);
    });
}

// Select a specific slide in a course
function selectCourseSlide(courseIdx, slideIdx) {
    activeSlideIdxs[courseIdx] = slideIdx;

    if (!coursesLoaded[courseIdx]) {
        loadCourse(courseIdx).then(() => {
            selectCourseSlide(courseIdx, slideIdx);
        });
        return;
    }

    const pages = coursesData[courseIdx];
    const page = pages[slideIdx];
    if (!page) return;

    // Update sidebar active highlights
    const listContainer = document.getElementById(`c${courseIdx + 1}-slide-list`);
    if (listContainer) {
        listContainer.querySelectorAll(".module-btn").forEach((btn, idx) => {
            if (idx === slideIdx) {
                btn.classList.add("active");
                btn.scrollIntoView({ block: "nearest", behavior: "smooth" });
            } else {
                btn.classList.remove("active");
            }
        });
    }

    // Update displays
    const meta = courseMeta[courseIdx];
    document.getElementById(`c${courseIdx + 1}-category`).innerText = meta.category;
    document.getElementById(`c${courseIdx + 1}-title`).innerText = page.title;
    document.getElementById(`c${courseIdx + 1}-progress`).innerText = `Page ${page.page} of ${pages.length}`;

    // Render exact copy text nicely formatted
    let htmlContent = "";
    if (page.content && Array.isArray(page.content)) {
        page.content.forEach(p => {
            const trimmed = p.trim();
            if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("●") || trimmed.startsWith("👉") || trimmed.startsWith("⚠")) {
                const icon = trimmed.substring(0, 1);
                const rest = trimmed.substring(1).trim();
                htmlContent += `<ul><li style="list-style-type: none;"><span style="color: var(--color-success); margin-right: 0.5rem;">${icon}</span>${rest}</li></ul>`;
            } else if (trimmed.match(/^\d+\.\s/)) {
                const rest = trimmed.replace(/^\d+\.\s/, "");
                htmlContent += `<ol><li>${rest}</li></ol>`;
            } else if (trimmed.startsWith("I.") || trimmed.startsWith("II.") || trimmed.startsWith("III.") || trimmed.startsWith("IV.") || trimmed.startsWith("V.") || trimmed.startsWith("VI.") || trimmed.startsWith("VII.")) {
                htmlContent += `<h3>${trimmed}</h3>`;
            } else if (trimmed.startsWith("Module") || trimmed.startsWith("Section")) {
                htmlContent += `<h2 style="color: var(--color-success); border-bottom: 1px solid var(--border-color); padding-bottom: 0.25rem; margin-top: 1rem;">${trimmed}</h2>`;
            } else {
                htmlContent += `<p>${trimmed}</p>`;
            }
        });
    } else {
        htmlContent = `<p>${page.raw_text}</p>`;
    }
    document.getElementById(`c${courseIdx + 1}-text-panel`).innerHTML = htmlContent;

    // Trigger visualizer
    updateCourseVisualizer(courseIdx, slideIdx, page);
}

function nextCourseSlide(courseIdx) {
    const pages = coursesData[courseIdx];
    const currentIdx = activeSlideIdxs[courseIdx];
    if (currentIdx < pages.length - 1) {
        selectCourseSlide(courseIdx, currentIdx + 1);
    } else {
        alert(`Congratulations! You have completed Course ${courseIdx + 1}: ${courseMeta[courseIdx].title}!`);
    }
}

function prevCourseSlide(courseIdx) {
    const currentIdx = activeSlideIdxs[courseIdx];
    if (currentIdx > 0) {
        selectCourseSlide(courseIdx, currentIdx - 1);
    }
}

// Course Visualizer Controller
function updateCourseVisualizer(courseIdx, pageIdx, page) {
    const panel = document.getElementById(`c${courseIdx + 1}-visualizer-panel`);
    if (!panel) return;

    panel.innerHTML = "";

    const header = document.createElement("div");
    header.className = "vis-header";
    header.innerHTML = `
        <span class="vis-title"><i class="fa-solid fa-gauge-high"></i> Interactive Sandbox</span>
        <span class="vis-badge">Page ${page.page}</span>
    `;
    panel.appendChild(header);

    const content = document.createElement("div");
    content.className = "vis-content";
    panel.appendChild(content);

    // Render appropriate visualizer depending on course & page number
    if (courseIdx === 0) {
        renderCourse1Visualizer(pageIdx, content);
    } else if (courseIdx === 1) {
        renderCourse2Visualizer(pageIdx, page, content);
    } else if (courseIdx === 2) {
        renderCourse3Visualizer(pageIdx, page, content);
    }
}

/* ==============================================================
   Course 1: Trade Like a Grown-Up Visualizers
   ============================================================== */
function renderCourse1Visualizer(pageIdx, container) {
    if (pageIdx === 0) {
        container.innerHTML = `
            <h4 style="color: white; margin-bottom: 0.5rem;">Mindset Analyzer</h4>
            <div class="mindset-card pro">
                <strong style="color: var(--color-success); font-size: 0.85rem;"><i class="fa-solid fa-graduation-cap"></i> Professional Mindset</strong>
                <p style="font-size: 0.75rem; margin-top: 0.25rem; color: var(--text-secondary);">Thinks in terms of probability, risk parameters, and long-term expectancy. Survival is priority #1.</p>
            </div>
            <div class="mindset-card retail">
                <strong style="color: var(--color-danger); font-size: 0.85rem;"><i class="fa-solid fa-dice"></i> Gambler Mindset</strong>
                <p style="font-size: 0.75rem; margin-top: 0.25rem; color: var(--text-secondary);">Thinks in terms of hot streaks, predictions, and emotional validation. Blows accounts in days.</p>
            </div>
            <div class="vis-helper-text">"Ego is not your edge. Process is."</div>
        `;
    } else if (pageIdx === 1) {
        container.innerHTML = `
            <h4 style="color: white; margin-bottom: 0.5rem;">Position Sizer Simulator</h4>
            <div style="font-size: 0.75rem; background: rgba(255,255,255,0.02); padding: 0.75rem; border-radius: 6px; border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 0.5rem;">
                <div style="display:flex; justify-content:space-between;">
                    <span>Trading Account Capital</span>
                    <strong style="color: var(--color-primary);">$18,000 CAD</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span>Max Allowed Risk (1.5% limit)</span>
                    <strong style="color: var(--color-success);">$270 CAD</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span>GBP/USD Stop-Loss Distance</span>
                    <strong>30 Pips</strong>
                </div>
                <div style="border-top:1px dashed var(--border-color); padding-top:0.25rem; display:flex; justify-content:space-between; font-weight:700;">
                    <span>Max Allowed Lot Size</span>
                    <span style="color: var(--color-success);">0.9 Mini Lots</span>
                </div>
            </div>
            <div class="vis-helper-text">Sizing scales dynamically based on stop width to keep risk fixed.</div>
        `;
    } else if (pageIdx === 2) {
        container.innerHTML = `
            <h4 style="color: white; margin-bottom: 0.5rem;">Clustering Drawdown Impact</h4>
            <div style="font-size: 0.75rem; margin-bottom: 0.75rem;">Capital left after a 5-loss streak:</div>
            
            <div class="drawdown-bar-row">
                <div class="drawdown-bar-label">
                    <span>Retail Sizing (3% risk/trade)</span>
                    <strong style="color: var(--color-danger);">-15% Drawdown</strong>
                </div>
                <div class="drawdown-bar-bg">
                    <div class="drawdown-bar-fill" style="width: 85%; background: var(--color-danger);"></div>
                </div>
            </div>
            
            <div class="drawdown-bar-row">
                <div class="drawdown-bar-label">
                    <span>Grown-Up Sizing (1% risk/trade)</span>
                    <strong style="color: var(--color-success);">-5% Drawdown</strong>
                </div>
                <div class="drawdown-bar-bg">
                    <div class="drawdown-bar-fill" style="width: 95%; background: var(--color-success);"></div>
                </div>
            </div>
            <div class="vis-helper-text">At 1% risk, you are still ready to play. At 3% risk, emotional ruin begins.</div>
        `;
    } else {
        container.innerHTML = `
            <h4 style="color: white; margin-bottom: 0.5rem;">Interactive Confluence Builder</h4>
            <div class="vis-checklist-container" id="pro-confluences">
                <div class="vis-checklist-item" onclick="toggleConfluence(this, 15)">
                    <div class="vis-checklist-cb"><i class="fa-solid fa-check"></i></div>
                    <span style="font-size: 0.75rem;">Daily/Weekly Structure Alignment (+15% Win Rate)</span>
                </div>
                <div class="vis-checklist-item" onclick="toggleConfluence(this, 20)">
                    <div class="vis-checklist-cb"><i class="fa-solid fa-check"></i></div>
                    <span style="font-size: 0.75rem;">Support/Resistance Confluence (+20% Win Rate)</span>
                </div>
                <div class="vis-checklist-item" onclick="toggleConfluence(this, 15)">
                    <div class="vis-checklist-cb"><i class="fa-solid fa-check"></i></div>
                    <span style="font-size: 0.75rem;">EIA/COT Data Confirmation (+15% Win Rate)</span>
                </div>
                <div class="vis-checklist-item" onclick="toggleConfluence(this, 20)">
                    <div class="vis-checklist-cb"><i class="fa-solid fa-check"></i></div>
                    <span style="font-size: 0.75rem;">Hourly Reversal Candle close (+20% Win Rate)</span>
                </div>
            </div>
            <div style="margin-top: 0.75rem; font-size: 0.75rem; display:flex; justify-content:space-between; align-items:center;">
                <span>Combined Win Expectancy:</span>
                <strong id="confluence-win-rate" style="color: var(--color-success); font-size: 0.9rem;">15% (Gambler default)</strong>
            </div>
        `;
    }
}

function toggleConfluence(elem, score) {
    elem.classList.toggle("checked");
    let currentRate = 15;
    const items = document.querySelectorAll("#pro-confluences .vis-checklist-item");
    if (items[0].classList.contains("checked")) currentRate += 15;
    if (items[1].classList.contains("checked")) currentRate += 20;
    if (items[2].classList.contains("checked")) currentRate += 15;
    if (items[3].classList.contains("checked")) currentRate += 20;
    
    const label = document.getElementById("confluence-win-rate");
    if (label) {
        label.innerText = `${currentRate}% win rate`;
        if (currentRate > 50) {
            label.style.color = "var(--color-success)";
        } else {
            label.style.color = "var(--color-warning)";
        }
    }
}

/* ==============================================================
   Course 2: G7 Swing Forex System Visualizers
   ============================================================== */
function renderCourse2Visualizer(pageIdx, page, container) {
    const pageNum = page.page;
    if (pageNum <= 4) {
        container.innerHTML = `
            <h4 style="color: white; margin-bottom: 0.5rem;">Maximum G7 Leverage bounds</h4>
            <p style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Based on your current accounts and G7 maximum 3:1 leverage limits:</p>
            <div style="font-size:0.75rem; display:flex; flex-direction:column; gap:0.35rem;">
                <div style="background:rgba(255,255,255,0.02); padding:0.4rem; border-radius:4px; border:1px solid var(--border-color); display:flex; justify-content:space-between;">
                    <span>CAD Account ($18,000 CAD)</span>
                    <strong style="color: var(--color-success);">Max $54,000 Position size (0.54 Lot)</strong>
                </div>
                <div style="background:rgba(255,255,255,0.02); padding:0.4rem; border-radius:4px; border:1px solid var(--border-color); display:flex; justify-content:space-between;">
                    <span>USD Account A ($6,400 USD)</span>
                    <strong style="color: var(--color-success);">Max $19,200 Position size (0.19 Lot)</strong>
                </div>
                <div style="background:rgba(255,255,255,0.02); padding:0.4rem; border-radius:4px; border:1px solid var(--border-color); display:flex; justify-content:space-between;">
                    <span>USD Account B ($2,600 USD)</span>
                    <strong style="color: var(--color-success);">Max $7,800 Position size (0.07 Lot)</strong>
                </div>
            </div>
            <div class="vis-helper-text">Optimal G7 leverage is 1:1 to 2:1. Maximum bounds is 3:1.</div>
        `;
    } else if (pageNum >= 5 && pageNum <= 11) {
        let patternName = "Bullish Hammer";
        let candleData = "";
        
        if (pageNum === 6) {
            patternName = "Piercing Line";
            candleData = `
                <div class="vis-candle-wrapper">
                    <div class="vis-candle-wick" style="height: 100px; top: 10px;"></div>
                    <div class="vis-candle-body bearish" style="height: 60px; top: 25px;"></div>
                    <span class="vis-candle-label">Day 1 Close</span>
                </div>
                <div class="vis-candle-wrapper">
                    <div class="vis-candle-wick" style="height: 90px; top: 30px;"></div>
                    <div class="vis-candle-body bullish" style="height: 50px; top: 50px;"></div>
                    <span class="vis-candle-label">Day 2 (Pierced >50%)</span>
                </div>
            `;
        } else if (pageNum === 7) {
            patternName = "Bullish Doji Star";
            candleData = `
                <div class="vis-candle-wrapper">
                    <div class="vis-candle-wick" style="height: 100px; top: 10px;"></div>
                    <div class="vis-candle-body bearish" style="height: 60px; top: 20px;"></div>
                    <span class="vis-candle-label">Day 1</span>
                </div>
                <div class="vis-candle-wrapper">
                    <div class="vis-candle-wick" style="height: 20px; top: 110px;"></div>
                    <div class="vis-candle-body bullish" style="height: 4px; top: 118px; background:white !important; border-color:white !important;"></div>
                    <span class="vis-candle-label">Day 2 (Doji Gap)</span>
                </div>
            `;
        } else if (pageNum === 8) {
            patternName = "Hanging Man";
            candleData = `
                <div class="vis-candle-wrapper">
                    <div class="vis-candle-wick" style="height: 120px; top: 10px;"></div>
                    <div class="vis-candle-body bearish" style="height: 25px; top: 15px;"></div>
                    <span class="vis-candle-label">Hanging Man (Bearish reversal)</span>
                </div>
            `;
        } else if (pageNum === 9) {
            patternName = "Shooting Star";
            candleData = `
                <div class="vis-candle-wrapper">
                    <div class="vis-candle-wick" style="height: 120px; top: 10px;"></div>
                    <div class="vis-candle-body bearish" style="height: 25px; top: 90px;"></div>
                    <span class="vis-candle-label">Shooting Star (Upper rejection)</span>
                </div>
            `;
        } else if (pageNum === 10) {
            patternName = "Harami";
            candleData = `
                <div class="vis-candle-wrapper">
                    <div class="vis-candle-wick" style="height: 110px; top: 10px;"></div>
                    <div class="vis-candle-body bearish" style="height: 80px; top: 20px;"></div>
                    <span class="vis-candle-label">Day 1</span>
                </div>
                <div class="vis-candle-wrapper">
                    <div class="vis-candle-wick" style="height: 50px; top: 40px;"></div>
                    <div class="vis-candle-body bullish" style="height: 30px; top: 50px;"></div>
                    <span class="vis-candle-label">Day 2 Inside Day</span>
                </div>
            `;
        } else if (pageNum === 11) {
            patternName = "Gravestone Doji";
            candleData = `
                <div class="vis-candle-wrapper">
                    <div class="vis-candle-wick" style="height: 120px; top: 10px;"></div>
                    <div class="vis-candle-body bearish" style="height: 2px; top: 110px; background:white !important; border-color:white !important;"></div>
                    <span class="vis-candle-label">Gravestone (Exhaustion)</span>
                </div>
            `;
        } else {
            patternName = "Candlestick shape";
            candleData = `
                <div class="vis-candle-wrapper">
                    <div class="vis-candle-wick" style="height: 100px; top: 10px;"></div>
                    <div class="vis-candle-body bullish" style="height: 50px; top: 30px;"></div>
                    <span class="vis-candle-label">Bullish candle</span>
                </div>
            `;
        }

        container.innerHTML = `
            <h4 style="color: white; margin-bottom: 0.5rem;">G7 Pattern Visualizer: ${patternName}</h4>
            <div class="vis-chart-area">
                <div class="vis-chart-gridlines">
                    <div class="vis-gridline"></div>
                    <div class="vis-gridline"></div>
                    <div class="vis-gridline"></div>
                </div>
                ${candleData}
            </div>
            <div class="vis-helper-text">Visual representation of G7 reversal candlestick structures.</div>
        `;
    } else if (pageNum >= 12 && pageNum <= 15) {
        container.innerHTML = `
            <h4 style="color: white; margin-bottom: 0.5rem;">Majors Volume Breakdown</h4>
            <div class="drawdown-bar-row">
                <div class="drawdown-bar-label">
                    <span>EUR/USD (Euro/Dollar)</span>
                    <strong>28% market volume</strong>
                </div>
                <div class="drawdown-bar-bg">
                    <div class="drawdown-bar-fill" style="width: 80%; background: var(--color-success);"></div>
                </div>
            </div>
            <div class="drawdown-bar-row">
                <div class="drawdown-bar-label">
                    <span>USD/JPY (Dollar/Yen)</span>
                    <strong>17% market volume</strong>
                </div>
                <div class="drawdown-bar-bg">
                    <div class="drawdown-bar-fill" style="width: 50%; background: var(--color-primary);"></div>
                </div>
            </div>
            <div class="drawdown-bar-row">
                <div class="drawdown-bar-label">
                    <span>GBP/USD (Pound/Dollar)</span>
                    <strong>14% market volume</strong>
                </div>
                <div class="drawdown-bar-bg">
                    <div class="drawdown-bar-fill" style="width: 40%; background: var(--color-warning);"></div>
                </div>
            </div>
            <div class="vis-helper-text">G7 Swing System focuses purely on these high liquidity pairs.</div>
        `;
    } else if (pageNum >= 16 && pageNum <= 20) {
        container.innerHTML = `
            <h4 style="color: white; margin-bottom: 0.5rem;">G7 Chart Indicator Overlay</h4>
            <div style="border:1px solid var(--border-color); border-radius:6px; background:var(--bg-darkest); padding:0.75rem; font-size:0.75rem; display:flex; flex-direction:column; gap:0.4rem;">
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.03); padding-bottom:0.25rem;">
                    <span style="color: var(--color-success);">10 SMA (Weekly Chart)</span>
                    <strong>Weekly Trend Filter</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.03); padding-bottom:0.25rem;">
                    <span style="color: var(--color-primary);">200 SMA (Hourly Chart)</span>
                    <strong>Dynamic Support Line</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.03); padding-bottom:0.25rem;">
                    <span style="color: var(--color-warning);">200 Bollinger Bands (2.0 Std Dev)</span>
                    <strong>Outer Range Bounds</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span style="color: #a855f7;">Stochastic Oscillator (14, 7, 3)</span>
                    <strong>Overbought/Oversold Filter</strong>
                </div>
            </div>
            <div class="vis-helper-text">Hourly stochastic below 20 = oversold (Buy dips). Above 80 = overbought (Sell rallies).</div>
        `;
    } else if (pageNum >= 21 && pageNum <= 28) {
        container.innerHTML = `
            <h4 style="color: white; margin-bottom: 0.5rem;">Weekly Candlestick Trend Identification</h4>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
                <div style="background:rgba(255,255,255,0.02); padding:0.5rem; border-radius:4px; border:1px solid rgba(16,185,129,0.15); text-align:center;">
                    <strong style="color: var(--color-success); font-size:0.8rem;">Bullish Weekly Structure</strong>
                    <div style="font-size:0.7rem; color:var(--text-secondary); margin-top:0.25rem;">Weekly candle makes a higher high and higher low. Buy G7 Hourly setups next week.</div>
                </div>
                <div style="background:rgba(255,255,255,0.02); padding:0.5rem; border-radius:4px; border:1px solid rgba(239,68,68,0.15); text-align:center;">
                    <strong style="color: var(--color-danger); font-size:0.8rem;">Bearish Weekly Structure</strong>
                    <div style="font-size:0.7rem; color:var(--text-secondary); margin-top:0.25rem;">Weekly candle makes a lower high and lower low. Sell G7 Hourly setups next week.</div>
                </div>
            </div>
            <div class="vis-helper-text">You must determine direction on the Weekly chart before entering hourly charts!</div>
        `;
    } else if (pageNum >= 29 && pageNum <= 39) {
        container.innerHTML = `
            <h4 style="color: white; margin-bottom: 0.5rem;">G7 Entry Checkpoint Rules</h4>
            <div style="font-size:0.75rem; display:flex; flex-direction:column; gap:0.4rem;">
                <div style="display:flex; gap:0.5rem; align-items:center;"><i class="fa-solid fa-circle-check" style="color: var(--color-success);"></i> <span>Rule 1: Trade in direction of Weekly trend.</span></div>
                <div style="display:flex; gap:0.5rem; align-items:center;"><i class="fa-solid fa-circle-check" style="color: var(--color-success);"></i> <span>Rule 2: Wait for hourly price pullbacks.</span></div>
                <div style="display:flex; gap:0.5rem; align-items:center;"><i class="fa-solid fa-circle-check" style="color: var(--color-success);"></i> <span>Rule 3: Stochastic oscillator must confirm oversold (for longs) or overbought (shorts).</span></div>
                <div style="display:flex; gap:0.5rem; align-items:center;"><i class="fa-solid fa-circle-check" style="color: var(--color-success);"></i> <span>Rule 4: Price touches Bollinger Band boundaries.</span></div>
            </div>
            <div class="vis-helper-text">Hourly retracements must be combined with oscillator extrema to limit fake breakouts.</div>
        `;
    } else if (pageNum >= 40 && pageNum <= 45) {
        container.innerHTML = `
            <h4 style="color: white; margin-bottom: 0.5rem;">G7 Risk Limit Placement</h4>
            <div style="border:1px solid var(--border-color); border-radius:6px; background:var(--bg-darkest); padding:0.75rem; font-size:0.75rem; display:flex; flex-direction:column; gap:0.4rem;">
                <div style="display:flex; justify-content:space-between;">
                    <span>Entry point:</span>
                    <strong style="color: var(--color-success);">Immediate close of Reversal Candle</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span>Stop-Loss placement:</span>
                    <strong style="color: var(--color-danger);">5-10 Pips below wick low</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span>Risk target (2:1 minimum):</span>
                    <strong style="color: var(--color-primary);">2x Stop distance (e.g. 30 pip stop = 60 pip target)</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span>SBE (Stop-Breakeven):</span>
                    <strong style="color: var(--color-warning);">Move stop to entry at 1.5R gains</strong>
                </div>
            </div>
            <div class="vis-helper-text">Once moved to SBE, the trade becomes risk-free.</div>
        `;
    } else {
        container.innerHTML = `
            <h4 style="color: white; margin-bottom: 0.5rem;">Interactive G7 GBP/USD Walkthrough</h4>
            <div style="font-size:0.75rem; background:rgba(255,255,255,0.02); padding:0.75rem; border-radius:6px; border:1px solid var(--border-color);" id="walkthrough-board">
                <div style="font-weight:700; color:var(--color-success); margin-bottom:0.25rem;">Step 1: Check Weekly Chart</div>
                <p style="color:var(--text-secondary); margin-bottom:0.5rem;">GBP/USD Weekly candle closes with a higher high and higher low. Trend is Bullish. We will only look to BUY.</p>
                <button class="slide-nav-btn primary" onclick="nextWalkthroughStep(1)" style="font-size:0.7rem; padding:0.35rem 0.6rem;">Next Step <i class="fa-solid fa-arrow-right"></i></button>
            </div>
            <div class="vis-helper-text">Interactive walkthrough of a live trade setup.</div>
        `;
    }
}

function nextWalkthroughStep(stepNum) {
    const board = document.getElementById("walkthrough-board");
    if (!board) return;
    
    if (stepNum === 1) {
        board.innerHTML = `
            <div style="font-weight:700; color:var(--color-success); margin-bottom:0.25rem;">Step 2: Wait for Hourly Dip</div>
            <p style="color:var(--text-secondary); margin-bottom:0.5rem;">On Monday, GBP/USD dips to the lower Bollinger Band boundary and touches the 200 SMA line on hourly chart.</p>
            <div style="display:flex; gap:0.5rem;">
                <button class="slide-nav-btn" onclick="nextWalkthroughStep(0)" style="font-size:0.7rem; padding:0.35rem 0.6rem;"><i class="fa-solid fa-arrow-left"></i> Back</button>
                <button class="slide-nav-btn primary" onclick="nextWalkthroughStep(2)" style="font-size:0.7rem; padding:0.35rem 0.6rem;">Next Step <i class="fa-solid fa-arrow-right"></i></button>
            </div>
        `;
    } else if (stepNum === 2) {
        board.innerHTML = `
            <div style="font-weight:700; color:var(--color-success); margin-bottom:0.25rem;">Step 3: Check Oscillators</div>
            <p style="color:var(--text-secondary); margin-bottom:0.5rem;">Hourly Stochastic (14,7,3) sits below 20 (oversold region), indicating sellers are exhausted on the dip.</p>
            <div style="display:flex; gap:0.5rem;">
                <button class="slide-nav-btn" onclick="nextWalkthroughStep(1)" style="font-size:0.7rem; padding:0.35rem 0.6rem;"><i class="fa-solid fa-arrow-left"></i> Back</button>
                <button class="slide-nav-btn primary" onclick="nextWalkthroughStep(3)" style="font-size:0.7rem; padding:0.35rem 0.6rem;">Next Step <i class="fa-solid fa-arrow-right"></i></button>
            </div>
        `;
    } else if (stepNum === 3) {
        board.innerHTML = `
            <div style="font-weight:700; color:var(--color-success); margin-bottom:0.25rem;">Step 4: Reversal Candle close</div>
            <p style="color:var(--text-secondary); margin-bottom:0.5rem;">A bullish piercing candle forms on hourly support. We enter LONG at the close of the candle. Stop is placed 10 pips below the candle wick (30 pips total stop). Target is 60 pips.</p>
            <div style="display:flex; gap:0.5rem;">
                <button class="slide-nav-btn" onclick="nextWalkthroughStep(2)" style="font-size:0.7rem; padding:0.35rem 0.6rem;"><i class="fa-solid fa-arrow-left"></i> Back</button>
                <button class="slide-nav-btn primary" onclick="nextWalkthroughStep(4)" style="font-size:0.7rem; padding:0.35rem 0.6rem;">Next Step <i class="fa-solid fa-arrow-right"></i></button>
            </div>
        `;
    } else if (stepNum === 4) {
        board.innerHTML = `
            <div style="font-weight:700; color:var(--color-success); margin-bottom:0.25rem;">Step 5: Lock Breakeven (SBE)</div>
            <p style="color:var(--text-secondary); margin-bottom:0.5rem;">Price rallies 45 pips (1.5R gain). We move the trade stop-loss to entry level (SBE). The trade is now risk-free. Target is hit later on for 60 pips profit!</p>
            <button class="slide-nav-btn primary" onclick="nextWalkthroughStep(0)" style="font-size:0.7rem; padding:0.35rem 0.6rem;"><i class="fa-solid fa-rotate-left"></i> Restart Walkthrough</button>
        `;
    } else {
        board.innerHTML = `
            <div style="font-weight:700; color:var(--color-success); margin-bottom:0.25rem;">Step 1: Check Weekly Chart</div>
            <p style="color:var(--text-secondary); margin-bottom:0.5rem;">GBP/USD Weekly candle closes with a higher high and higher low. Trend is Bullish. We will only look to BUY.</p>
            <button class="slide-nav-btn primary" onclick="nextWalkthroughStep(1)" style="font-size:0.7rem; padding:0.35rem 0.6rem;">Next Step <i class="fa-solid fa-arrow-right"></i></button>
        `;
    }
}

/* ==============================================================
   Course 3: Natural Gas Widow Maker Visualizers
   ============================================================== */
function renderCourse3Visualizer(pageIdx, page, container) {
    const pageNum = page.page;
    if (pageNum <= 9) {
        container.innerHTML = `
            <h4 style="color: white; margin-bottom: 0.5rem;">Weather & Inventory driver</h4>
            <div style="font-size:0.75rem; background:rgba(255,255,255,0.02); padding:0.75rem; border-radius:6px; border:1px solid var(--border-color); display:flex; flex-direction:column; gap:0.5rem;">
                <div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.15rem;"><span>Weather Regime</span><strong id="w-val">Normal</strong></div>
                    <input type="range" class="slider-input" min="1" max="5" value="3" id="weather-range" oninput="calculateNatgasDrivers()">
                </div>
                <div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.15rem;"><span>EIA Gas Inventory Level</span><strong id="i-val">Normal</strong></div>
                    <input type="range" class="slider-input" min="1" max="5" value="3" id="inv-range" oninput="calculateNatgasDrivers()">
                </div>
                <div style="border-top:1px dashed var(--border-color); padding-top:0.35rem; display:flex; justify-content:space-between; align-items:center;">
                    <span>Price Outlook Volatility:</span>
                    <strong id="outlook-val" style="color: var(--color-success); font-size:0.85rem;">STABLE</strong>
                </div>
            </div>
            <div class="vis-helper-text">Arctic blasts in winter combined with low storage = extreme price spikes.</div>
        `;
    } else if (pageNum >= 10 && pageNum <= 19) {
        container.innerHTML = `
            <h4 style="color: white; margin-bottom: 0.5rem;">Natural Gas Infrastructure flow</h4>
            <div class="ng-flow-map">
                <div class="ng-flow-node active">Production Well</div>
                <div class="ng-flow-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                <div class="ng-flow-node">Transmission Pipeline</div>
            </div>
            <div class="ng-flow-map">
                <div class="ng-flow-node">Underground Storage</div>
                <div class="ng-flow-arrow"><i class="fa-solid fa-arrow-left"></i></div>
                <div class="ng-flow-node">Industrial / Power Plants</div>
            </div>
            <div style="text-align:center;"><i class="fa-solid fa-ship" style="color: var(--color-primary);"></i> LNG Export Terminals</div>
            <div class="vis-helper-text">Gas is stored in underground aquifers and depleted reservoirs during summer, and withdrawn in winter.</div>
        `;
    } else if (pageNum >= 20 && pageNum <= 28) {
        container.innerHTML = `
            <h4 style="color: white; margin-bottom: 0.5rem;">Contango roll decay Simulator</h4>
            <p style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:0.5rem;">In a flat natural gas market with contango roll pricing, the 12-month decay is:</p>
            <div class="drawdown-bar-row">
                <div class="drawdown-bar-label">
                    <span>Spot Natural Gas Price</span>
                    <strong style="color: white;">0% (Flat)</strong>
                </div>
                <div class="drawdown-bar-bg">
                    <div class="drawdown-bar-fill" style="width: 100%; background: var(--text-secondary);"></div>
                </div>
            </div>
            <div class="drawdown-bar-row">
                <div class="drawdown-bar-label">
                    <span>UNG (1x ETF) Sizer</span>
                    <strong style="color: var(--color-warning);">-15% decay</strong>
                </div>
                <div class="drawdown-bar-bg">
                    <div class="drawdown-bar-fill" style="width: 85%; background: var(--color-warning);"></div>
                </div>
            </div>
            <div class="drawdown-bar-row">
                <div class="drawdown-bar-label">
                    <span>BOIL (2x Leveraged ETF)</span>
                    <strong style="color: var(--color-danger);">-48% decay</strong>
                </div>
                <div class="drawdown-bar-bg">
                    <div class="drawdown-bar-fill" style="width: 52%; background: var(--color-danger);"></div>
                </div>
            </div>
            <div class="vis-helper-text">WARNING: Never hold BOIL or KOLD for swing runs beyond 1-3 weeks. Leveraged reset erosion leads to mathematical ruin.</div>
        `;
    } else if (pageNum >= 29 && pageNum <= 38) {
        container.innerHTML = `
            <h4 style="color: white; margin-bottom: 0.5rem;">Natural Gas Breakout & Pullback</h4>
            <div style="height:150px; background:var(--bg-darkest); border:1px solid var(--border-color); border-radius:6px; position:relative; overflow:hidden;">
                <div style="position:absolute; width:100%; border-top:1px dashed var(--color-danger); top:60px; left:0; text-align:right; font-size:0.6rem; color:var(--color-danger); padding-right:0.5rem;">Resistance Level</div>
                <div style="position:absolute; width:6px; height:6px; border-radius:50%; background:white; top:110px; left:20px;"></div>
                <div style="position:absolute; width:6px; height:6px; border-radius:50%; background:white; top:80px; left:60px;"></div>
                <div style="position:absolute; width:6px; height:6px; border-radius:50%; background:white; top:100px; left:100px;"></div>
                <div style="position:absolute; width:6px; height:6px; border-radius:50%; background:white; top:55px; left:140px;"></div>
                <div style="position:absolute; width:6px; height:6px; border-radius:50%; background:var(--color-success); top:30px; left:180px;"></div>
                <div style="position:absolute; width:6px; height:6px; border-radius:50%; background:var(--color-primary); top:65px; left:210px;"></div>
                <div style="position:absolute; width:6px; height:6px; border-radius:50%; background:var(--color-success); top:15px; left:250px;"></div>
                <div style="position:absolute; top:75px; left:200px; font-size:0.65rem; color:var(--color-primary);">BOPB Buy Area</div>
            </div>
            <div class="vis-helper-text">Breakout-Pullback (BOPB): We wait for price to break resistance, pull back to test it as support, and enter on rejection.</div>
        `;
    } else if (pageNum >= 39 && pageNum <= 44) {
        container.innerHTML = `
            <h4 style="color: white; margin-bottom: 0.5rem;">Triple Wick Rejection</h4>
            <div class="vis-chart-area">
                <div class="vis-chart-gridlines"><div class="vis-gridline"></div></div>
                <div class="vis-candle-wrapper">
                    <div class="vis-candle-wick" style="height:90px; top:30px;"></div>
                    <div class="vis-candle-body bearish" style="height:25px; top:30px;"></div>
                    <span class="vis-candle-label">Wick 1</span>
                </div>
                <div class="vis-candle-wrapper">
                    <div class="vis-candle-wick" style="height:95px; top:25px;"></div>
                    <div class="vis-candle-body bullish" style="height:20px; top:25px;"></div>
                    <span class="vis-candle-label">Wick 2</span>
                </div>
                <div class="vis-candle-wrapper">
                    <div class="vis-candle-wick" style="height:92px; top:28px;"></div>
                    <div class="vis-candle-body bearish" style="height:15px; top:28px;"></div>
                    <span class="vis-candle-label">Wick 3</span>
                </div>
            </div>
            <div class="vis-helper-text">Triple spikes print long upper wicks, proving heavy sellers block higher prices.</div>
        `;
    } else if (pageNum >= 45 && pageNum <= 51) {
        container.innerHTML = `
            <h4 style="color: white; margin-bottom: 0.5rem;">Leveraged Hedging payoff</h4>
            <div style="border:1px solid var(--border-color); border-radius:6px; background:var(--bg-darkest); padding:0.75rem; font-size:0.75rem; display:flex; flex-direction:column; gap:0.4rem;">
                <div style="display:flex; justify-content:space-between;">
                    <span>Position Sizing:</span>
                    <strong>100% size on Futures</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span>Active Hedge Order:</span>
                    <strong style="color: var(--color-warning);">Out-of-the-money Put option</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span>Max potential loss (Hedged):</span>
                    <strong style="color: var(--color-success);">$95 (Capped limit)</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span>Unhedged maximum loss:</span>
                    <strong style="color: var(--color-danger);">$2,500+ (Unlimited drawdown)</strong>
                </div>
            </div>
            <div class="vis-helper-text">Hedging caps downside tail-risks while allowing positions to ride trend momentum.</div>
        `;
    } else if (pageNum >= 52 && pageNum <= 53) {
        container.innerHTML = `
            <h4 style="color: white; margin-bottom: 0.5rem;">6-Step Natural Gas Entry Checklist</h4>
            <div class="vis-checklist-container" id="natgas-checklist">
                <div class="vis-checklist-item" onclick="this.classList.toggle('checked')">
                    <div class="vis-checklist-cb"><i class="fa-solid fa-check"></i></div>
                    <span style="font-size:0.75rem;">Step 1: Check Weekly Trend (10 SMA)</span>
                </div>
                <div class="vis-checklist-item" onclick="this.classList.toggle('checked')">
                    <div class="vis-checklist-cb"><i class="fa-solid fa-check"></i></div>
                    <span style="font-size:0.75rem;">Step 2: Spot COT Report Divergences</span>
                </div>
                <div class="vis-checklist-item" onclick="this.classList.toggle('checked')">
                    <div class="vis-checklist-cb"><i class="fa-solid fa-check"></i></div>
                    <span style="font-size:0.75rem;">Step 3: Analyze EIA Storage deviations</span>
                </div>
                <div class="vis-checklist-item" onclick="this.classList.toggle('checked')">
                    <div class="vis-checklist-cb"><i class="fa-solid fa-check"></i></div>
                    <span style="font-size:0.75rem;">Step 4: Check Bollinger Band boundary test</span>
                </div>
                <div class="vis-checklist-item" onclick="this.classList.toggle('checked')">
                    <div class="vis-checklist-cb"><i class="fa-solid fa-check"></i></div>
                    <span style="font-size:0.75rem;">Step 5: Verify Stochastic below 20 / above 80</span>
                </div>
                <div class="vis-checklist-item" onclick="this.classList.toggle('checked')">
                    <div class="vis-checklist-cb"><i class="fa-solid fa-check"></i></div>
                    <span style="font-size:0.75rem;">Step 6: Hourly reversal candlestick trigger</span>
                </div>
            </div>
        `;
    } else if (pageNum >= 54 && pageNum <= 60) {
        container.innerHTML = `
            <h4 style="color: white; margin-bottom: 0.5rem;">Gas Futures Sizing Calculator</h4>
            <div style="font-size:0.75rem; background:rgba(255,255,255,0.02); padding:0.75rem; border-radius:6px; border:1px solid var(--border-color); display:flex; flex-direction:column; gap:0.5rem;">
                <div style="display:flex; justify-content:space-between;">
                    <span>Sizing target (1% risk):</span>
                    <strong style="color: var(--color-success);">$180 CAD (on $18k Capital)</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span>Stop-Loss distance:</span>
                    <strong>15 cents ($0.15)</strong>
                </div>
                <div style="border-top:1px dashed var(--border-color); padding-top:0.25rem; display:flex; justify-content:space-between; font-weight:700;">
                    <span>Max allowed contract size:</span>
                    <span style="color: var(--color-success);">1.2 Mini contracts (or 1200 shares UNG)</span>
                </div>
            </div>
            <div class="vis-helper-text">Keeps risk constant across highly volatile swings.</div>
        `;
    } else if (pageNum >= 61 && pageNum <= 65) {
        container.innerHTML = `
            <h4 style="color: white; margin-bottom: 0.5rem;">Pre-Market Preparation log</h4>
            <div style="font-size:0.75rem; display:flex; flex-direction:column; gap:0.4rem;">
                <div style="display:flex; gap:0.5rem; align-items:center;"><i class="fa-solid fa-square-check" style="color: var(--color-success);"></i> <span>Check weather models (GFS & ECMWF runs)</span></div>
                <div style="display:flex; gap:0.5rem; align-items:center;"><i class="fa-solid fa-square-check" style="color: var(--color-success);"></i> <span>Check EIA gas storage survey estimates</span></div>
                <div style="display:flex; gap:0.5rem; align-items:center;"><i class="fa-solid fa-square-check" style="color: var(--color-success);"></i> <span>Open multiple charts (4hr, Daily, Weekly)</span></div>
                <div style="display:flex; gap:0.5rem; align-items:center;"><i class="fa-solid fa-square-check" style="color: var(--color-success);"></i> <span>Check correlation grids (WTI Crude oil)</span></div>
            </div>
            <div class="vis-helper-text">Discipline is not about guessing; it is about checklist conformity.</div>
        `;
    } else if (pageNum >= 66 && pageNum <= 74) {
        container.innerHTML = `
            <h4 style="color: white; margin-bottom: 0.5rem;">COT Net Positions Divergence</h4>
            <div style="margin-bottom:0.75rem; font-size:0.75rem; color:var(--text-secondary);">Interactive Commitments of Traders (COT) mapping:</div>
            
            <div class="cot-row">
                <span class="cot-label">Commercials</span>
                <div class="cot-bar-outer">
                    <div class="cot-bar-fill commercials" style="width: 75%;"></div>
                </div>
                <span style="width:40px; text-align:right; font-weight:700; color:var(--color-primary);">+75k</span>
            </div>
            
            <div class="cot-row">
                <span class="cot-label">Managed Money</span>
                <div class="cot-bar-outer">
                    <div class="cot-bar-fill managed-money" style="width: 25%;"></div>
                </div>
                <span style="width:40px; text-align:right; font-weight:700; color:var(--color-success);">-68k</span>
            </div>
            
            <div class="cot-row">
                <span class="cot-label">Retail Traders</span>
                <div class="cot-bar-outer">
                    <div class="cot-bar-fill retail" style="width: 90%;"></div>
                </div>
                <span style="width:40px; text-align:right; font-weight:700; color:var(--color-danger);">+90k</span>
            </div>
            <div class="vis-helper-text">Bullish Divergence: Speculators are heavily short, but smart Commercials are heavily long, preparing for short squeeze.</div>
        `;
    } else {
        container.innerHTML = `
            <h4 style="color: white; margin-bottom: 0.5rem;">Natural Gas Daily Routine checklist</h4>
            <div class="vis-checklist-container">
                <div class="vis-checklist-item" onclick="this.classList.toggle('checked')">
                    <div class="vis-checklist-cb"><i class="fa-solid fa-check"></i></div>
                    <span style="font-size:0.75rem;">Pre-market: Review EIA inventory survey</span>
                </div>
                <div class="vis-checklist-item" onclick="this.classList.toggle('checked')">
                    <div class="vis-checklist-cb"><i class="fa-solid fa-check"></i></div>
                    <span style="font-size:0.75rem;">Market hours: Monitor volume spikes</span>
                </div>
                <div class="vis-checklist-item" onclick="this.classList.toggle('checked')">
                    <div class="vis-checklist-cb"><i class="fa-solid fa-check"></i></div>
                    <span style="font-size:0.75rem;">Post-market: Log trade setup, entry, exit, and emotions in journal</span>
                </div>
            </div>
        `;
    }
}

function calculateNatgasDrivers() {
    const wVal = parseInt(document.getElementById("weather-range").value);
    const iVal = parseInt(document.getElementById("inv-range").value);
    
    let wText = "Normal";
    if (wVal === 1) wText = "Extremely Cold (Winter)";
    else if (wVal === 2) wText = "Cold / Normal";
    else if (wVal === 4) wText = "Warm / Normal";
    else if (wVal === 5) wText = "Extremely Hot (Summer)";
    
    let iText = "Normal";
    if (iVal === 1) iText = "Critically Low Storage";
    else if (iVal === 2) iText = "Below Average";
    else if (iVal === 4) iText = "Above Average";
    else if (iVal === 5) iText = "Storage Glut (Oversupply)";
    
    document.getElementById("w-val").innerText = wText;
    document.getElementById("i-val").innerText = iText;
    
    const outlookLabel = document.getElementById("outlook-val");
    if (!outlookLabel) return;
    
    if (wVal === 1 && iVal === 1) {
        outlookLabel.innerText = "PARABOLIC SPIKE RISK";
        outlookLabel.style.color = "var(--color-danger)";
    } else if (wVal === 5 && iVal === 1) {
        outlookLabel.innerText = "HIGHLY BULLISH";
        outlookLabel.style.color = "var(--color-success)";
    } else if (wVal === 4 && iVal === 5) {
        outlookLabel.innerText = "BEARISH DROP RISK";
        outlookLabel.style.color = "var(--color-danger)";
    } else {
        outlookLabel.innerText = "STABLE / SIDEWAYS";
        outlookLabel.style.color = "var(--color-success)";
    }
}

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
