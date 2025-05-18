/* greeting */
function updateGreeting() {
    const usernameElement = document.getElementById('username');
    const greetingTextElement = document.getElementById('greeting-text');
    const now = new Date();
    const hour = now.getHours();

    let greeting = 'Good Morning';

    if (hour >= 12 && hour < 18) {
        greeting = 'Good Afternoon';
    } else if (hour >= 18) {
        greeting = 'Good Evening';
    }

    usernameElement.textContent = getUsername(); // You can replace this with your username retrieval logic
    greetingTextElement.textContent = `${greeting}, ${localStorage.getItem('name')}`;
}

function getUsername() {
    // You can replace this with your logic to retrieve the username
    // For this example, we'll use a static username
    return 'User';
}

// Call the updateGreeting function initially and set an interval to update it every minute
updateGreeting();
setInterval(updateGreeting, 60000); // Update every minute

/* scrollable-div */

const infoDivs = document.querySelectorAll('.info-div');
const clickableDiv = document.getElementById('clickableDiv');
let areInfoDivsVisible = false;

clickableDiv.addEventListener('click', function () {
    if (areInfoDivsVisible) {
        infoDivs.forEach(function (infoDiv) {
            infoDiv.style.display = 'none';
        });
    } else {
        infoDivs.forEach(function (infoDiv) {
            infoDiv.style.display = 'block';
        });
    }
    areInfoDivsVisible = !areInfoDivsVisible;
});
infoDivs.forEach(function (infoDiv) {
    infoDiv.style.display = 'none';
});