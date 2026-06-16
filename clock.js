// Timezone data
const timezones = [
  { city: "Bucharest", tz: "Europe/Bucharest" },
  { city: "London", tz: "Europe/London" },
  { city: "New York", tz: "America/New_York" },
  { city: "Los Angeles", tz: "America/Los_Angeles" },
  { city: "Tokyo", tz: "Asia/Tokyo" },
  { city: "Sydney", tz: "Australia/Sydney" },
  { city: "Dubai", tz: "Asia/Dubai" },
  { city: "Singapore", tz: "Asia/Singapore" },
  { city: "Paris", tz: "Europe/Paris" },
  { city: "Hong Kong", tz: "Asia/Hong_Kong" },
  { city: "Bangkok", tz: "Asia/Bangkok" },
  { city: "São Paulo", tz: "America/Sao_Paulo" }
];

let is24Hour = true;

// Initialize clocks
function initClocks() {
  const grid = document.getElementById('clocks-grid');
  grid.innerHTML = '';
  
  timezones.forEach((item, index) => {
    const clockCard = document.createElement('div');
    clockCard.className = 'clock-card';
    clockCard.id = `clock-${index}`;
    grid.appendChild(clockCard);
  });
  
  updateAllClocks();
  setInterval(updateAllClocks, 1000);
}

// Update all clocks
function updateAllClocks() {
  timezones.forEach((item, index) => {
    const clockCard = document.getElementById(`clock-${index}`);
    const now = new Date();
    
    // Get time in specific timezone
    const timeString = now.toLocaleString('en-US', {
      timeZone: item.tz,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: !is24Hour
    });
    
    const dateString = now.toLocaleString('en-US', {
      timeZone: item.tz,
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    clockCard.innerHTML = `
      <div class="timezone-name">${item.tz}</div>
      <div class="city-name">${item.city}</div>
      <div class="time">${timeString}</div>
      <div class="date">${dateString}</div>
    `;
  });
}

// Format toggle buttons
document.getElementById('btn-24h').addEventListener('click', function() {
  is24Hour = true;
  document.getElementById('btn-24h').classList.add('active');
  document.getElementById('btn-12h').classList.remove('active');
  updateAllClocks();
});

document.getElementById('btn-12h').addEventListener('click', function() {
  is24Hour = false;
  document.getElementById('btn-12h').classList.add('active');
  document.getElementById('btn-24h').classList.remove('active');
  updateAllClocks();
});

// Start clocks
initClocks();