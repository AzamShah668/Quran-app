// 1. Content Lists (Keeping them local as you requested)
const quranVerses = [
    "‘Verily, with every hardship comes ease.’ (94:6)",
    "‘So remember Me; I will remember you.’ (2:152)",
    "‘And He is with you wherever you are.’ (57:4)"
];

const dailyThoughts = [
    "Patience is not the ability to wait, but the ability to keep a good attitude while waiting.",
    "The best way to find peace is to trust the plan of the One who created you.",
    "Gratitude turns what we have into enough."
];

// 2. Updated Quran Function
async function openQuran() {
    // This calls the loadPage function in your main.js
    await loadPage('content'); 
    
    document.getElementById("content-title").innerText = "Read Quran";
    const randomVerse = quranVerses[Math.floor(Math.random() * quranVerses.length)];
    document.getElementById("dynamic-content").innerText = randomVerse;
}

// 3. Updated Daily Thought Function
async function openThought() {
    await loadPage('content');
    document.getElementById("content-title").innerText = "Daily Thought";

    const randomThought = dailyThoughts[Math.floor(Math.random() * dailyThoughts.length)];
    document.getElementById("dynamic-content").innerText = randomThought;
}

// 4. Updated Dua Function 
// Note: This points to your Flask server's IP/URL
const backendUrl = "/api/dua"; // Using a relative path is safer in Flask

async function fetchDua() {
    await loadPage('content');
    document.getElementById("content-title").innerText = "Dua of the Day";
    const display = document.getElementById("dynamic-content");
    
    display.innerText = "Connecting to Alpine Server...";

    fetch(backendUrl)
        .then(res => {
            if (!res.ok) throw new Error("Server not responding");
            return res.json();
        })
        .then(data => { 
            display.innerText = data.dua || data.content; 
        })
        .catch(() => {
            // Fallback if Flask server doesn't have the /dua route yet
            display.innerText = "‘Rabbi zidni 'ilma’ (My Lord, increase me in knowledge.) \n\n [Note: Server connectivity issue]";
        });
}
