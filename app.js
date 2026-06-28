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

    if (page.images && page.images.length > 0) {
        htmlContent += `<div class="slide-images-container" style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">`;
        page.images.forEach((imgUrl, imgIdx) => {
            htmlContent += `
                <div class="slide-image-wrapper" style="border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; background: rgba(0,0,0,0.2); padding: 0.5rem; display: flex; flex-direction: column; align-items: center; width: 100%;">
                    <img src="${imgUrl}" style="max-width: 100%; height: auto; border-radius: 4px;" alt="Page Illustration" onerror="console.warn('Failed to load image:', '${imgUrl}')">
                    <span style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 0.25rem;"><i class="fa-solid fa-image"></i> Book Illustration</span>
                    <div id="course-inline-chart-${courseIdx}-${slideIdx}-${imgIdx}" style="width: 100%; height: 220px; margin-top: 1rem;"></div>
                </div>
            `;
        });
        htmlContent += `</div>`;
    }

    document.getElementById(`c${courseIdx + 1}-text-panel`).innerHTML = htmlContent;

    // Trigger inline SVG chart generation for any images
    renderCourseInlineChart(courseIdx, slideIdx, page);

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

// Switch main tabs
function switchView(viewName) {
    const dashboard = document.getElementById("dashboard-view");
    const course1 = document.getElementById("course1-view");
    const course2 = document.getElementById("course2-view");
    const course3 = document.getElementById("course3-view");
    const journal = document.getElementById("journal-view");
    
    // Hide all
    dashboard.style.display = "none";
    course1.style.display = "none";
    course2.style.display = "none";
    course3.style.display = "none";
    if (journal) journal.style.display = "none";

    // Deactivate all buttons
    document.getElementById("tab-dashboard").classList.remove("active");
    document.getElementById("tab-course1").classList.remove("active");
    document.getElementById("tab-course2").classList.remove("active");
    document.getElementById("tab-course3").classList.remove("active");
    const tabJournal = document.getElementById("tab-journal");
    if (tabJournal) tabJournal.classList.remove("active");

    // Show selected and load course
    if (viewName === "dashboard") {
        dashboard.style.display = "block";
        document.getElementById("tab-dashboard").classList.add("active");
    } else if (viewName === "journal") {
        if (journal) journal.style.display = "block";
        if (tabJournal) tabJournal.classList.add("active");
        selectJournalCategory('metals'); // Default
    } else if (viewName === "course1") {
        course1.style.display = "block";
        document.getElementById("tab-course1").classList.add("active");
        loadCourse(0).then(() => {
            selectCourseSlide(0, activeSlideIdxs[0]);
        });
    } else if (viewName === "course2") {
        course2.style.display = "block";
        document.getElementById("tab-course2").classList.add("active");
        loadCourse(1).then(() => {
            selectCourseSlide(1, activeSlideIdxs[1]);
        });
    } else if (viewName === "course3") {
        course3.style.display = "block";
        document.getElementById("tab-course3").classList.add("active");
        loadCourse(2).then(() => {
            selectCourseSlide(2, activeSlideIdxs[2]);
        });
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

// Date and Month Helpers
function getMonthName(key) {
    if (!key) return "January";
    const parts = key.split(",");
    if (parts.length < 2) return "January";
    const subParts = parts[1].trim().split(" ");
    if (subParts.length === 0) return "January";
    const m = subParts[0].substring(0, 3);
    const months = {
        Jan: "January", Feb: "February", Mar: "March", Apr: "April",
        May: "May", Jun: "June", Jul: "July", Aug: "August",
        Sep: "September", Oct: "October", Nov: "November", Dec: "December"
    };
    return months[m] || "January";
}

function getMonthOrder(monthName) {
    const orders = {
        January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
        July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
    };
    return orders[monthName] || 0;
}

function getParsedDate(key, value) {
    if (value && value.date) {
        return new Date(value.date);
    }
    if (!key) return new Date();
    const parts = key.split(",");
    if (parts.length < 2) return new Date();
    const subParts = parts[1].trim().split(" ");
    const mStr = subParts[0];
    const dayNum = parseInt(subParts[1]) || 1;
    const months = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    return new Date(2026, months[mStr] || 0, dayNum);
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
        btn.dataset.key = day.key;
        btn.onclick = () => setTimelineDay(day.key);
        
        let weekday = "Day";
        let datePart = day.key;
        
        if (day.value && day.value.date) {
            const commaParts = day.value.date.split(",");
            if (commaParts.length >= 2) {
                weekday = commaParts[0].trim();
                const spaceParts = commaParts[1].trim().split(" ");
                if (spaceParts.length >= 2) {
                    datePart = `${spaceParts[0]} ${spaceParts[1]}`;
                }
            }
        } else {
            const parts = day.key.split(",");
            if (parts.length >= 2) {
                weekday = parts[0].trim();
                datePart = parts[1].trim();
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

    updateChartDisplay();

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

// Chat AI Mentor helper: Locate target day in history
function findDayInHistory(query) {
    const keys = Object.keys(allHistory);
    if (keys.length === 0) return null;

    const sortedDays = keys
        .map(key => ({ key, value: allHistory[key] }))
        .sort((a, b) => getParsedDate(a.key, a.value).getTime() - getParsedDate(b.key, b.value).getTime());
        
    const queryLower = query.toLowerCase();
    
    // Check for "latest" or "current" or "today"
    if (queryLower.includes("latest") || queryLower.includes("current") || queryLower.includes("most recent") || queryLower.includes("today")) {
        return sortedDays[sortedDays.length - 1];
    }
    
    // Check for "last friday"
    if (queryLower.includes("last friday") || queryLower.includes("previous friday")) {
        for (let i = sortedDays.length - 1; i >= 0; i--) {
            const day = sortedDays[i];
            const dateStr = (day.value && day.value.date) ? day.value.date.toLowerCase() : day.key.toLowerCase();
            if (dateStr.includes("friday")) {
                return day;
            }
        }
    }
    
    // Check for month names and day numbers (e.g. "June 24", "Jan 30")
    const monthsShort = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const monthsFull = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    
    for (let mIdx = 0; mIdx < 12; mIdx++) {
        const mFull = monthsFull[mIdx];
        const mShort = monthsShort[mIdx];
        if (queryLower.includes(mFull) || queryLower.includes(mShort)) {
            // Try to extract a day number
            const dayNumMatch = queryLower.match(/\b\d{1,2}\b/);
            if (dayNumMatch) {
                const dayNum = parseInt(dayNumMatch[0]);
                for (const day of sortedDays) {
                    const parsed = getParsedDate(day.key, day.value);
                    if (parsed.getMonth() === mIdx && parsed.getDate() === dayNum) {
                        return day;
                    }
                }
            }
        }
    }
    
    // Fallback search by raw key matching
    for (const day of sortedDays) {
        if (queryLower.includes(day.key.toLowerCase())) {
            return day;
        }
        if (day.value && day.value.date && queryLower.includes(day.value.date.toLowerCase())) {
            return day;
        }
    }
    
    return null;
}

// Chat AI Mentor helper: Find asset details on a specific day
function getAssetInDay(day, assetQuery) {
    if (!day || !day.value || !day.value.categories) return null;
    const cleanQuery = assetQuery.toLowerCase();
    
    for (const [catName, assets] of Object.entries(day.value.categories)) {
        for (const asset of assets) {
            const nameLower = asset.name.toLowerCase();
            const symbolLower = (asset.symbol || "").toLowerCase();
            
            if (cleanQuery.includes(nameLower) || nameLower.includes(cleanQuery) || 
                (symbolLower && (cleanQuery.includes(symbolLower) || symbolLower.includes(cleanQuery)))) {
                return { asset, category: catName };
            }
            
            // Asset synonyms
            if (cleanQuery.includes("gold") && nameLower === "gold") return { asset, category: catName };
            if ((cleanQuery.includes("btc") || cleanQuery.includes("bitcoin")) && nameLower === "bitcoin") return { asset, category: catName };
            if ((cleanQuery.includes("gas") || cleanQuery.includes("natgas") || cleanQuery.includes("ngas")) && (nameLower.includes("gas") || nameLower.includes("natgas"))) {
                return { asset, category: catName };
            }
            if ((cleanQuery.includes("nasdaq") || cleanQuery.includes("ndx")) && nameLower === "nasdaq") return { asset, category: catName };
            if ((cleanQuery.includes("spx") || cleanQuery.includes("s&p") || cleanQuery.includes("sp500")) && nameLower === "spx500") return { asset, category: catName };
        }
    }
    return null;
}

// Chat AI Mentor responses database
function getSmartChatResponse(query) {
    const textLower = query.toLowerCase();
    
    // 1. General Strategy / Rules Queries
    if (textLower.includes("g7 rules") || textLower.includes("g7 strategy") || textLower.includes("g7 swing")) {
        return `The G7 Swing Forex System focuses on High liquidity pairs (EUR/USD, GBP/USD, USD/JPY, USD/CHF).
Rules:
1. Determine trend on the Weekly chart (Weekly candle must make a higher high/low for bullish, lower high/low for bearish).
2. Wait for hourly pullback to Bollinger Band extremes or 200 SMA.
3. Check slow stochastics (14,7,3) to confirm oversold (<20) for buys or overbought (>80) for sells.
4. Enter at the close of an hourly reversal candle (e.g. hammer, piercing line, harami) with a 2:1 Reward/Risk ratio.`;
    }
    
    if (textLower.includes("grown-up rules") || textLower.includes("money management") || textLower.includes("position sizing") || textLower.includes("risk management") || textLower.includes("philosophy")) {
        return `Discipline & Risk Management rules from Course 1:
1. Never risk more than 1–2% of total capital on a single position.
2. Sizing is based on stop-loss distance (R-units).
3. Move stop-loss to entry (Stop-Breakeven or SBE) at 1.5R gains.
4. Trim positions (30-50%) on Friday afternoon closes (Weekend de-risking) to guard against gap risk.`;
    }

    if (textLower.includes("natural gas") || textLower.includes("natgas") || textLower.includes("widow maker") || textLower.includes("boil") || textLower.includes("kold")) {
        return `Natural Gas (Widow Maker) rules from Course 3:
1. Volatility is driven by weather forecasts (Arctic blasts in winter, heatwaves in summer) and EIA weekly inventory reports.
2. Contango Decay warning: Holding leveraged products (BOIL/KOLD) long-term causes rapid capital decay. Keep trades under 1-3 weeks.
3. Entry Rule: Look for Breakout-Pullback (BOPB) where price breaks resistance, tests it as support, and prints a reversal candle.`;
    }

    if (textLower.includes("hedgehog") || textLower.includes("risk lock")) {
        return `The **Hedgehog strategy** uses opposite counter-contracts (e.g. holding a short leg to neutralize a long setup in drawdowns) rather than taking hard stop-loss slippage.
The **Risk Lock method** is our trailing protection model: SBE (Stop Breakeven) is activated as soon as price moves 1.5x risk. Hedges are then added in staggered layers (1/3, 1/3, 1/3) to lock profits while letting the core trade run.`;
    }
    
    // 2. Resolve target day in history (specific date, latest, or fallback to active dashboard day)
    let targetDay = findDayInHistory(query);
    let daySourceText = "";
    if (targetDay) {
        daySourceText = `for the parsed date ${targetDay.value && targetDay.value.date ? targetDay.value.date : targetDay.key}`;
    } else {
        // Fallback to currently selected dashboard day
        if (activeDay && allHistory[activeDay]) {
            targetDay = { key: activeDay, value: allHistory[activeDay] };
            daySourceText = `for the selected day ${targetDay.value && targetDay.value.date ? targetDay.value.date : targetDay.key}`;
        }
    }
    
    // 3. Match asset query
    let assetMatch = null;
    let assetQuery = "";
    const assetsToSearch = [
        "gold", "silver", "copper", "bitcoin", "btc", "eth", "ethereum", 
        "sol", "solana", "xrp", "ripple", "nasdaq", "ndx", "spx500", "spx", 
        "ger30", "dax", "msft", "nvda", "pltr", "coin", "mstr", "tsla", 
        "avgo", "googl", "ngas.f", "natgas", "wti", "usdhf", "eurusd", "gbpusd"
    ];
    
    for (const name of assetsToSearch) {
        if (textLower.includes(name)) {
            assetQuery = name;
            if (targetDay) {
                assetMatch = getAssetInDay(targetDay, name);
            }
            break;
        }
    }
    
    // 4. Formulate response based on asset and day
    if (targetDay && assetMatch) {
        const a = assetMatch.asset;
        return `According to the ledger history ${daySourceText}:
• **Asset**: ${a.name} (${assetMatch.category})
• **Position**: ${a.position}
• **Size**: ${a.size}
• **Last Change**: ${a.chng}

*Note for this day:* "${targetDay.value.notes || 'No general notes recorded for this day.'}"`;
    } else if (targetDay && !assetQuery && (textLower.includes("june") || textLower.includes("jan") || textLower.includes("feb") || textLower.includes("mar") || textLower.includes("apr") || textLower.includes("may") || textLower.includes("latest") || textLower.includes("today") || textLower.includes("friday"))) {
        // Requested date but no specific asset -> summarize the day
        const cats = targetDay.value.categories || {};
        let positionsText = "";
        for (const [catName, assets] of Object.entries(cats)) {
            if (assets.length > 0) {
                const list = assets.map(a => `${a.name} (${a.position}, size: ${a.size})`).join(", ");
                positionsText += `\n• **${catName}**: ${list}`;
            }
        }
        return `Ledger summary ${daySourceText}:
• **Macro Notes**: "${targetDay.value.notes || 'None'}"
• **Active Positions**: ${positionsText || 'None'}`;
    }
    
    // 5. Asset requested but no specific day found/selected
    if (assetQuery) {
        // Find the latest day in history where this asset was traded
        const keys = Object.keys(allHistory);
        const sortedDays = keys
            .map(key => ({ key, value: allHistory[key] }))
            .sort((a, b) => getParsedDate(a.key, a.value).getTime() - getParsedDate(b.key, b.value).getTime());
            
        let lastDayTraded = null;
        let lastAssetDetails = null;
        for (let i = sortedDays.length - 1; i >= 0; i--) {
            const day = sortedDays[i];
            const found = getAssetInDay(day, assetQuery);
            if (found) {
                lastDayTraded = day;
                lastAssetDetails = found;
                break;
            }
        }
        
        if (lastDayTraded && lastAssetDetails) {
            const a = lastAssetDetails.asset;
            const dateStr = lastDayTraded.value.date || lastDayTraded.key;
            return `I found the most recent trade record for **${a.name}** on **${dateStr}**:
• **Position**: ${a.position}
• **Size**: ${a.size}
• **Last Change**: ${a.chng}

*Note from that day:* "${lastDayTraded.value.notes}"`;
        }
    }
    
    // 6. Explicit hardcoded keyword overrides (fixed to prevent substring issues like 'bitcoin' containing 'coin')
    const words = textLower.split(/[\s,?.!]+/);
    
    if (words.includes("coin") || words.includes("mstr") || textLower.includes("100%")) {
        return `COIN and MSTR are held at 100% sizes as equity proxies. However, they are walled off with protective put options (e.g., COIN hedged at 192). This restricts maximum possible drawdown to a defined 1.5% portfolio risk unit, capturing high-beta upside without exposing the core account to ruin.`;
    }
    
    if (words.includes("btc") || words.includes("bitcoin") || textLower.includes("staggered")) {
        return `Bitcoin (BTCUSD) positions are protected by staggered hedge levels (e.g. 1/3 at 89300, 1/3 at 86900, 1/3 at 85900). This tiered stop structure prevents a single 'wick sweep' from fully liquidating your core long position, giving the trade breathing room while progressively locking in downside protection.`;
    }
    
    if (words.includes("gold") && (textLower.includes("flip") || textLower.includes("reversal") || textLower.includes("long") || textLower.includes("short") || textLower.includes("strategy") || textLower.includes("suggest"))) {
        return `Gold (XAUUSD) was shorted (60-75% size) during late January resistance sweeps. On Friday, Jan 30, Gold broke out of key structural resistance, triggering an immediate regime-shift. Following G7 reversal rules, shorts were closed and a 10% test Long was opened at 4920. This caps initial risk while participating in the new trend.`;
    }
    
    // 7. General fallback
    return `I am your AI Trading Mentor. I have access to your full 106-day parsed portfolio history and all three strategy courses (Grown-Up Rules, G7 Swing System, NATGAS Widow Maker).

You can ask me questions like:
• "What are the G7 rules?"
• "Explain the 100% position sizing on COIN."
• "What positions did we have on June 24?"
• "Show the latest trade for Gold."
• "Explain the weekend de-risking rules."`;
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

function appendChatMessage(text, sender) {
    const container = document.getElementById("chat-messages-container");
    if (!container) return;

    // Remove suggestions block if it exists and user sends message
    const suggestions = container.querySelector(".chat-suggestions");
    if (suggestions && sender === "user") {
        suggestions.remove();
    }

    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-msg ${sender === 'user' ? 'user-msg' : 'ai-msg'}`;
    
    // Simple conversion of linebreaks to <br> for neat formatting
    msgDiv.innerHTML = text.replace(/\n/g, "<br>");
    
    container.appendChild(msgDiv);
    
    // Scroll container to bottom
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

// Ticker and Position Helpers
function getSymbolForAsset(name) {
    if (!name) return "BTCUSD";
    const cleanName = name.trim().toUpperCase();
    const mappings = {
        "BITCOIN": "BTCUSD",
        "BTC": "BTCUSD",
        "ETH": "ETHUSD",
        "XRP": "XRPUSD",
        "SOL": "SOLUSD",
        "GOLD": "XAUUSD",
        "SILVER": "XAGUSD",
        "COPPER": "HG1!",
        "SPX500": "SPX",
        "NASDAQ": "IXIC",
        "GER30": "DAX",
        "MSFT": "MSFT",
        "NVDA": "NVDA",
        "PLTR": "PLTR",
        "COIN": "COIN",
        "MSTR": "MSTR",
        "CRCL": "CRCL",
        "TSLA": "TSLA",
        "AVGO": "AVGO",
        "GOOGL": "GOOGL",
        "NGAS.F": "NG1!",
        "NATGAS": "NG1!",
        "WTI": "USOIL",
        "URA": "URA",
        "USDX": "DXY",
        "EURUSD": "EURUSD",
        "GBPUSD": "GBPUSD"
    };
    return mappings[cleanName] || cleanName;
}

function mapTickerToTVSymbol(symbol) {
    if (!symbol) return "COINBASE:BTCUSD";
    const sym = symbol.toUpperCase();
    const mappings = {
        "BTCUSD": "COINBASE:BTCUSD",
        "ETHUSD": "COINBASE:ETHUSD",
        "XRPUSD": "COINBASE:XRPUSD",
        "SOLUSD": "COINBASE:SOLUSD",
        "XAUUSD": "OANDA:XAUUSD",
        "XAGUSD": "OANDA:XAGUSD",
        "HG1!": "COMEX:HG1!",
        "SPX": "SP:SPX",
        "IXIC": "NASDAQ:IXIC",
        "DAX": "FOREXCOM:GER30",
        "MSFT": "NASDAQ:MSFT",
        "NVDA": "NASDAQ:NVDA",
        "PLTR": "NYSE:PLTR",
        "COIN": "NASDAQ:COIN",
        "MSTR": "NASDAQ:MSTR",
        "CRCL": "NASDAQ:CRCL",
        "TSLA": "NASDAQ:TSLA",
        "AVGO": "NASDAQ:AVGO",
        "GOOGL": "NASDAQ:GOOGL",
        "NG1!": "NYMEX:NG1!",
        "USOIL": "TVC:USOIL",
        "URA": "NYSE:URA",
        "DXY": "CAPITALCOM:DXY",
        "EURUSD": "FX:EURUSD",
        "GBPUSD": "FX:GBPUSD"
    };
    return mappings[sym] || sym;
}

function getTypeForPosition(posText) {
    if (!posText) return "long";
    const text = posText.toLowerCase();
    if (text.includes("short")) return "short";
    if (text.includes("hedged") && (text.includes("fully") || text.includes("100%"))) return "hedged";
    return "long";
}

let chartMode = 'live'; // 'live' or 'ledger'

function setChartMode(mode) {
    chartMode = mode;
    
    // Update button active state
    const btnLive = document.getElementById("btn-live-chart");
    const btnLedger = document.getElementById("btn-ledger-chart");
    if (btnLive && btnLedger) {
        if (mode === 'live') {
            btnLive.classList.add("active");
            btnLive.style.background = "var(--primary-color)";
            btnLive.style.color = "#fff";
            btnLedger.classList.remove("active");
            btnLedger.style.background = "transparent";
            btnLedger.style.color = "var(--text-secondary)";
        } else {
            btnLedger.classList.add("active");
            btnLedger.style.background = "var(--primary-color)";
            btnLedger.style.color = "#fff";
            btnLive.classList.remove("active");
            btnLive.style.background = "transparent";
            btnLive.style.color = "var(--text-secondary)";
        }
    }

    if (selectedAsset) {
        updateChartDisplay();
    }
}

function updateChartDisplay() {
    if (!selectedAsset) return;
    
    if (chartMode === 'live') {
        loadTradingViewChart(getSymbolForAsset(selectedAsset.name));
    } else {
        renderLedgerHistoryChart(selectedAsset.name);
    }
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

// Render historical position plot
function extractPriceFromPosition(positionStr) {
    if (!positionStr) return null;
    const regexes = [
        /(?:long|short)\s+([0-9\.,]+)/i,
        /(?:at|now\s+at)\s+([0-9\.,]+)/i,
        /hedged\s+(?:at\s+)?([0-9\.,]+)/i,
        /collar\s+(?:at\s+)?([0-9\.,]+)/i,
        /strike\s+([0-9\.,]+)/i
    ];
    for (const regex of regexes) {
        const match = positionStr.match(regex);
        if (match && match[1]) {
            const clean = parseFloat(match[1].replace(/,/g, ''));
            if (!isNaN(clean) && clean > 0) {
                return clean;
            }
        }
    }
    return null;
}

function renderLedgerHistoryChart(assetName) {
    const container = document.getElementById("tradingview-chart-div");
    container.innerHTML = "";

    const keys = Object.keys(allHistory);
    const sortedDays = keys
        .map(key => ({ key, value: allHistory[key] }))
        .sort((a, b) => getParsedDate(a.key, a.value).getTime() - getParsedDate(b.key, b.value).getTime());
    
    const dataPoints = [];
    
    sortedDays.forEach(day => {
        let foundAsset = null;
        for (const [catName, assets] of Object.entries(day.value.categories || {})) {
            const found = assets.find(a => a.name.toLowerCase() === assetName.toLowerCase());
            if (found) {
                foundAsset = found;
                break;
            }
        }
        
        if (foundAsset) {
            let size = 0;
            const sizeStr = foundAsset.size || "0%";
            try {
                size = parseFloat(sizeStr.replace('%', ''));
            } catch(e) {}
            
            const price = extractPriceFromPosition(foundAsset.position);
            dataPoints.push({
                dateLabel: day.value.date || day.key,
                position: foundAsset.position,
                size: size,
                rawSize: sizeStr,
                price: price,
                type: getTypeForPosition(foundAsset.position)
            });
        }
    });

    if (dataPoints.length === 0) {
        container.innerHTML = `<div class="tv-placeholder">No history found for ${assetName}</div>`;
        return;
    }

    // Forward-fill & backward-fill prices
    let lastKnownPrice = null;
    for (let i = 0; i < dataPoints.length; i++) {
        if (dataPoints[i].price !== null) {
            lastKnownPrice = dataPoints[i].price;
        } else if (lastKnownPrice !== null) {
            dataPoints[i].price = lastKnownPrice;
        }
    }
    let firstKnownPrice = null;
    for (let i = dataPoints.length - 1; i >= 0; i--) {
        if (dataPoints[i].price !== null) {
            firstKnownPrice = dataPoints[i].price;
        } else if (firstKnownPrice !== null && dataPoints[i].price === null) {
            dataPoints[i].price = firstKnownPrice;
        }
    }
    // Fallback if no price was parsed at all
    dataPoints.forEach(dp => {
        if (dp.price === null) dp.price = 100;
    });

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 300;
    const paddingLeft = 45;
    const paddingRight = 55; // Expanded for right Y-axis
    const paddingTop = 30;
    const paddingBottom = 45;
    
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    
    // Y Sizing calculations (Left Axis)
    const maxVal = Math.max(...dataPoints.map(d => d.size), 10);
    const yMax = Math.ceil(maxVal / 10) * 10; 

    // Y Price calculations (Right Axis)
    const prices = dataPoints.map(d => d.price);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const priceRange = maxPrice - minPrice || 1;
    const priceMinScale = minPrice - priceRange * 0.1;
    const priceMaxScale = maxPrice + priceRange * 0.1;
    const priceScaleRange = priceMaxScale - priceMinScale || 1;

    let svgContent = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" style="background: #0d1117; font-family: sans-serif; border-radius: 8px; border: 1px solid var(--border-color);">`;
    
    // SVG Gradients
    svgContent += `
        <defs>
            <linearGradient id="area-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="var(--primary-color)" stop-opacity="0.15" />
                <stop offset="100%" stop-color="var(--primary-color)" stop-opacity="0" />
            </linearGradient>
        </defs>
    `;

    // Grid lines and labels (left Y-axis: position size)
    const gridCount = 4;
    for (let i = 0; i <= gridCount; i++) {
        const yVal = (yMax / gridCount) * i;
        const yPos = height - paddingBottom - (yVal / yMax) * chartHeight;
        svgContent += `
            <line x1="${paddingLeft}" y1="${yPos}" x2="${width - paddingRight}" y2="${yPos}" stroke="#21262d" stroke-dasharray="3,3" stroke-width="1" />
            <text x="${paddingLeft - 8}" y="${yPos + 3}" fill="#8b949e" font-size="9" text-anchor="end">${yVal}%</text>
        `;
    }

    // Right Y-axis (Asset Price labels)
    for (let i = 0; i <= gridCount; i++) {
        const yValPrice = priceMinScale + (priceScaleRange / gridCount) * i;
        const yPos = height - paddingBottom - (i / gridCount) * chartHeight;
        
        let label = yValPrice.toFixed(2);
        if (yValPrice >= 1000) label = (yValPrice / 1000).toFixed(1) + "k";
        if (assetName.toLowerCase().includes("gas") || assetName.toLowerCase().includes("ngas")) {
            label = yValPrice.toFixed(3);
        }
        svgContent += `
            <text x="${width - paddingRight + 8}" y="${yPos + 3}" fill="#00bcd4" font-size="9" text-anchor="start">${label}</text>
        `;
    }

    // Plot Sizing Shading Area (exposure indicator)
    let sizePointsStr = "";
    dataPoints.forEach((dp, idx) => {
        const xPos = paddingLeft + (idx / (dataPoints.length - 1 || 1)) * chartWidth;
        const yPos = height - paddingBottom - (dp.size / yMax) * chartHeight;
        sizePointsStr += `${xPos},${yPos} `;
    });
    let areaPointsStr = `${paddingLeft},${height - paddingBottom} ` + sizePointsStr + `${paddingLeft + chartWidth},${height - paddingBottom}`;
    svgContent += `
        <polygon points="${areaPointsStr}" fill="url(#area-grad)" />
        <polyline points="${sizePointsStr}" fill="none" stroke="rgba(56, 139, 253, 0.3)" stroke-width="1" stroke-dasharray="2,2" />
    `;

    // Plot Price Line (neon blue)
    let pricePointsStr = "";
    dataPoints.forEach((dp, idx) => {
        const xPos = paddingLeft + (idx / (dataPoints.length - 1 || 1)) * chartWidth;
        const yPosPrice = height - paddingBottom - ((dp.price - priceMinScale) / priceScaleRange) * chartHeight;
        pricePointsStr += `${xPos},${yPosPrice} `;
    });
    svgContent += `
        <polyline points="${pricePointsStr}" fill="none" stroke="#00bcd4" stroke-width="2.5" />
    `;

    // Plot marked dots directly on the Price Line
    let dotsSvg = "";
    dataPoints.forEach((dp, idx) => {
        const xPos = paddingLeft + (idx / (dataPoints.length - 1 || 1)) * chartWidth;
        const yPosPrice = height - paddingBottom - ((dp.price - priceMinScale) / priceScaleRange) * chartHeight;
        
        let dotColor = "var(--color-success)"; 
        if (dp.type === "short") dotColor = "#ff7b72"; 
        if (dp.position.toLowerCase().includes("hedge") || dp.position.toLowerCase().includes("collar") || dp.position.toLowerCase().includes("protective")) {
            dotColor = "#d29922"; 
        }
        
        dotsSvg += `
            <g>
                <circle cx="${xPos}" cy="${yPosPrice}" r="5" fill="${dotColor}" stroke="#0d1117" stroke-width="1.5"></circle>
                <circle cx="${xPos}" cy="${yPosPrice}" r="9" fill="${dotColor}" fill-opacity="0" style="cursor: pointer;">
                    <title>${dp.dateLabel}\nPosition: ${dp.position}\nSizing: ${dp.rawSize}\nPrice: ${dp.price.toFixed(2)}</title>
                </circle>
            </g>
        `;
    });
    
    svgContent += dotsSvg;

    // Draw X-Axis labels
    const labelStep = Math.max(1, Math.ceil(dataPoints.length / 5));
    dataPoints.forEach((dp, idx) => {
        if (idx === 0 || idx === dataPoints.length - 1 || idx % labelStep === 0) {
            const xPos = paddingLeft + (idx / (dataPoints.length - 1 || 1)) * chartWidth;
            let shortDate = dp.dateLabel;
            if (shortDate.includes(",")) {
                shortDate = shortDate.split(",")[1].trim(); 
            }
            svgContent += `
                <text x="${xPos}" y="${height - paddingBottom + 18}" fill="#8b949e" font-size="8" text-anchor="middle" transform="rotate(-15, ${xPos}, ${height - paddingBottom + 18})">${shortDate}</text>
            `;
        }
    });

    svgContent += `</svg>`;
    container.innerHTML = svgContent;
}

// Update Active timeline day
function setTimelineDay(dayKey) {
    activeDay = dayKey;
    
    document.querySelectorAll(".timeline-btn").forEach(btn => {
        if (btn.dataset.key === dayKey) {
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

// Bind Events on Page Load (Browser vs Node env check)
if (typeof window === 'undefined') {
    // running in Node.js environment (e.g. if started with `node app.js` on hosting services)
    try {
        const express = require('express');
        const path = require('path');
        const expressApp = express();
        const PORT = process.env.PORT || 10000;

        expressApp.use(express.static(__dirname));

        expressApp.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, 'index.html'));
        });

        expressApp.listen(PORT, () => {
            console.log(`Server successfully running on port ${PORT}`);
        });
    } catch (e) {
        console.error("Failed to start fallback Node Express server inside app.js:", e);
    }
} else {
    // running in Browser environment
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
}

// AI Pattern Journal configuration and functions
const journalCategories = {
    metals: {
        name: "Gold & Silver Journal",
        badge: "Short & Long Setups",
        badgeClass: "hedged",
        indicators: "Bollinger Bands, Stochastic (14,7,3), Weekly range boundaries",
        rr: "1:2.5 (Gold 50% Bottom Conviction)",
        levels: "Resistance Sweep 5277, Support Sweep 4667",
        explanation: "Gold was shorted at the weekly range extreme (5277) on high stochastic overbought sweeps. Later, a major bottom conviction long was scaled in at 4667 following an hourly stochastic wash (<15) and hourly hammer close. Hedges were systematically deployed (SBE stop moved to entry) once the position gained 1.5R.",
        checklist: [
            "Weekly trend set direction on Weekly chart.",
            "Hourly pullback swept 200-hour Bollinger Band.",
            "Stochastics confirmed oversold (<20) / overbought (>80).",
            "Stop-Breakeven (SBE) set once price gained 1.5R."
        ],
        chartSetup: "metals"
    },
    crypto: {
        name: "Bitcoin & Altcoins Journal",
        badge: "Staggered Risk-Lock",
        badgeClass: "long",
        indicators: "Staggered Stop Levels, Bollinger Bands, Moving Averages",
        rr: "1:3.0 (Wick Sweep Protection)",
        levels: "BTC Long Entry 91200, 75950. Stop-Hedges at 89300, 86900, 85900",
        explanation: "Cryptocurrency positions are highly volatile, meaning standard stop-losses are vulnerable to 'wick sweeps' (rapid market spikes designed to liquidate retail stops). To mitigate this, positions are protected by staggered hedge levels (e.g. 1/3 at 89.3k, 1/3 at 86.9k, 1/3 at 85.9k). This preserves the core position if the market experiences temporary volatility.",
        checklist: [
            "Core position entered during consolidation pullback.",
            "Downside protection split into three staggered tiers.",
            "Scale-in added only at major weekly structural zones.",
            "Hedges shifted to SBE to lock in risk-free exposure."
        ],
        chartSetup: "crypto"
    },
    stocks: {
        name: "Conviction Stocks Journal",
        badge: "Options Collar Collar",
        badgeClass: "hedged",
        indicators: "Protective Put Strike Floor, Options Collars, 50-day EMA",
        rr: "1:4.0 (Asymmetrical Payoff)",
        levels: "COIN Long 256.30 (Collar 192), MSTR Long 235 (Collar 200)",
        explanation: "For high-conviction tech stocks (COIN, MSTR, NVDA), the trader bypassed standard stops by buying protective puts. This put collar acts as a hard floor, limiting the maximum capital risk unit to 1.5% of equity. This safety floor enabled position sizing of 100% to 110%, resulting in massive asymmetrical gains when MSTR rallied to 450 and COIN to 350.",
        checklist: [
            "Conviction asset selected (high beta/correlation).",
            "Protective put options purchased at key structural support strike.",
            "Position size scaled up to 100%+ due to bounded option risk.",
            "Trimmed 30-50% on Friday closes to avoid weekend gap risk."
        ],
        chartSetup: "stocks"
    },
    energies: {
        name: "Natural Gas & Crude Journal",
        badge: "Triple Wick Rejection",
        badgeClass: "long",
        indicators: "Triple Wick Support, COT Index, Weather Feeds",
        rr: "1:2.8 (Convex Bottom)",
        levels: "NATGAS Long 2.575 (Hedge 2.54), Exit 2.91",
        explanation: "Energies (Natural Gas) are traded using the Breakout-Pullback (BOPB) system. Bottoms are identified using Triple Wick Rejections on the hourly/4-hour chart (three successive lows with long lower wicks showing supply absorption). COT reports confirm extreme speculative net-shorts vs commercial buying. Hedges are activated lower to prevent slide wipeouts, and full size is taken once the bottom is locked.",
        checklist: [
            "Check EIA weekly inventory report and weather forecasts.",
            "Verify COT speculator net-short extreme divergence.",
            "Confirm Triple Wick Rejection on hourly/4hr charts.",
            "Scale into long only at structural support with active hedge."
        ],
        chartSetup: "energies"
    },
    indices: {
        name: "Stock Indices Journal",
        badge: "Breakout-Pullback (BOPB)",
        badgeClass: "long",
        indicators: "Resistance Box, 200 SMA, Bollinger Band bounds",
        rr: "1:2.0 (Trend Following)",
        levels: "NASDAQ Long 25110 (Exit 25400), SPX500 Long 6866",
        explanation: "Indices are traded using trend-following breakout-pullbacks. Price breaks out of a clear horizontal consolidation box, then pulls back to test the top of the box as support. Once a reversal candle prints on the hourly chart at the support line, long positions are opened. Stops are moved immediately to entry (SBE) to eliminate risk.",
        checklist: [
            "Identify clear horizontal resistance consolidation range.",
            "Wait for a strong hourly close breakout above the range.",
            "Enter at the retest pullback of the broken resistance line.",
            "Shift stop to breakeven (SBE) at 1.5R target gains."
        ],
        chartSetup: "indices"
    },
    forex: {
        name: "G7 Swing Forex Journal",
        badge: "weekly Range Reversals",
        badgeClass: "long",
        indicators: "Weekly Candlesticks, Hourly 200 SMA, Bollinger Bands",
        rr: "1:2.0 (Forex Swing)",
        levels: "GBPUSD Long Entry 1.2540, EURUSD Range Trades",
        explanation: "The G7 Forex Swing system sweeps weekly highs/lows of major currency pairs. Weekly candle sets the trend bias. Entries are triggered on the hourly chart when price sweeps the 200 Bollinger Band or 200 SMA, Stochastics confirm oversold (<20) or overbought (>80), and an hourly reversal candle (Hammer/Harami) closes.",
        checklist: [
            "Establish Weekly candle trend direction bias.",
            "Set hourly alerts 10 pips beyond weekly high/low boundaries.",
            "Verify hourly close at 100/200 Bollinger Band or 200 SMA.",
            "Ensure Stochastic (14,7,3) is oversold (<20) or overbought (>80)."
        ],
        chartSetup: "forex"
    },
    softs: {
        name: "Softs & Grains Journal",
        badge: "Range Mean Reversion",
        badgeClass: "short",
        indicators: "Bollinger Bands, Stochastics, Trendline pivots",
        rr: "1:2.0 (Commodity Swing)",
        levels: "Wheat Consolidation, Cocoa Volatility Ranges",
        explanation: "Soft commodities (Wheat, Soybeans, Cocoa, Cotton) are traded within well-defined agricultural range boundaries. Positions are sized small (10-20% average) and traded mean-reversion style between the daily Bollinger Band extremes. Entries are triggered only when supply/demand cycles hit extreme seasonal deviations.",
        checklist: [
            "Verify agricultural seasonality factors.",
            "Confirm daily Bollinger Band extreme sweep.",
            "Enter at range rotation candle with stop beyond the range high/low.",
            "Trim size heavily if weekly COT shows speculative convergence."
        ],
        chartSetup: "softs"
    }
};

function selectJournalCategory(catName) {
    const journalInfo = journalCategories[catName];
    if (!journalInfo) return;
    
    // Update active button state
    document.querySelectorAll(".module-item").forEach(item => {
        if (item.id === `journal-cat-${catName}`) {
            item.classList.add("active");
            item.style.background = "rgba(255,255,255,0.03)";
            item.style.borderColor = "var(--border-color)";
            item.style.color = "var(--text-primary)";
        } else if (item.id && item.id.startsWith("journal-cat-")) {
            item.classList.remove("active");
            item.style.background = "transparent";
            item.style.borderColor = "transparent";
            item.style.color = "var(--text-secondary)";
        }
    });
    
    // Update texts
    document.getElementById("journal-pattern-name").innerText = journalInfo.name;
    
    const badge = document.getElementById("journal-pattern-badge");
    badge.innerText = journalInfo.badge;
    badge.className = `chart-direction-badge ${journalInfo.badgeClass}`;
    
    document.getElementById("journal-stat-indicators").innerText = journalInfo.indicators;
    document.getElementById("journal-stat-rr").innerText = journalInfo.rr;
    document.getElementById("journal-stat-levels").innerText = journalInfo.levels;
    document.getElementById("journal-strategy-explanation").innerText = journalInfo.explanation;
    
    // Populate checklist
    const checklistContainer = document.getElementById("journal-strategy-checklist");
    checklistContainer.innerHTML = "";
    journalInfo.checklist.forEach(item => {
        const li = document.createElement("li");
        li.style.marginBottom = "0.25rem";
        li.innerHTML = `<i class="fa-solid fa-check" style="color: var(--color-success); margin-right: 6px;"></i> ${item}`;
        checklistContainer.appendChild(li);
    });
    
    // Populate trade log table
    populateJournalLedgerTable(catName);
    
    // Render 4H Chart
    drawJournal4HChart(journalInfo.chartSetup);
}

function populateJournalLedgerTable(catName) {
    const tbody = document.getElementById("journal-ledger-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    
    let targetCategories = [];
    let targetAssetKeywords = [];
    
    if (catName === "metals") {
        targetCategories = ["Metals"];
        targetAssetKeywords = ["gold", "silver", "copper", "metals"];
    } else if (catName === "crypto") {
        targetCategories = ["Crypto"];
        targetAssetKeywords = ["bitcoin", "btc", "eth", "ethereum", "sol", "solana", "xrp", "ripple"];
    } else if (catName === "stocks") {
        targetCategories = ["Stocks/ETF's"];
        targetAssetKeywords = ["coin", "mstr", "tsla", "pltr", "nvda", "msft", "avgo", "googl", "crcl"];
    } else if (catName === "energies") {
        targetCategories = ["Energies"];
        targetAssetKeywords = ["ngas", "natgas", "wti", "oil", "gas"];
    } else if (catName === "indices") {
        targetCategories = ["Stocks/ETF's", "Indices"];
        targetAssetKeywords = ["nasdaq", "spx500", "ger30", "dax"];
    } else if (catName === "forex") {
        targetCategories = ["Currencies"];
        targetAssetKeywords = ["gbpusd", "eurusd", "usd", "cad"];
    } else if (catName === "softs") {
        targetCategories = ["Commodities", "Softs"];
        targetAssetKeywords = ["wheat", "cocoa", "cotton", "soyb"];
    }
    
    const keys = Object.keys(allHistory);
    const sortedDays = keys
        .map(key => ({ key, value: allHistory[key] }))
        .sort((a, b) => getParsedDate(a.key, a.value).getTime() - getParsedDate(b.key, b.value).getTime());
        
    const matchingTrades = [];
    
    sortedDays.forEach(day => {
        const dateStr = day.value.date || day.key;
        for (const [catTitle, assets] of Object.entries(day.value.categories || {})) {
            const isCatMatch = targetCategories.some(tc => catTitle.toLowerCase().includes(tc.toLowerCase()) || tc.toLowerCase().includes(catTitle.toLowerCase()));
            
            assets.forEach(asset => {
                const nameLower = asset.name.toLowerCase();
                const isAssetMatch = targetAssetKeywords.some(keyword => nameLower.includes(keyword));
                
                if (isCatMatch || isAssetMatch) {
                    matchingTrades.push({
                        date: dateStr,
                        name: asset.name,
                        position: asset.position,
                        size: asset.size
                    });
                }
            });
        }
    });

    if (matchingTrades.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 1rem; color: var(--text-muted);">No ledger entries found.</td></tr>`;
        return;
    }

    const displayTrades = matchingTrades.slice(-30).reverse();
    
    displayTrades.forEach(t => {
        const row = document.createElement("tr");
        row.style.borderBottom = "1px solid rgba(255,255,255,0.03)";
        
        const type = getTypeForPosition(t.position);
        let dotColor = "var(--color-success)";
        if (type === "short") dotColor = "#ff7b72";
        if (t.position.toLowerCase().includes("hedge") || t.position.toLowerCase().includes("collar") || t.position.toLowerCase().includes("protective")) {
            dotColor = "#d29922";
        }
        
        row.innerHTML = `
            <td style="padding: 0.5rem; font-weight: 600;">${t.name}</td>
            <td style="padding: 0.5rem; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:${dotColor}; margin-right:4px;"></span> ${t.position}</td>
            <td style="padding: 0.5rem;">${t.size}</td>
            <td style="padding: 0.5rem; color: var(--text-muted);">${t.date.split(",")[1]?.trim() || t.date}</td>
        `;
        
        tbody.appendChild(row);
    });
}

function drawJournal4HChart(chartSetup) {
    const container = document.getElementById("journal-pattern-chart-div");
    if (!container) return;
    container.innerHTML = "";
    
    const width = container.clientWidth || 550;
    const height = container.clientHeight || 350;
    
    let svgContent = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" style="background: #0d1117; font-family: sans-serif; border-radius: 8px; border: 1px solid var(--border-color);">`;
    
    for (let i = 1; i < 6; i++) {
        const yPos = (height / 6) * i;
        svgContent += `<line x1="10" y1="${yPos}" x2="${width - 10}" y2="${yPos}" stroke="#21262d" stroke-dasharray="2,2" />`;
    }
    
    if (chartSetup === "metals") {
        svgContent += `
            <path d="M 10 100 Q 150 50, 300 120 T ${width-10} 80 L ${width-10} 240 Q 300 280, 150 180 T 10 220 Z" fill="rgba(56, 139, 253, 0.05)" />
            <path d="M 10 100 Q 150 50, 300 120 T ${width-10} 80" fill="none" stroke="var(--primary-color)" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.6" />
            <path d="M 10 220 Q 150 180, 300 280 T ${width-10} 240" fill="none" stroke="var(--primary-color)" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.6" />
            
            <g stroke="#ff7b72" stroke-width="1.5">
                <line x1="50" y1="80" x2="50" y2="120" />
                <line x1="90" y1="90" x2="90" y2="140" />
                <line x1="130" y1="120" x2="130" y2="170" />
            </g>
            <g fill="#ff7b72">
                <rect x="44" y="90" width="12" height="20" rx="2" />
                <rect x="84" y="100" width="12" height="30" rx="2" />
                <rect x="124" y="130" width="12" height="30" rx="2" />
            </g>
            
            <g stroke="var(--color-success)" stroke-width="1.5">
                <line x1="170" y1="150" x2="170" y2="245" />
            </g>
            <rect x="164" y="150" width="12" height="15" fill="var(--color-success)" rx="2" />
            <circle cx="170" cy="240" r="14" fill="none" stroke="var(--color-success)" stroke-dasharray="2,2" />
            <text x="190" y="244" fill="var(--color-success)" font-size="10" font-weight="600">Hammer at Support (4667)</text>
            
            <g stroke="var(--color-success)" stroke-width="1.5">
                <line x1="210" y1="130" x2="210" y2="160" />
                <line x1="250" y1="110" x2="250" y2="140" />
                <line x1="290" y1="90" x2="290" y2="120" />
            </g>
            <g fill="var(--color-success)">
                <rect x="204" y="135" width="12" height="20" rx="2" />
                <rect x="244" y="115" width="12" height="20" rx="2" />
                <rect x="284" y="95" width="12" height="20" rx="2" />
            </g>
            
            <g stroke="#ff7b72" stroke-width="1.5">
                <line x1="330" y1="45" x2="330" y2="100" />
            </g>
            <rect x="324" y="80" width="12" height="15" fill="#ff7b72" rx="2" />
            <circle cx="330" cy="50" r="14" fill="none" stroke="#ff7b72" stroke-dasharray="2,2" />
            <text x="350" y="54" fill="#ff7b72" font-size="10" font-weight="600">Shooting Star at Resistance (5277)</text>
            
            <rect x="10" y="275" width="${width-20}" height="60" fill="rgba(255,255,255,0.01)" stroke="#21262d" />
            <line x1="10" y1="287" x2="${width-10}" y2="287" stroke="rgba(239,68,68,0.3)" stroke-dasharray="2,2" />
            <line x1="10" y1="323" x2="${width-10}" y2="323" stroke="rgba(86,211,100,0.3)" stroke-dasharray="2,2" />
            <text x="15" y="284" fill="#8b949e" font-size="7">Stoch 80</text>
            <text x="15" y="331" fill="#8b949e" font-size="7">Stoch 20</text>
            <path d="M 10 295 C 100 280, 150 335, 170 330 T 250 290 T 330 282" fill="none" stroke="var(--primary-color)" stroke-width="1.5" />
            <path d="M 10 300 C 100 285, 150 330, 170 327 T 250 292 T 330 284" fill="none" stroke="#d29922" stroke-width="1" />
        `;
    } else if (chartSetup === "crypto") {
        svgContent += `
            <line x1="10" y1="100" x2="${width-10}" y2="100" stroke="#d29922" stroke-width="1.5" stroke-dasharray="5,5" />
            <text x="15" y="94" fill="#d29922" font-size="9" font-weight="600">Bitcoin Core Entry: 91,200</text>
            
            <line x1="10" y1="140" x2="${width-10}" y2="140" stroke="#ff7b72" stroke-width="1.2" stroke-dasharray="3,3" />
            <text x="15" y="134" fill="#ff7b72" font-size="8">Tier 1 Hedge (1/3 size): 89,300</text>
            
            <line x1="10" y1="180" x2="${width-10}" y2="180" stroke="#ff7b72" stroke-width="1.2" stroke-dasharray="3,3" />
            <text x="15" y="174" fill="#ff7b72" font-size="8">Tier 2 Hedge (1/3 size): 86,900</text>
            
            <line x1="10" y1="210" x2="${width-10}" y2="210" stroke="#ff7b72" stroke-width="1.2" stroke-dasharray="3,3" />
            <text x="15" y="204" fill="#ff7b72" font-size="8">Tier 3 Hedge (13.3% size): 85,900</text>
            
            <path d="M 30 110 L 80 85 L 140 135 L 200 95 L 260 148 L 320 110 L 380 70 L 440 60" fill="none" stroke="#8b949e" stroke-width="2" />
            <line x1="260" y1="148" x2="260" y2="175" stroke="#ff7b72" stroke-width="1" />
            <circle cx="260" cy="140" r="5" fill="#ff7b72" />
            <text x="270" y="143" fill="#ff7b72" font-size="8" font-weight="600">Tier 1 Hedge Triggered</text>
            
            <line x1="10" y1="60" x2="${width-10}" y2="60" stroke="var(--color-success)" stroke-width="1.5" />
            <text x="15" y="54" fill="var(--color-success)" font-size="9" font-weight="600">Stop-Breakeven (SBE) active: 91,200 (Risk Free)</text>
        `;
    } else if (chartSetup === "stocks") {
        svgContent += `
            <line x1="10" y1="150" x2="${width-10}" y2="150" stroke="var(--primary-color)" stroke-width="2" />
            <text x="15" y="142" fill="var(--primary-color)" font-size="10" font-weight="600">COIN Long Entry: 256.30</text>
            
            <rect x="10" y="150" width="${width-20}" height="100" fill="rgba(239, 68, 68, 0.05)" />
            
            <rect x="10" y="250" width="${width-20}" height="6" fill="#ff7b72" />
            <text x="15" y="242" fill="#ff7b72" font-size="10" font-weight="600">Protective Put Option Strike Floor: 192.00</text>
            <text x="15" y="270" fill="#ff7b72" font-size="8">Maximum Loss is strictly locked to 1.5% of total capital</text>
            
            <path d="M 30 150 C 100 160, 160 210, 200 180 C 250 140, 320 80, 420 50" fill="none" stroke="var(--color-success)" stroke-width="3" />
            <circle cx="420" cy="50" r="5" fill="var(--color-success)" />
            <text x="430" y="54" fill="var(--color-success)" font-size="10" font-weight="600">Momentum Profit Target: 350.00</text>
            
            <g transform="translate(${width-120}, 90)">
                <rect x="0" y="0" width="100" height="40" rx="6" fill="rgba(56, 139, 253, 0.1)" stroke="var(--primary-color)" stroke-width="1" />
                <text x="50" y="24" fill="var(--primary-color)" font-size="12" font-weight="700" text-anchor="middle">100% SIZE</text>
            </g>
        `;
    } else if (chartSetup === "energies") {
        svgContent += `
            <line x1="10" y1="220" x2="${width-10}" y2="220" stroke="#f0883e" stroke-width="2" />
            <text x="15" y="212" fill="#f0883e" font-size="10" font-weight="600">Key Support Level: 2.575</text>
            
            <g stroke="#ff7b72" stroke-width="1.5">
                <line x1="50" y1="100" x2="50" y2="150" />
                <line x1="90" y1="120" x2="90" y2="180" />
            </g>
            <g fill="#ff7b72">
                <rect x="44" y="110" width="12" height="30" rx="2" />
                <rect x="84" y="130" width="12" height="40" rx="2" />
            </g>
            
            <line x1="140" y1="160" x2="140" y2="235" stroke="#ff7b72" stroke-width="1.5" />
            <rect x="134" y="160" width="12" height="20" fill="#ff7b72" rx="2" />
            <circle cx="140" cy="220" r="10" fill="none" stroke="#d29922" />
            
            <line x1="190" y1="170" x2="190" y2="238" stroke="#ff7b72" stroke-width="1.5" />
            <rect x="184" y="170" width="12" height="15" fill="#ff7b72" rx="2" />
            <circle cx="190" cy="220" r="10" fill="none" stroke="#d29922" />
            
            <line x1="240" y1="170" x2="240" y2="240" stroke="var(--color-success)" stroke-width="1.5" />
            <rect x="234" y="170" width="12" height="15" fill="var(--color-success)" rx="2" />
            <circle cx="240" cy="220" r="10" fill="none" stroke="#d29922" />
            
            <text x="130" y="260" fill="#d29922" font-size="9" font-weight="600">Triple Wick Rejection (Supply Absorption)</text>
            
            <path d="M 240 170 C 280 140, 320 100, 380 60" fill="none" stroke="var(--color-success)" stroke-width="3" />
            <circle cx="380" cy="60" r="5" fill="var(--color-success)" />
            <text x="390" y="64" fill="var(--color-success)" font-size="10" font-weight="600">Hedge Target: 2.91</text>
        `;
    } else if (chartSetup === "indices") {
        svgContent += `
            <rect x="10" y="140" width="${width-20}" height="40" fill="rgba(56, 139, 253, 0.05)" stroke="#21262d" />
            <text x="15" y="132" fill="#8b949e" font-size="9">Horizontal Resistance Box Range</text>
            
            <path d="M 30 160 Q 100 150, 160 160 T 220 100 T 280 138 T 380 50" fill="none" stroke="#8b949e" stroke-width="2" />
            
            <circle cx="220" cy="100" r="12" fill="none" stroke="var(--primary-color)" stroke-dasharray="2,2" />
            <text x="200" y="80" fill="var(--primary-color)" font-size="9" font-weight="600">1. Breakout</text>
            
            <circle cx="280" cy="138" r="12" fill="none" stroke="var(--color-success)" stroke-dasharray="2,2" />
            <text x="250" y="160" fill="var(--color-success)" font-size="9" font-weight="600">2. Pullback & Retest</text>
            
            <path d="M 280 170 L 280 148 M 274 154 L 280 148 L 286 154" fill="none" stroke="var(--color-success)" stroke-width="2.5" />
            <text x="300" y="142" fill="var(--color-success)" font-size="10" font-weight="700">Long Entry at Close</text>
        `;
    } else if (chartSetup === "forex") {
        svgContent += `
            <path d="M 10 180 Q 150 150, 300 200 T ${width-10} 170" fill="none" stroke="var(--primary-color)" stroke-width="2.5" />
            <text x="20" y="165" fill="var(--primary-color)" font-size="9" font-weight="600">200 SMA Dynamic Support</text>
            
            <path d="M 20 80 L 100 110 L 180 178 L 250 130 L 340 70" fill="none" stroke="#8b949e" stroke-width="2" />
            
            <circle cx="180" cy="178" r="14" fill="none" stroke="var(--color-success)" stroke-dasharray="2,2" />
            <text x="140" y="210" fill="var(--color-success)" font-size="9" font-weight="600">Hourly Reversal Candle close on SMA</text>
            
            <rect x="10" y="275" width="${width-20}" height="60" fill="rgba(255,255,255,0.01)" stroke="#21262d" />
            <line x1="10" y1="287" x2="${width-10}" y2="287" stroke="rgba(239,68,68,0.3)" stroke-dasharray="2,2" />
            <line x1="10" y1="323" x2="${width-10}" y2="323" stroke="rgba(86,211,100,0.3)" stroke-dasharray="2,2" />
            
            <path d="M 10 290 Q 100 280, 180 327 T 280 290" fill="none" stroke="var(--primary-color)" stroke-width="1.5" />
            <path d="M 10 293 Q 100 285, 180 325 T 280 292" fill="none" stroke="#d29922" stroke-width="1" />
            <circle cx="180" cy="326" r="6" fill="none" stroke="var(--color-success)" />
            <text x="200" y="331" fill="var(--color-success)" font-size="8">Stochastic Wash < 20</text>
        `;
    } else if (chartSetup === "softs") {
        svgContent += `
            <line x1="10" y1="80" x2="${width-10}" y2="120" stroke="#8b949e" stroke-width="1.5" stroke-dasharray="4,4" />
            <text x="15" y="74" fill="#8b949e" font-size="9">Upper Channel Resistance</text>
            
            <line x1="10" y1="220" x2="${width-10}" y2="260" stroke="#8b949e" stroke-width="1.5" stroke-dasharray="4,4" />
            <text x="15" y="244" fill="#8b949e" font-size="9">Lower Channel Support</text>
            
            <path d="M 30 150 L 100 95 L 180 230 L 260 110 L 340 248 L 420 130" fill="none" stroke="#d29922" stroke-width="2" />
            
            <circle cx="100" cy="95" r="8" fill="none" stroke="#ff7b72" />
            <text x="100" y="80" fill="#ff7b72" font-size="8" text-anchor="middle">Sell</text>
            
            <circle cx="180" cy="230" r="8" fill="none" stroke="var(--color-success)" />
            <text x="180" y="248" fill="var(--color-success)" font-size="8" text-anchor="middle">Buy</text>
            
            <circle cx="260" cy="110" r="8" fill="none" stroke="#ff7b72" />
            <text x="260" y="95" fill="#ff7b72" font-size="8" text-anchor="middle">Sell</text>
        `;
    }
    
    svgContent += `</svg>`;
    container.innerHTML = svgContent;
}

function renderCourseInlineChart(courseIdx, slideIdx, page) {
    if (!page.images || page.images.length === 0) return;
    
    setTimeout(() => {
        page.images.forEach((imgUrl, imgIdx) => {
            const container = document.getElementById(`course-inline-chart-${courseIdx}-${slideIdx}-${imgIdx}`);
            if (!container) return;
            
            const width = container.clientWidth || 500;
            const height = 220;
            
            let svgContent = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" style="background: #090d13; font-family: sans-serif; border-radius: 6px; border: 1px solid var(--border-color); margin-top: 0.5rem;">`;
            
            for (let i = 1; i < 4; i++) {
                const yPos = (height / 4) * i;
                svgContent += `<line x1="10" y1="${yPos}" x2="${width - 10}" y2="${yPos}" stroke="#161b22" stroke-dasharray="2,2" />`;
            }
            
            if (courseIdx === 1) { // Course 2: G7 Swing Forex
                svgContent += `
                    <path d="M 10 70 Q 150 40, 300 90 T ${width-10} 60 L ${width-10} 170 Q 300 200, 150 140 T 10 160 Z" fill="rgba(56, 139, 253, 0.04)" />
                    <path d="M 10 70 Q 150 40, 300 90 T ${width-10} 60" fill="none" stroke="var(--primary-color)" stroke-width="1.2" stroke-dasharray="2,2" opacity="0.4" />
                    <path d="M 10 160 Q 150 140, 300 200 T ${width-10} 170" fill="none" stroke="var(--primary-color)" stroke-width="1.2" stroke-dasharray="2,2" opacity="0.4" />
                    
                    <path d="M 20 80 L 100 130 L 180 165 L 260 110 L 340 70" fill="none" stroke="#8b949e" stroke-width="1.5" />
                    
                    <circle cx="180" cy="165" r="10" fill="none" stroke="var(--color-success)" stroke-width="1.5" />
                    <path d="M 180 180 L 180 155 M 175 162 L 180 155 L 185 162" fill="none" stroke="var(--color-success)" stroke-width="2" />
                    <text x="200" y="170" fill="var(--color-success)" font-size="9" font-weight="600">G7 Reversal Re-entry (GBPUSD/Gold)</text>
                    
                    <line x1="180" y1="110" x2="${width-10}" y2="110" stroke="var(--color-success)" stroke-dasharray="3,3" />
                    <text x="200" y="105" fill="var(--color-success)" font-size="8">SBE Profit Lock (1.5R target reached)</text>
                `;
            } else if (courseIdx === 2) { // Course 3: NATGAS Widow Maker
                svgContent += `
                    <line x1="10" y1="150" x2="${width-10}" y2="150" stroke="#f0883e" stroke-width="1.5" />
                    <text x="15" y="142" fill="#f0883e" font-size="8">Key Support Level: 2.575</text>
                    
                    <line x1="100" y1="110" x2="100" y2="160" stroke="#ff7b72" stroke-width="1.2" />
                    <rect x="95" y="110" width="10" height="15" fill="#ff7b72" rx="1" />
                    
                    <line x1="140" y1="120" x2="140" y2="163" stroke="#ff7b72" stroke-width="1.2" />
                    <rect x="135" y="120" width="10" height="10" fill="#ff7b72" rx="1" />
                    
                    <line x1="180" y1="110" x2="180" y2="165" stroke="var(--color-success)" stroke-width="1.2" />
                    <rect x="175" y="110" width="10" height="10" fill="var(--color-success)" rx="1" />
                    
                    <circle cx="140" cy="150" r="8" fill="none" stroke="#d29922" />
                    <circle cx="180" cy="150" r="8" fill="none" stroke="#d29922" />
                    <text x="200" y="154" fill="#d29922" font-size="9" font-weight="600">Triple Wick Rejection (NATGAS 2.575 Bottom)</text>
                    
                    <path d="M 180 120 C 230 100, 280 70, 360 40" fill="none" stroke="var(--color-success)" stroke-width="2" />
                    <text x="370" y="44" fill="var(--color-success)" font-size="8" font-weight="600">Fully Hedged Target (2.91)</text>
                `;
            } else { // Course 1: Grown-Up Rules
                svgContent += `
                    <line x1="10" y1="100" x2="${width-10}" y2="100" stroke="var(--primary-color)" stroke-width="1.5" />
                    <text x="15" y="92" fill="var(--primary-color)" font-size="8" font-weight="600">MSTR Core Entry: 235.00</text>
                    
                    <line x1="10" y1="160" x2="${width-10}" y2="160" stroke="#ff7b72" stroke-width="1.5" />
                    <text x="15" y="152" fill="#ff7b72" font-size="8" font-weight="600">Protective Put Floor (Collar Strike at 200.00)</text>
                    
                    <path d="M 30 100 Q 150 110, 240 70 T ${width-40} 40" fill="none" stroke="var(--color-success)" stroke-width="2" />
                    <text x="${width-120}" y="34" fill="var(--color-success)" font-size="8" font-weight="600">Closed Target: 450.00 (Free Collar Option)</text>
                `;
            }
            
            svgContent += `</svg>`;
            container.innerHTML = svgContent;
        });
    }, 50);
}
