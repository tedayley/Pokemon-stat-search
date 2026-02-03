// Create a footer element if it doesn't exist
let footer = document.querySelector("footer");
if (!footer) {
  footer = document.createElement("footer");
  document.body.appendChild(footer);
  footer.style.textAlign = "center";
  footer.style.padding = "16px";
  footer.style.background = "rgba(0,0,0,0.7)";
}

// Create clock element
const clock = document.createElement("div");
clock.classList.add("neon-clock");
clock.style.fontWeight = "bold";
clock.style.fontSize = "24px";
clock.style.display = "inline-block";
footer.appendChild(clock);

// Neon glow style
const neonStyle = `
  color: #000000;
  text-shadow:
    0 0 4px #00f0ff,
    0 0 8px #00f0ff,
    0 0 12px #00f0ff,
    0 0 16px #ff00ff,
    0 0 20px #ff00ff;
`;

// Apply neon style
clock.style.cssText += neonStyle;

// Function to fetch time from an API (worldtimeapi.org)
async function fetchTime() {
  try {
    const res = await fetch("http://worldtimeapi.org/api/ip");
    const data = await res.json();
    return new Date(data.datetime);
  } catch (err) {
    console.error("Failed to fetch time, falling back to local time.", err);
    return new Date(); // fallback to local
  }
}

// Update the clock every second
async function updateClock() {
  const time = await fetchTime();
  const hours = String(time.getHours()).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");
  const seconds = String(time.getSeconds()).padStart(2, "0");
  clock.textContent = `${hours}:${minutes}:${seconds}`;
}

// Initial call
updateClock();

// Update every second
setInterval(updateClock, 1000);
