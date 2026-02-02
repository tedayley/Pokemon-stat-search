// nature.js

const stats = ["Attack", "Defense", "Sp. Atk", "Sp. Def", "Speed"];
const natures = [
  { name: "Adamant", increase: "Attack", decrease: "Sp. Atk" },
  { name: "Bashful", increase: "Attack", decrease: "Attack" }, // neutral
  { name: "Bold", increase: "Defense", decrease: "Attack" },
  { name: "Brave", increase: "Attack", decrease: "Speed" },
  { name: "Calm", increase: "Sp. Def", decrease: "Attack" },
  { name: "Careful", increase: "Sp. Def", decrease: "Sp. Atk" },
  { name: "Docile", increase: "Defense", decrease: "Defense" }, // neutral
  { name: "Gentle", increase: "Sp. Def", decrease: "Defense" },
  { name: "Hardy", increase: "Sp. Atk", decrease: "Sp. Atk" }, // neutral
  { name: "Hasty", increase: "Speed", decrease: "Defense" },
  { name: "Impish", increase: "Defense", decrease: "Sp. Atk" },
  { name: "Jolly", increase: "Speed", decrease: "Sp. Atk" },
  { name: "Lax", increase: "Defense", decrease: "Sp. Def" },
  { name: "Lonely", increase: "Attack", decrease: "Defense" },
  { name: "Mild", increase: "Sp. Atk", decrease: "Defense" },
  { name: "Modest", increase: "Sp. Atk", decrease: "Attack" },
  { name: "Naive", increase: "Speed", decrease: "Sp. Def" },
  { name: "Naughty", increase: "Attack", decrease: "Sp. Def" },
  { name: "Quiet", increase: "Sp. Atk", decrease: "Speed" },
  { name: "Quirky", increase: "Sp. Def", decrease: "Sp. Def" }, // neutral
  { name: "Rash", increase: "Sp. Atk", decrease: "Sp. Def" },
  { name: "Relaxed", increase: "Defense", decrease: "Speed" },
  { name: "Sassy", increase: "Sp. Def", decrease: "Speed" },
  { name: "Serious", increase: "Speed", decrease: "Speed" }, // neutral
  { name: "Timid", increase: "Speed", decrease: "Attack" }
];

function createNatureMatrix() {
  const container = document.getElementById("naturechart");
  if (!container) return;

  const table = document.createElement("table");
  table.classList.add("neon-table");

  // Header row: buffed stats
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const emptyTh = document.createElement("th");
  emptyTh.textContent = "↓ Nerfed / ↑ Buffed";
  headerRow.appendChild(emptyTh);

  stats.forEach(stat => {
    const th = document.createElement("th");
    th.textContent = stat;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Table body: debuffed stats as rows
  const tbody = document.createElement("tbody");

  stats.forEach(decreaseStat => {
    const row = document.createElement("tr");
    const rowHeader = document.createElement("th");
    rowHeader.textContent = decreaseStat;
    row.appendChild(rowHeader);

    stats.forEach(increaseStat => {
      const cell = document.createElement("td");

      const matchingNatures = natures
        .filter(n => n.increase === increaseStat && n.decrease === decreaseStat)
        .map(n => n.name);

      cell.textContent = matchingNatures.join(", ") || "-";

      // Apply thrumming pulse effect
      cell.classList.add("thrumming");

      row.appendChild(cell);
    });

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

document.addEventListener("DOMContentLoaded", createNatureMatrix);
