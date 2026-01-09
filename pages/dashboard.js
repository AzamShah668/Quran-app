// Local content for when the database is not connected
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

// 1. Updated Quran Function
async function openQuran() {
    await loadPage('content');
    document.getElementById("content-title").innerText = "Read Quran";
    
    // Pick a random verse from our list above
    const randomVerse = quranVerses[Math.floor(Math.random() * quranVerses.length)];
    document.getElementById("dynamic-content").innerText = randomVerse;
}

// 2. Updated Daily Thought Function
async function openThought() {
    await loadPage('content');
    document.getElementById("content-title").innerText = "Daily Thought";
    
    const randomThought = dailyThoughts[Math.floor(Math.random() * dailyThoughts.length)];
    document.getElementById("dynamic-content").innerText = randomThought;
}

// 3. Updated Dua Function (With Fallback)
const backendUrl = "http://192.168.56.103:5000/dua";

async function fetchDua() {
    await loadPage('content'); 
    document.getElementById("content-title").innerText = "Dua of the Day";
    const display = document.getElementById("dynamic-content");
    display.innerText = "Connecting to Alpine Server...";

    fetch(backendUrl)
        .then(res => res.json())
        .then(data => { display.innerText = data.dua; })
        .catch(() => { 
            // If server is off, show this instead of an error
            display.innerText = "‘Rabbi zidni 'ilma’ (My Lord, increase me in knowledge.) \n\n [Note: Server is currently offline]"; 
        });
}