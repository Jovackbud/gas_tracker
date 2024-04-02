// Minimum percentage drop to trigger notification (Replace with desired value)
const MIN_DROP_PERCENTAGE = 20; 

// Timeframe (in milliseconds) to store historical gas prices (Replace with desired duration)
const HISTORY_DURATION = 259200000; // 3 days in milliseconds

let gasPrices = []; // Array to store historical gas prices

chrome.storage.local.get("gasPrices", (data) => {
  if (data.gasPrices) {
    gasPrices = data.gasPrices;
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getCurrentPrice") {
    fetchGasPrice()
      .then((currentPrice) => {
        sendResponse(currentPrice);
      })
      .catch((error) => {
        console.error("Error fetching gas price:", error);
      });
  }
});

function fetchGasPrice() {
  // Add Human Input Here: Replace with your preferred API call to fetch current gas price
  // This example uses a placeholder URL, update with a real API endpoint
  return fetch("https://placeholder.api/gasprice")
    .then((response) => response.json())
    .then((data) => data.gasPrice);
}

function checkForDrop(currentPrice) {
  if (gasPrices.length === 0) return; // No data for comparison

  const averagePrice = calculateAverage(gasPrices);
  const dropPercentage = ((averagePrice - currentPrice) / averagePrice) * 100;

  if (dropPercentage >= MIN_DROP_PERCENTAGE) {
    triggerNotification(currentPrice, dropPercentage);
  }

  // Update stored gas prices
  gasPrices.push(currentPrice);
  cleanOldPrices();
  chrome.storage.local.set({ gasPrices });
}

function calculateAverage(prices) {
  const sum = prices.reduce((acc, price) => acc + price, 0);
  return sum / prices.length;
}

function cleanOldPrices() {
  const now = Date.now();
  gasPrices = gasPrices.filter((price) => now - price.timestamp < HISTORY_DURATION);
}

function triggerNotification(currentPrice, dropPercentage) {
  const notificationOptions = {
    type: "basic",
    iconUrl: "icon.png", // Add Human Input Here: Replace with path to your notification icon
    title: "Gas Fee Alert!",
    message: `Gas price dropped significantly! Current: ${currentPrice} Gwei (Down ${dropPercentage.toFixed(2)}%)`,
  };
  chrome.notifications.create(notificationOptions);
}

// Fetch initial gas price on startup
fetchGasPrice().then(checkForDrop);

// Continuously check for updates at regular intervals
setInterval(() => {
  fetchGasPrice().then(checkForDrop);
}, 60000); // Check every minute
