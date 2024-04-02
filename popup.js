chrome.storage.local.get(["dropThreshold", "historyDuration"], (data) => {
    document.getElementById("dropThreshold").value = data.dropThreshold || 20; // Set default value
    document.getElementById("historyDuration").value = data.historyDuration || 3; // Set default value
  });
  
  document.getElementById("saveSettings").addEventListener("click", () => {
    const dropThreshold = parseFloat(document.getElementById("dropThreshold").value);
    const historyDuration = parseInt(document.getElementById("historyDuration").value);
    chrome.storage.local.set({ dropThreshold, historyDuration });
    // Send message to background script to update thresholds (optional)
    // chrome.runtime.sendMessage({ action: "updateThresholds", dropThreshold, historyDuration });
  });
  