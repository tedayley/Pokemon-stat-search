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

// Neon glow styling
clock.style.color = "#000000";
clock.style.textShadow = `
  0 0 4px #00f0ff,
  0 0 8px #00f0ff,
  0 0 12px #00f0ff,
  0 0 16px #ff00ff,
  0 0 20px #ff00ff
`;

footer.appendChild(clock);

// Update clock using LOCAL time only
function updateClock() {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  clock.textContent = `${hours}:${minutes}:${seconds}`;
}

// Start clock
updateClock();
setInterval(updateClock, 1000);
