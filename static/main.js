/**
 * MAIN.JS - START ON WELCOME
 */
async function loadPage(pageName) {
    const target = pageName || 'welcome';
    const viewport = document.getElementById('app-viewport');

    console.log("Attempting to load:", target);

    try {
        const response = await fetch(`/pages/${target}`);
        if (!response.ok) throw new Error('Page not found');
        
        const html = await response.text();
        
        // Clear and Set
        viewport.innerHTML = html;
        viewport.dataset.currentPage = target;

        // Force scripts to execute
        const scripts = viewport.querySelectorAll("script");
        scripts.forEach(oldScript => {
            const newScript = document.createElement("script");
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });

        if (window.location.hash !== `#${target}`) {
            history.pushState({ page: target }, "", `#${target}`);
        }
        
        console.log("Load successful:", target);

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

// --- BACK BUTTON (Handle browser back/forward) ---
window.onpopstate = function(event) {
    if (event.state && event.state.page) {
        loadPage(event.state.page);
    } else {
        // Fallback to welcome if history is empty
        loadPage('welcome');
    }
};

// --- INITIAL LAUNCH (Runs when you first open the site) ---
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.replace('#', '');
    
    // Force 'welcome' if there's no hash or if the hash is 'dashboard'
    if (!hash || hash === 'dashboard' || hash === 'welcome') {
        localStorage.removeItem('alpine_current_page');
        loadPage('welcome');
    } else {
        loadPage(hash);
    }
});
