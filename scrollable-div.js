const clickableDiv = document.getElementById('clickableDiv');
let isFitnessTipVisible = false;

clickableDiv.addEventListener('click', function () {
    // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const currentDayOfWeek = new Date().getDay();

    // Define fitness tips for each day
    const fitnessTips = [
        "Start your day with a 20-minute brisk walk or jog to boost your metabolism.",
        "Stay hydrated throughout the day. Drink at least 8 glasses of water.",
        "Include a variety of colorful fruits and vegetables in your meals for better nutrition.",
        "Don't forget to stretch! Spend 10 minutes stretching your muscles to improve flexibility.",
        "Consider joining a fitness class or group to stay motivated and accountable.",
        "Get a good night's sleep. Aim for 7-8 hours of quality sleep each night.",
        "Avoid sugary snacks and opt for healthier alternatives like nuts and yogurt."
    ];

    // Toggle the visibility of the fitness tip
    isFitnessTipVisible = !isFitnessTipVisible;

    // Update the content of clickableDiv based on the visibility
    if (isFitnessTipVisible) {
        const dayName = getDayName(currentDayOfWeek);
        const fitnessTip = fitnessTips[currentDayOfWeek];
        clickableDiv.innerHTML = `
            <p style="padding:5px;">Click here to see today's fitness tip (${dayName}):</p>
            <div class="day-div" id="day${currentDayOfWeek}">
                <h3>${dayName}</h3>
                <p>${fitnessTip}</p>
            </div>
        `;

        // Show the day-div for the current day
        showFitnessSuggestion(currentDayOfWeek);
    } else {
        clickableDiv.innerHTML = `
            <p style="padding:5px;">
                Welcome to your daily fitness suggestion! Click here to reveal today's tip:
            </p>
        `;
    }
});

// Helper function to get the day name
function getDayName(dayIndex) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayIndex];
}

// Function to show the day-div for the given dayIndex
function showFitnessSuggestion(dayIndex) {
    // Hide all day-div elements
    const dayDivs = document.querySelectorAll('.day-div');
    dayDivs.forEach(function (dayDiv) {
        dayDiv.style.display = 'none';
    });

    // Show the day-div for the given dayIndex
    const dayDiv = document.getElementById(`day${dayIndex}`);
    dayDiv.style.display = 'block';
}