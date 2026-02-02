// ===============================
// TYPE CHART RENDERER
// ===============================

const typeColors = {
  fire:    "#ff4500",
  water:   "#1e90ff",
  grass:   "#32cd32",
  electric:"#ffd700",
  ice:     "#00ffff",
  fighting:"#8b0000",
  poison:  "#9400d3",
  ground:  "#cd853f",
  flying:  "#87ceeb",
  psychic: "#ff1493",
  bug:     "#9acd32",
  rock:    "#a9a9a9",
  ghost:   "#4b0082",
  dragon:  "linear-gradient(45deg,#00ff00,#00ffff)",
  dark:    "#2f4f4f",
  steel:   "#b0c4de",
  fairy:   "#ffb6c1",
  normal:  "#a8a878"
};

// All Pokémon types for the chart
const allTypes = [
  "normal","fire","water","electric","grass","ice","fighting","poison","ground",
  "flying","psychic","bug","rock","ghost","dragon","dark","steel","fairy"
];

// Sample weaknesses/resistances table (multiplier values)
const typeEffectiveness = {
  normal:   {rock:0.5,ghost:0,steel:0.5},
  fire:     {fire:0.5,water:0.5,grass:2,ice:2,bug:2,rock:0.5,steel:2},
  water:    {fire:2,water:0.5,grass:0.5,ground:2,rock:2,dragon:0.5},
  electric:{water:2,electric:0.5,grass:0.5,ground:0,flying:2,dragon:0.5},
  grass:    {fire:0.5,water:2,grass:0.5,poison:0.5,ground:2,flying:0.5,bug:0.5,rock:2,dragon:0.5,steel:0.5},
  ice:      {fire:0.5,water:0.5,grass:2,ice:0.5,ground:2,flying:2,dragon:2,steel:0.5},
  fighting:{normal:2,ice:2,rock:2,psychic:0.5,bug:0.5,ghost:0,dark:2,steel:2,fairy:0.5},
  poison:   {grass:2,poison:0.5,ground:0.5,rock:0.5,ghost:0.5,steel:0,fairy:2},
  ground:   {fire:2,electric:2,grass:0.5,poison:2,flying:0,bug:0.5,rock:2,steel:2},
  flying:   {electric:0.5,grass:2,fighting:2,bug:2,rock:0.5,steel:0.5},
  psychic:  {fighting:2,poison:2,psychic:0.5,dark:0,steel:0.5},
  bug:      {fire:0.5,grass:2,fighting:0.5,poison:0.5,flying:0.5,psychic:2,ghost:0.5,dark:2,steel:0.5,fairy:0.5},
  rock:     {fire:2,ice:2,fighting:0.5,ground:0.5,flying:2,bug:2,steel:0.5},
  ghost:    {normal:0,psychic:2,ghost:2,dark:0.5},
  dragon:   {dragon:2,steel:0.5,fairy:0},
  dark:     {fighting:0.5,psychic:2,ghost:2,dark:0.5,fairy:0.5},
  steel:    {fire:0.5,water:0.5,electric:0.5,ice:2,rock:2,steel:0.5,fairy:2},
  fairy:    {fire:0.5,fighting:2,poison:0.5,dragon:2,dark:2,steel:0.5}
};

// ===============================
// RENDER THE TYPE CHART
// ===============================
function renderTypeChart(containerId = "calculator") {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Clear container
  container.innerHTML = "";

  // Create chart table
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";
  table.style.textAlign = "center";

  // Table header row
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headerRow.appendChild(document.createElement("th")); // empty corner cell

  allTypes.forEach(type => {
    const th = document.createElement("th");
    th.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    th.style.padding = "4px";
    th.style.color = "#0ff";
    th.style.textShadow = "0 0 4px #0ff, 0 0 8px #0ff";
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Table body
  const tbody = document.createElement("tbody");

  allTypes.forEach(attacker => {
    const row = document.createElement("tr");

    const rowHeader = document.createElement("th");
    rowHeader.textContent = attacker.charAt(0).toUpperCase() + attacker.slice(1);
    rowHeader.style.color = "#0ff";
    rowHeader.style.textShadow = "0 0 4px #0ff, 0 0 8px #0ff";
    rowHeader.style.padding = "4px";
    row.appendChild(rowHeader);

    allTypes.forEach(defender => {
      const td = document.createElement("td");
      const multiplier = typeEffectiveness[attacker]?.[defender] ?? 1;

      td.textContent = multiplier;
      td.style.padding = "4px";
      td.style.fontWeight = "bold";
      td.style.color = "#fff";
      td.style.border = "1px solid #0ff";
      td.style.backgroundColor = getMultiplierColor(multiplier);
      td.style.textShadow = "0 0 4px currentColor";
      row.appendChild(td);
    });

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

// ===============================
// COLOR BY MULTIPLIER
// ===============================
function getMultiplierColor(multiplier) {
  switch (multiplier) {
    case 0:    return "#333";        // immune → dark grey
    case 0.5: return "#0a8f3d";     // quad resist → deep emerald
    case 0.25:  return "#1abc66";     // resist → soft emerald
    case 1:    return "#111";        // neutral → very dark background
    case 4:    return "#cc4b2e";     // weak → ruby orange
    case 2:    return "#b22222";     // quad weak → deep ruby red
    default:   return "#111";        // fallback
  }
}

// Automatically render when file is loaded
document.addEventListener("DOMContentLoaded", () => renderTypeChart("typechart"));

