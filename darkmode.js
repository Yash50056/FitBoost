// Check for user's preference and set the mode accordingly
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Alternatively, you can use localStorage to store user preference
// const savedMode = localStorage.getItem('mode');
// const prefersDarkMode = savedMode === 'dark';

document.body.classList.toggle('dark-mode', prefersDarkMode);

// Toggle between light and dark mode
function toggleMode() {
    document.body.classList.toggle('dark-mode');
    // Update localStorage to save user preference
    // localStorage.setItem('mode', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// Refresh the website without a full reload
function refreshWebsite() {
    // Use the following line to clear the entire page and reload
    // location.reload();

    // Alternatively, use the following line to reload only the CSS
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
        const href = link.href;
        link.href = '';
        link.href = href;
    });
}

// Example: <button onclick="toggleMode()">Toggle Mode</button>
// Add a button for refreshing the website
// Example: <button onclick="refreshWebsite()">Refresh Website</button>
