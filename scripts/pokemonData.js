// ===============================
// POKÉAPI CONFIG
// ===============================
const API_BASE = "https://pokeapi.co/api/v2";

// Cache Pokémon list for autocomplete
let pokemonCache = [];

// ===============================
// DOMContentLoaded WRAPPER
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
  // DOM Elements
  const searchInput = document.getElementById("pokemonSearch");
  const suggestionsBox = document.getElementById("searchSuggestions");
  const pokemonDexEl = document.getElementById("dexNumber");
  const pokemonNameEl = document.getElementById("pokemonName");
  const pokemonImgEl = document.getElementById("pokemonImage");
  const pokemonTypesEl = document.getElementById("pokemonTypes");
  const statsContainer = document.getElementById("statsList");
  const learnsetContainer = document.getElementById("learnsetTable");

  // Load Pokémon list for autocomplete
  await loadPokemonList();

  // Setup search autocomplete
  setupSearch(searchInput, suggestionsBox, pokemonNameEl, pokemonDexEl, pokemonImgEl, pokemonTypesEl, statsContainer, learnsetContainer);

  // Load default Pokémon
  loadPokemon("bulbasaur", pokemonNameEl, pokemonDexEl, pokemonImgEl, pokemonTypesEl, statsContainer, learnsetContainer);
});

// ===============================
// LOAD POKÉMON LIST FOR AUTOCOMPLETE
// ===============================
async function loadPokemonList() {
  const response = await fetch(`${API_BASE}/pokemon?limit=1025`);
  const data = await response.json();
  pokemonCache = data.results.map(p => p.name);
}

// ===============================
// SEARCH + AUTOCOMPLETE
// ===============================
function setupSearch(searchInput, suggestionsBox, pokemonNameEl, pokemonDexEl, pokemonImgEl, pokemonTypesEl, statsContainer, learnsetContainer) {
  let selectedIndex = -1; // tracks arrow key selection

  // Position dropdown above input if near bottom of viewport
  function positionDropdown() {
    const rect = searchInput.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = suggestionsBox.offsetHeight;

    if (dropdownHeight > spaceBelow && spaceBelow < 200) {
      suggestionsBox.style.top = `-${dropdownHeight + 2}px`;
    } else {
      suggestionsBox.style.top = "100%";
    }
  }

  // Highlight selected suggestion
  function updateHighlight(items, index) {
    items.forEach((item, i) => {
      if (i === index) {
        item.classList.add("highlighted");
        // Scroll the highlighted item into view
        item.scrollIntoView({ block: "nearest", behavior: "smooth" });
      } else {
        item.classList.remove("highlighted");
      }
    });
  }


  // Handle selecting a suggestion
  function selectSuggestion(name) {
    searchInput.value = capitalize(name);
    suggestionsBox.innerHTML = "";
    suggestionsBox.style.display = "none";
    loadPokemon(name, pokemonNameEl, pokemonDexEl, pokemonImgEl, pokemonTypesEl, statsContainer, learnsetContainer);
  }

  // Input event: filter suggestions
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    suggestionsBox.innerHTML = "";
    selectedIndex = -1;

    if (!query) {
      suggestionsBox.style.display = "none";
      return;
    }

    const matches = pokemonCache
      .filter(name => name.includes(query))
      .slice(0, 8);

    if (matches.length === 0) {
      suggestionsBox.style.display = "none";
      return;
    }

    matches.forEach((name, index) => {
      const div = document.createElement("div");
      div.className = "suggestion";
      div.textContent = capitalize(name);
      div.dataset.index = index;

      div.addEventListener("click", () => selectSuggestion(name));

      suggestionsBox.appendChild(div);
    });

    suggestionsBox.style.display = "block";
    positionDropdown();
  });

  // Arrow key navigation + Enter
  searchInput.addEventListener("keydown", (e) => {
    const items = suggestionsBox.querySelectorAll(".suggestion");
    if (items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % items.length;
      updateHighlight(items, selectedIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + items.length) % items.length;
      updateHighlight(items, selectedIndex);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < items.length) {
        selectSuggestion(items[selectedIndex].textContent);
      } else if (searchInput.value.trim() !== "") {
        loadPokemon(searchInput.value.toLowerCase(), pokemonNameEl, pokemonDexEl, pokemonImgEl, pokemonTypesEl, statsContainer, learnsetContainer);
        suggestionsBox.style.display = "none";
      }
    }
  });

  // Click outside to hide suggestions
  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
      suggestionsBox.style.display = "none";
    }
  });

  // Reposition dropdown on window resize/scroll
  window.addEventListener("resize", positionDropdown);
  window.addEventListener("scroll", positionDropdown);
}

