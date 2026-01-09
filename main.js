async function loadPage(pageName) {
    const viewport = document.getElementById('app-viewport');

    // SECURITY REMOVED: We no longer check for 'isLoggedIn' here 
    // because we want the user to see the Welcome and Dashboard first.

    try {
        // Fetch the HTML from your /pages folder
        const response = await fetch(`./pages/${pageName}.html`);
        
        if (!response.ok) throw new Error('File not found');
        
        const html = await response.text();
        
        // Inject the HTML into your index.html's viewport
        viewport.innerHTML = html;

        // Remember this page so if the user refreshes, they stay here
        localStorage.setItem('alpine_current_page', pageName);
        
        // Always scroll to the top of the new page
        window.scrollTo(0, 0);
        
    } catch (err) {
        console.error("Error loading page:", err);
        viewport.innerHTML = `<h1 style="text-align:center; padding-top:50px;">Page Load Error: ${pageName}</h1>`;
    }
}
// This runs as soon as the browser finishes loading index.html
window.addEventListener('DOMContentLoaded', () => {
    // Check if the user was previously on a specific page
    // If they are new, default them to 'welcome'
    const savedPage = localStorage.getItem('alpine_current_page') || 'welcome';
    
    loadPage(savedPage);
});

function logout() {
    // Remove the 'true' value from memory
    localStorage.removeItem('alpine_is_logged_in');
    
    // Optional: Clear page memory so they don't auto-load the dashboard next time
    localStorage.removeItem('alpine_current_page');
    
    // Redirect to the login page
    loadPage('login');
}