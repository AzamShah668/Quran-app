/**
 * static/pages/dashboard.js
 * Logic for Alpine Spirituals Dashboard
 */

// 1. Local Content Lists (Quick-loading fallbacks)
const dailyThoughts = [
    "Patience is not the ability to wait, but the ability to keep a good attitude while waiting.",
    "The best way to find peace is to trust the plan of the One who created you.",
    "Gratitude turns what we have into enough.",
    "What is meant for you will never miss you.",
    "The heart that beats for Allah is always at peace."
];

// 2. Updated Quran Function - Pulls from your PostgreSQL via Flask
async function openQuran() {
    await loadPage('content');
    const title = document.getElementById("content-title");
    const display = document.getElementById("dynamic-content");

    // Clear previous content and show loading state
    title.innerText = "Verse of the Moment";
    display.innerHTML = "<div style='text-align:center;'><em>Reflecting on the Word...</em></div>";

    try {
        const response = await fetch('/api/random-verse');
        const data = await response.json();

        if (data.error) throw new Error(data.error);

        // Render Arabic (RTL) and English translation
        display.innerHTML = `
            <div style="text-align: right; font-size: 26px; color: #1a531b; margin-bottom: 20px; direction: rtl; line-height: 1.8; font-family: 'Amiri', serif;">
                ${data.text_arabic}
            </div>
            <div style="font-size: 1.1rem; color: #333; font-style: italic; border-left: 4px solid #1a531b; padding-left: 15px; margin-bottom: 15px; text-align: left;">
                "${data.text_english}"
            </div>
            <div style="font-weight: bold; color: #888; font-size: 0.9rem; margin-bottom: 20px;">
                — Surah ${data.surah_name}, Ayah ${data.ayah_number}
            </div>
            <button onclick="openQuran()" style="width: 100%; padding: 12px; background: #1a531b; color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; transition: opacity 0.2s;">
                Show Another Verse
            </button>
        `;
    } catch (err) {
        console.error("Fetch error:", err);
        display.innerText = "‘Verily, with every hardship comes ease.’ (94:6)\n[Connection Error]";
    }
}

// 3. Updated Daily Thought Function (Purely Local)
async function openThought() {
    await loadPage('content');
    document.getElementById("content-title").innerText = "Daily Thought";
    const display = document.getElementById("dynamic-content");

    const randomThought = dailyThoughts[Math.floor(Math.random() * dailyThoughts.length)];

    display.innerHTML = `
        <div style="font-size: 1.3rem; color: #004445; text-align: center; padding: 10px; margin-bottom: 20px;">
            "${randomThought}"
        </div>
        <button onclick="openThought()" style="width: 100%; padding: 12px; background: white; color: #1a531b; border: 2px solid #1a531b; border-radius: 12px; font-weight: 600; cursor: pointer;">
            New Thought
        </button>
    `;
}

// 4. Updated Dua Function - Live Fetch from Database
async function fetchDua() {
    await loadPage('content');
    document.getElementById("content-title").innerText = "Dua of the Day";
    const display = document.getElementById("dynamic-content");

    display.innerHTML = "<div style='text-align:center;'><em>Seeking a Dua...</em></div>";

    fetch('/api/random-verse')
        .then(res => {
            if (!res.ok) throw new Error("Server error");
            return res.json();
        })
        .then(data => {
            display.innerHTML = `
                <div style="text-align: right; font-size: 22px; color: #004445; direction: rtl; line-height: 1.6; margin-bottom: 15px;">
                    ${data.text_arabic}
                </div>
                <p style="margin-top: 15px; font-size: 1.1rem; color: #444; text-align: left;">${data.text_english}</p>
                <div style="margin: 15px 0; font-size: 0.85rem; color: #999;">Source: Surah ${data.surah_name}</div>
                <button onclick="fetchDua()" style="width: 100%; padding: 10px; background: #f0fdf4; color: #004445; border: 1px solid #004445; border-radius: 10px; cursor: pointer; font-weight: 600;">
                    Get New Dua
                </button>
            `;
        })
        .catch((err) => {
            console.error("Dua error:", err);
            display.innerText = "‘Rabbi zidni 'ilma’ (My Lord, increase me in knowledge.)";
        });
}
// 5. Surah Library Logic
async function openLibrary() {
    await loadPage('content');
    const display = document.getElementById("dynamic-content");
    display.innerHTML = "Loading Surah List...";

    // For now, let's keep it simple with a list of common names or just the numbers.
    // If you want the names on the buttons, we can fetch 'SELECT DISTINCT surah_name' from the DB.
    
    let listHtml = `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">`;
    for (let i = 1; i <= 114; i++) {
        listHtml += `<button onclick="readFullSurah(${i})" style="padding:10px; border-radius:8px;">Surah ${i}</button>`;
    }
    listHtml += `</div>`;
    display.innerHTML = listHtml;
}

async function readFullSurah(surahNo) {
    const display = document.getElementById("dynamic-content");
    display.innerHTML = "<div style='text-align:center;'><em>Opening the Book...</em></div>";
    document.getElementById("content-title").innerText = `Surah ${surahNo}`;

    try {
        const response = await fetch(`/api/surah/${surahNo}`);
        const data = await response.json();

        let surahHtml = `<div style="padding: 10px;">`;
        data.forEach(ayah => {
            surahHtml += `
                <div style="margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                    <div style="text-align: right; font-size: 22px; color: #1a531b; direction: rtl; line-height: 1.8; margin-bottom: 10px;">
                        ${ayah.text_arabic} <span style="font-size: 14px; color: #888;">[${ayah.ayah_number}]</span>
                    </div>
                    <div style="font-size: 16px; color: #333; text-align: left; line-height: 1.5;">
                        ${ayah.text_english}
                    </div>
                </div>`;
        });
        surahHtml += `
            <button onclick="openLibrary()" style="width: 100%; padding: 15px; background: #1a531b; color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; margin-top: 20px;">
                Back to Library
            </button>
        </div>`;
        display.innerHTML = surahHtml;
    } catch (err) {
        display.innerHTML = "Failed to load Surah. Please check database connection.";
    }
}
