if ('bluetooth' in navigator) {
    const connectButton = document.getElementById('connectDevice');
    const connectionStatus = document.getElementById('connectionStatus');
    const lastSyncTime = document.getElementById('lastSyncTime');
    const loadingMessage = document.getElementById('loadingMessage');
    const loadingSpinner = document.getElementById('loadingSpinner');
    let connectedDevice = null;

    // Function to show the loading message
    function showLoadingMessage() {
        loadingMessage.style.display = 'block';
    }

    // Function to hide the loading message
    function hideLoadingMessage() {
        loadingMessage.style.display = 'none';
    }

    // Show the loading message initially
    showLoadingMessage();

    // Retrieve last sync time from localStorage if available
    const storedSyncTime = localStorage.getItem('lastSyncTime');
    if (storedSyncTime) {
        lastSyncTime.innerHTML = `Last Sync Time: ${storedSyncTime}`;
    }

    connectButton.addEventListener('click', async () => {
        try {
            if (!connectedDevice) {
                showLoadingMessage(); // Show loading message
                connectedDevice = await navigator.bluetooth.requestDevice({
                    acceptAllDevices: true,
                });

                const server = await connectedDevice.gatt.connect();
                hideLoadingMessage(); // Hide loading message
                connectionStatus.innerHTML = `Connected to ${connectedDevice.name || 'Unnamed Device'}.`;
                connectButton.textContent = 'Disconnect';

                // Get and display the last sync time
                const currentSyncTime = new Date().toLocaleString();
                lastSyncTime.innerHTML = `Last Sync Time: ${currentSyncTime}`;

                // Store last sync time in localStorage
                localStorage.setItem('lastSyncTime', currentSyncTime);
            } else {
                await connectedDevice.gatt.disconnect();
                connectionStatus.innerHTML = 'Disconnected.';
                connectButton.textContent = 'Connect to Bluetooth Device';
                connectedDevice = null;
            }
        } catch (err) {
            console.error(err);
            hideLoadingMessage(); // Hide loading message in case of error
            connectionStatus.innerHTML = 'Error: Could not connect to the device.';
        }
    });
} else {
    // Web Bluetooth API is not supported, display a message
    document.getElementById('connectDevice').style.display = 'none';
    // Set the text content with padding
    const connectionStatus = document.getElementById('connectionStatus');
    connectionStatus.textContent = 'Bluetooth is not supported in this browser.';
    connectionStatus.style.padding = '10px'; // Add padding (adjust as needed)

}