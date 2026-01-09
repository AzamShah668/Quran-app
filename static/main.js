/**
 * MAIN.JS - START ON WELCOME
 */

async function loadPage(pageName) {
    // 1. If pageName is empty (first visit), use 'welcome'
    const target = pageName || 'welcome';
    
    const viewport = document.getElementById('app-viewport');
    
    // Prevent double-loading the same page
    if (viewport.dataset.currentPage === target) return;

    try {
        const response = await fetch(`/pages/${target}`);
        
        if (!response.ok) {
            console.error("Page not found:", target);
            // If welcome is missing, then go to dashboard as backup
            if (target === 'welcome') return loadPage('dashboard');
            return;
        }

        const html = await response.text();
        viewport.innerHTML = html;
        viewport.dataset.currentPage = target;

        // Sync the URL
        if (window.location.hash !== `#${target}`) {
            history.pushState({ page: target }, "", `#${target}`);
        }
    } catch (err) {
        console.error("Navigation error:", err);
    }
}

// THIS SECTION CONTROLS WHAT SHOWS UP FIRST
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.replace('#', '');
    
    // If user has a specific link (like #library), go there.
    // OTHERWISE: Start on 'welcome'
    if (hash) {
        loadPage(hash);
    } else {
        loadPage('welcome'); 
    }
});

window.onpopstate = (e) => {
    const page = (e.state && e.state.page) ? e.state.page : 'welcome';
    loadPage(page);
};

// --- BACK BUTTON ---
window.onpopstate = function(event) {
    if (event.state && event.state.page) {
        loadPage(event.state.page);
    } else {
        loadPage('dashboard');
    }
};