// ===============================
// LOAD POKÉMON DATA FROM API
// ===============================
async function loadPokemon(name, pokemonNameEl, pokemonDexEl, pokemonImgEl, pokemonTypesEl, statsContainer, learnsetContainer) {
  try {
    const response = await fetch(`${API_BASE}/pokemon/${name.toLowerCase()}`);
    if (!response.ok) throw new Error("Pokémon not found");
    const data = await response.json();

    const speciesRes = await fetch(`${API_BASE}/pokemon-species/${data.id}`);
    const species = await speciesRes.json();

    renderPokemon(data, species, pokemonNameEl, pokemonDexEl, pokemonImgEl, pokemonTypesEl, statsContainer, learnsetContainer);
  } catch (err) {
    alert("Pokémon not found");
    console.error(err);
  }
}

// ===============================
// RENDER POKÉMON
// ===============================
function renderPokemon(data, species, pokemonNameEl, pokemonDexEl, pokemonImgEl, pokemonTypesEl, statsContainer, learnsetContainer) {
  // Name & image
  pokemonNameEl.textContent = capitalize(data.name);
  pokemonImgEl.src = data.sprites.other["official-artwork"].front_default;

  // Types
  pokemonTypesEl.innerHTML = "";
  data.types.forEach(t => {
    const span = document.createElement("span");
    span.className = `type ${t.type.name}`;
    span.textContent = capitalize(t.type.name);
    pokemonTypesEl.appendChild(span);
  });

  // Type effectiveness calculator
  const pokemonTypes = data.types.map(t => t.type.name);
  renderTypeCalculator(pokemonTypes);


  if (pokemonDexEl) {
    pokemonDexEl.textContent = `#${data.id.toString().padStart(4, "0")}`;
  }


  // Stats
  renderStats(data.stats, statsContainer);

  // Abilities
  const abilitiesEl = document.getElementById("pokemonAbilities");
  if (abilitiesEl) {
    abilitiesEl.innerHTML = "";
    data.abilities.forEach(async (a) => {
      const abilityName = capitalize(a.ability.name);
      const span = document.createElement("span");
      span.className = "ability";
      span.textContent = abilityName;

      try {
        const res = await fetch(a.ability.url);
        const abilityData = await res.json();
        const effectEntry = abilityData.effect_entries.find(entry => entry.language.name === "en");
        span.dataset.tooltip = effectEntry ? effectEntry.effect : "No description available";
      } catch (err) {
        console.error("Ability fetch error:", err);
        span.dataset.tooltip = "Description unavailable";
      }

      abilitiesEl.appendChild(span);
      if (a !== data.abilities[data.abilities.length - 1]) {
        abilitiesEl.appendChild(document.createTextNode(", "));
      }
    });
  }

  // Learnset
  renderLearnset(data.moves, learnsetContainer);

  // Other moves
  const otherMovesContainer = document.getElementById("otherMovesTable");
  if (otherMovesContainer) {
    renderOtherMoves(data.moves, otherMovesContainer);
  }

  // Flavor text
  const flavor = species.flavor_text_entries.find(e => e.language.name === "en");
  const flavorTextEl = document.getElementById("flavorText");
  if (flavorTextEl) flavorTextEl.textContent = flavor ? flavor.flavor_text.replace(/\f/g, " ") : "";
}

