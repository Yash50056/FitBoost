let watchId = null;
let totalSteps = 0;
let totalCalories = 0;
let totalDistance = 0;
let startPosition = null;
let trackingStarted = false;
let greenTextCount = 0;
let totalPoints = parseInt(localStorage.getItem('totalPoints')) || 0;

const stepsElement = document.getElementById("steps");
const caloriesElement = document.getElementById("calories");
const distanceElement = document.getElementById("distance");
const heartRateElement = document.getElementById("heartRate");
const lastUpdatedElement = document.getElementById("lastUpdated");
const pointsElement = document.getElementById("points");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const resetButton = document.getElementById("resetButton");
const historyList = document.getElementById("historyList");
const exportButton = document.getElementById("exportButton");

pointsElement.innerText = `${totalPoints} points`;

const stepLength = 0.7;
const caloriesBurnedPerMeter = 0.0343;
const caloriesBurnedPerStep = 0.047;
const walkingSpeedInMph = 3.5;

// Load history data from localStorage on page load
const savedHistoryData = JSON.parse(localStorage.getItem('historyData')) || [];
savedHistoryData.forEach(entry => {
    const historyEntry = document.createElement("li");
    const historyText = `${entry.date} ${entry.time} - Steps: ${entry.steps}, Calories: ${entry.calories}, Distance: ${entry.distance}m`;
    historyEntry.textContent = historyText;
    historyList.appendChild(historyEntry);
});

function startTracking() {
    if (!trackingStarted) {
        resetValues();
        updateDateTime();
        requestAnimationFrame(updateValues);
    }

    if ("geolocation" in navigator) {
        startButton.disabled = true;
        stopButton.disabled = false;
        resetButton.disabled = true;
        navigator.geolocation.getCurrentPosition(function (position) {
            startPosition = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };
            watchId = navigator.geolocation.watchPosition(trackDistance, trackError, {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 10000
            });
        });
        trackingStarted = true;
    } else {
        alert("Geolocation is not available");
    }
}

function stopTracking() {
    startButton.disabled = false;
    stopButton.disabled = true;
    resetButton.disabled = false;
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function calculateCaloriesBurned(distanceInMeters, steps) {
    const caloriesFromDistance = (distanceInMeters * caloriesBurnedPerMeter) / 2;
    const caloriesFromSteps = (steps * caloriesBurnedPerStep) / 2;
    return (caloriesFromDistance + caloriesFromSteps).toFixed(2);
}

function calculateSteps(distanceInMeters) {
    return Math.floor(distanceInMeters / stepLength) / 2;
}

function estimateHeartRate(distanceInMeters, walkingSpeedInMph) {
    const timeInHours = distanceInMeters / (walkingSpeedInMph * 0.621371);
    let estimatedHeartRate = 70 + (timeInHours * 10);
    estimatedHeartRate = Math.min(estimatedHeartRate, 220);
    return Math.round(estimatedHeartRate);
}

function updateValues() {
    stepsElement.innerText = `${totalSteps} steps`;
    caloriesElement.innerText = `${totalCalories} kcal`;
    distanceElement.innerText = `${(totalDistance / 1000).toFixed(2)} km`;
    updateDateTime();

    if (totalSteps >= 400 && totalCalories >= 60 && totalDistance >= 1.75) {
        if (greenTextCount === 0) {
            totalPoints += 100;
            greenTextCount++;
            localStorage.setItem('totalPoints', totalPoints);
            pointsElement.innerText = `${totalPoints} points`;
        }

        setElementColor([stepsElement, caloriesElement, distanceElement], "green");
    } else {
        setElementColor([stepsElement, caloriesElement, distanceElement], "black");
        greenTextCount = 0;
    }

    requestAnimationFrame(updateValues);
}

function trackDistance(position) {
    if (startPosition) {
        const { latitude, longitude } = position.coords;
        const newDistance = calculateDistance(
            startPosition.latitude,
            startPosition.longitude,
            latitude,
            longitude
        );
        totalDistance += parseFloat(newDistance);
        totalSteps = calculateSteps(totalDistance);
        totalCalories = calculateCaloriesBurned(totalDistance, totalSteps);
        startPosition = { latitude, longitude };
        updateHeartRate();
    }
}

function updateHeartRate() {
    const estimatedHeartRate = estimateHeartRate(totalDistance, walkingSpeedInMph);
    heartRateElement.innerText = `${estimatedHeartRate} bpm`;
}

function updateDateTime() {
    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString();
    lastUpdatedElement.innerText = `${formattedDate} ${formattedTime}`;
}

function trackError(error) {
    console.error('Error getting geolocation:', error.message);
}

function resetValues() {
    totalSteps = 0;
    totalCalories = 0;
    totalDistance = 0;
    greenTextCount = 0;
    stepsElement.innerText = "0 steps";
    caloriesElement.innerText = "0 kcal";
    distanceElement.innerText = "0.00 cm";
    heartRateElement.innerText = "0 bpm";
    updateDateTime();
}

function setElementColor(elements, color) {
    elements.forEach(element => {
        element.style.color = color;
    });
}

function resetDataAtMidnight() {
    const now = new Date();
    const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0,
        0
    );
    const timeUntilMidnight = midnight - now;
    setTimeout(function () {
        // Clear only history data in localStorage at midnight
        localStorage.removeItem('historyData');
        resetValues();
        resetDataAtMidnight();
    }, timeUntilMidnight);
}

