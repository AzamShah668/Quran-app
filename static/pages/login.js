function handleLogin() {
    // Get values from the input fields in login.html
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    // Hardcoded credentials for now
    if (user === "admin" && pass === "1234") {
        // 1. Mark the user as logged in
        localStorage.setItem('alpine_is_logged_in', 'true');
        
        // 2. Redirect them to the Dashboard
        loadPage('dashboard');
        
        console.log("Login successful!");
    } else {
        // 3. Show error message if credentials don't match
        const errorMsg = document.getElementById('login-error');
        if (errorMsg) {
            errorMsg.style.display = 'block';
        }
    }
}