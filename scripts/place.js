// Get the elements we'll need
const tempElement = document.getElementById("temperature");
const windspeedElement = document.getElementById("windspeed");
const windchillElement = document.getElementById("windchill");

// Get the static values (already set in your HTML)
const temp = parseFloat(tempElement.textContent);
const windspeed = parseFloat(windspeedElement.textContent);

// Function to calculate wind chill
function calculateWindChill(temp, windspeed) {
    return 13.12 + 0.6215 * temp - 11.37 * Math.pow(windspeed, 0.16) + 0.3965 * temp * Math.pow(windspeed, 0.16);
}

// Check conditions and update wind chill
if (temp <= 10 && windspeed > 4.8) {
    const windchill = calculateWindChill(temp, windspeed);
    windchillElement.textContent = `${windchill.toFixed(1)}°C`;
} else {
    windchillElement.textContent = "N/A";
}

// Get the current year
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Get the last modified date
document.getElementById('lastModified').textContent = document.lastModified;