function updateHistoryList() {
    const historyEntry = document.createElement("li");
    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString();
    const historyText = `${formattedDate} ${formattedTime} - Steps: ${totalSteps}, Calories: ${totalCalories}, Distance: ${totalDistance.toFixed(2)}m`;
    historyEntry.textContent = historyText;
    historyList.appendChild(historyEntry);

    // Save historyEntry to localStorage
    const historyData = JSON.parse(localStorage.getItem('historyData')) || [];
    historyData.push({
        date: formattedDate,
        time: formattedTime,
        steps: totalSteps,
        calories: totalCalories,
        distance: totalDistance.toFixed(2),
    });
    localStorage.setItem('historyData', JSON.stringify(historyData));
}

startTracking();

setInterval(function () {
    updateHistoryList();
}, 10000); // 60000 milliseconds = 1 minute

startButton.addEventListener("click", startTracking);
stopButton.addEventListener("click", stopTracking);
resetButton.addEventListener("click", function () {
    trackingStarted = false;
    startButton.disabled = false;
    stopButton.disabled = true;
    resetButton.disabled = true;
    totalSteps = 0;
    totalCalories = 0;
    totalDistance = 0;
    greenTextCount = 0;
    localStorage.setItem('totalPoints', totalPoints);
    pointsElement.innerText = `${totalPoints} points`;
    stepsElement.innerText = "0 steps";
    caloriesElement.innerText = "0 kcal";
    distanceElement.innerText = "0.00 cm";
    heartRateElement.innerText = "0 bpm";
    setElementColor([stepsElement, caloriesElement, distanceElement], "black");
});

function downloadCSV(data, columns, filename) {
    const csvContent = [
        columns.join(','),
        ...data.map(entry => columns.map(col => entry[col]).join(','))
    ].join('\n');

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportData() {
    const historyEntries = Array.from(historyList.children).map(entry => {
        const entryText = entry.textContent;
        const [dateTime, details] = entryText.split(' - ');
        const [steps, calories, distance] = details.match(/\d+(\.\d+)?/g) || [0, 0, 0]; // Extract numeric values
        return {
            Date: dateTime.trim().split(' ')[0],
            Time: dateTime.trim().split(' ')[1],
            Steps: parseInt(steps),
            Calories: parseFloat(calories),
            Distance: parseFloat(distance),
        };
    });

    const columns = ['Date', 'Time', 'Steps', 'Calories', 'Distance'];
    const filename = 'health_data.csv';
    downloadCSV(historyEntries, columns, filename);
}

// Add an event listener to a button to trigger the export
exportButton.addEventListener('click', exportData);

// Call resetDataAtMidnight once on page load
resetDataAtMidnight();