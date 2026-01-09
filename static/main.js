async function loadPage(pageName) {
    const viewport = document.getElementById('app-viewport');

    try {
        // CHANGE HERE: We remove './pages/' and '.html' 
        // We call the Flask route '/pages/dashboard' instead of the file path
        const response = await fetch(`/pages/${pageName}`);

        if (!response.ok) throw new Error('Server returned an error');

        const html = await response.text();

        // Inject the HTML into your index.html's viewport
        viewport.innerHTML = html;

        // Remember this page for refresh
        localStorage.setItem('alpine_current_page', pageName);

        // Always scroll to the top
        window.scrollTo(0, 0);

    } catch (err) {
        console.error("Error loading page:", err);
        viewport.innerHTML = `<div style="text-align:center; padding-top:50px;">
                                <h1>Connection Error</h1>
                                <p>Could not load: ${pageName}</p>
                              </div>`;
    }
}

// Initial Load logic remains the same
window.addEventListener('DOMContentLoaded', () => {
    const savedPage = localStorage.getItem('alpine_current_page') || 'welcome';
    loadPage(savedPage);
});

function logout() {
    localStorage.removeItem('alpine_is_logged_in');
    localStorage.removeItem('alpine_current_page');
    loadPage('login');
}