// ===============================
// RENDER STATS
// ===============================
function renderStats(stats, container) {
  container.innerHTML = "";

  stats.forEach(stat => {
    const li = document.createElement("li");
    li.className = "stat-row";
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.gap = "10px"; // spacing between elements

    // Stat name
    const label = document.createElement("span");
    label.textContent = formatStatName(stat.stat.name);
    label.style.fontWeight = "bold";
    label.style.fontSize = "0.95rem";
    label.style.width = "100px"; // fixed width for alignment
    label.style.color = getStatColor(stat.base_stat);
    label.style.textShadow = `0 0 1px ${getStatColor(stat.base_stat)}, 0 0 1px ${getStatColor(stat.base_stat)}`; // softer glow

    // Stat numeric value
    const value = document.createElement("span");
    value.textContent = stat.base_stat;
    value.style.width = "40px";
    value.style.textAlign = "right";
    value.style.fontWeight = "bold";
    value.style.fontSize = "0.95rem";
    value.style.color = getStatColor(stat.base_stat);
    value.style.textShadow = `0 0 1px ${getStatColor(stat.base_stat)}, 0 0 1px ${getStatColor(stat.base_stat)}`; // softer glow

    // Bar container
    const barContainer = document.createElement("div");
    barContainer.className = "stat-bar-container";
    barContainer.style.flexGrow = "1"; // make bar take remaining space

    const bar = document.createElement("div");
    bar.className = "stat-bar";
    const percent = Math.min((stat.base_stat / 255) * 100, 100);
    bar.style.width = percent + "%";
    bar.style.background = getStatColor(stat.base_stat);
    bar.style.boxShadow = `0 0 6px ${getStatColor(stat.base_stat)}`; // slightly softer glow

    barContainer.appendChild(bar);
    li.append(label, value, barContainer);
    container.appendChild(li);
  });
}


// ===============================
// RENDER LEARNSET
// ===============================
function renderLearnset(moves, container) {
  container.innerHTML = "";
  moves
    .map(m => {
      const levelUp = m.version_group_details.find(d => d.move_learn_method.name === "level-up");
      if (!levelUp) return null;
      return { name: m.move.name, level: levelUp.level_learned_at, url: m.move.url};
    })
    .filter(Boolean)
    .sort((a, b) => a.level - b.level)
    .forEach(m => {
      const row = document.createElement("tr");
      const levelTd = document.createElement("td");
      levelTd.textContent = m.level;
      levelTd.classList.add("move-level");

      const moveTd = document.createElement("td");
      moveTd.textContent = capitalize(m.name);
      moveTd.classList.add("move-name");
      attachMoveTooltip(moveTd, m.url);

      row.append(levelTd, moveTd);

      container.appendChild(row);
    });
}

// ===============================
// RENDER MoveSET
// ===============================
function renderOtherMoves(moves, container) {
  container.innerHTML = "";

  const seen = new Set();

  moves.forEach(m => {
    m.version_group_details.forEach(d => {
      if (d.move_learn_method.name === "level-up") return;

      const key = `${m.move.name}-${d.move_learn_method.name}`;
      if (seen.has(key)) return;
      seen.add(key);

      const row = document.createElement("tr");

      // Learn method
      const methodTd = document.createElement("td");
      methodTd.textContent = capitalize(
        d.move_learn_method.name.replace("-", " ")
      );
      methodTd.classList.add("move-method");

      // Move name
      const moveTd = document.createElement("td");
      moveTd.textContent = capitalize(m.move.name);
      moveTd.classList.add("move-name");

      // Tooltip hookup
      attachMoveTooltip(moveTd, m.move.url);

      row.append(methodTd, moveTd);
      container.appendChild(row);
    });
  });
}


// ===============================
// Hover moves
// ===============================
async function attachMoveTooltip(cell, moveUrl) {
  try {
    const res = await fetch(moveUrl);
    const moveData = await res.json();

    const effect = moveData.effect_entries.find(
      e => e.language.name === "en"
    );

    const power = moveData.power ?? "—";
    const accuracy = moveData.accuracy ?? "—";
    const type = capitalize(moveData.type.name);

    cell.dataset.tooltip = `
${type} type
Power: ${power}
Accuracy: ${accuracy}

${effect ? effect.short_effect : "No description available."}
    `.trim();
  } catch (err) {
    console.error("Move tooltip error:", err);
    cell.dataset.tooltip = "Move data unavailable.";
  }
}


// ===============================
// UTILITIES
// ===============================
function capitalize(str) {
  return str.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function formatStatName(name) {
  return name.replace("special-", "Sp. ").replace("-", " ").toUpperCase();
}

function getStatColor(value) {
  if (value < 50) return "#ff3b3b";     // red
  if (value < 80) return "#ffcc00";     // yellow
  if (value < 120) return "#4cff4c";    // green
  return "#b84cff";                     // purple
}
