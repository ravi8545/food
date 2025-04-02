document.addEventListener('DOMContentLoaded', function () {
    // Request notification permission on load
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission !== 'granted') {
          alert("Notification permission not granted. Alerts will be used instead.");
        }
      });
    }
  
    const itemInput = document.getElementById('item');
    const dateInput = document.getElementById('date');
    const saveButton = document.querySelector('.save-btn');
    const itemsContainer = document.querySelector('.items-container');
  
    // Function to show notification
    function showNotification(message) {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification("Food Expiry Alert", { body: message });
      } else {
        // Fallback to alert if notifications are not permitted
        alert(message);
      }
    }
  
    // Function to add a new item to the list
    function addItemToList(itemName, expiryDate) {
      const itemBox = document.createElement('div');
      itemBox.className = 'item-box';
  
      const itemText = document.createElement('p');
      itemText.textContent = `Item: ${itemName}`;
  
      const expiryText = document.createElement('p');
      expiryText.textContent = `Expiry Date: ${expiryDate}`;
  
      // Countdown display element
      const countdownText = document.createElement('p');
      countdownText.className = 'countdown';
  
      // Delete button with cleanup
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete-btn';
      deleteButton.addEventListener('click', function () {
        clearInterval(countdownInterval);
        itemsContainer.removeChild(itemBox);
      });
  
      itemBox.appendChild(itemText);
      itemBox.appendChild(expiryText);
      itemBox.appendChild(countdownText);
      itemBox.appendChild(deleteButton);
      itemsContainer.appendChild(itemBox);
  
      // Calculate expiry time in milliseconds
      const expiryTime = new Date(expiryDate).getTime();
  
      // Start countdown timer that updates every second
      const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = expiryTime - now;
  
        if (timeLeft <= 0) {
          countdownText.textContent = "Expired!";
          clearInterval(countdownInterval);
        } else {
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          countdownText.textContent = `Time Remaining: ${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
      }, 1000);
  
      // Set up notifications at specific thresholds: 3 days, 2 days and on expiry day.
      const thresholds = [3, 2, 0];
      thresholds.forEach(threshold => {
        let alertTime;
        if (threshold === 0) {
          alertTime = expiryTime;
        } else {
          alertTime = expiryTime - (threshold * 24 * 60 * 60 * 1000);
        }
  
        const now = new Date().getTime();
        const delay = alertTime - now;
  
        if (delay > 0) {
          setTimeout(() => {
            let message = "";
            if (threshold === 0) {
              message = `${itemName} has expired!`;
            } else {
              message = `${itemName} will expire in ${threshold} day${threshold > 1 ? 's' : ''}. Please use it soon!`;
            }
            showNotification(message);
          }, delay);
        }
      });
    }
  
    // Event listener for the Save button
    saveButton.addEventListener('click', function () {
      const itemName = itemInput.value.trim();
      const expiryDate = dateInput.value;
  
      if (itemName && expiryDate) {
        addItemToList(itemName, expiryDate);
        itemInput.value = '';
        dateInput.value = '';
      } else {
        alert('Please fill in both the item name and expiry date.');
      }
    });
  });
  