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
  const genSelect = document.getElementById("genSelect");

  const pokemonNameEl = document.getElementById("pokemonName");
  const pokemonImgEl = document.getElementById("pokemonImage");
  const pokemonTypesEl = document.getElementById("pokemonTypes");
  const statsContainer = document.getElementById("statsList");
  const learnsetContainer = document.getElementById("learnsetTable");

  // Load Pokémon list for autocomplete
  await loadPokemonList();

  // Setup search autocomplete
  setupSearch(searchInput, suggestionsBox, pokemonNameEl, pokemonImgEl, pokemonTypesEl, statsContainer, learnsetContainer, genSelect);

  // Setup generation filter
  setupGenerationFilter(genSelect);

  // Load default Pokémon
  loadPokemon("bulbasaur", genSelect.value, pokemonNameEl, pokemonImgEl, pokemonTypesEl, statsContainer, learnsetContainer);
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
// GENERATION FILTER
// ===============================
function setupGenerationFilter(genSelect) {
  genSelect.addEventListener("change", () => {
    // Nothing needed here yet, generation is passed to loadPokemon
  });
}

// ===============================
// SEARCH + AUTOCOMPLETE
// ===============================
function setupSearch(searchInput, suggestionsBox, pokemonNameEl, pokemonImgEl, pokemonTypesEl, statsContainer, learnsetContainer, genSelect) {
  searchInput.addEventListener("input", async () => {
    const query = searchInput.value.toLowerCase();
    suggestionsBox.innerHTML = "";

    if (!query) return;

    // Show up to 8 matches
    const matches = pokemonCache
      .filter(name => name.includes(query))
      .slice(0, 8);

    for (const name of matches) {
      const div = document.createElement("div");
      div.className = "suggestion";
      div.textContent = capitalize(name);
      div.onclick = () => {
        searchInput.value = name;
        suggestionsBox.innerHTML = "";
        loadPokemon(name, genSelect.value, pokemonNameEl, pokemonImgEl, pokemonTypesEl, statsContainer, learnsetContainer);
      };
      suggestionsBox.appendChild(div);
    }
  });
}

// ===============================
// LOAD POKÉMON DATA FROM API
// ===============================
async function loadPokemon(name, gen, pokemonNameEl, pokemonImgEl, pokemonTypesEl, statsContainer, learnsetContainer) {
  try {
    const response = await fetch(`${API_BASE}/pokemon/${name.toLowerCase()}`);
    if (!response.ok) throw new Error("Pokémon not found");
    const data = await response.json();

    // Load species for flavor text (filtered by generation if possible)
    const speciesRes = await fetch(`${API_BASE}/pokemon-species/${data.id}`);
    const species = await speciesRes.json();

    renderPokemon(data, species, gen, pokemonNameEl, pokemonImgEl, pokemonTypesEl, statsContainer, learnsetContainer);
  } catch (err) {
    alert("Pokémon not found");
    console.error(err);
  }
}

// ===============================
// RENDER POKÉMON
// ===============================
function renderPokemon(data, species, gen, pokemonNameEl, pokemonImgEl, pokemonTypesEl, statsContainer, learnsetContainer) {
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

  // Stats
  renderStats(data.stats, statsContainer);

  // --- Abilities (updated to match your overview tab) ---
  const abilitiesEl = document.getElementById("pokemonAbilities"); // overview span
  if (abilitiesEl) {
    abilitiesEl.innerHTML = data.abilities
      .map(a => `<span class="ability">${capitalize(a.ability.name)}</span>`)
      .join(", ");
  }

  // Learnset
  renderLearnset(data.moves, learnsetContainer);

  // Flavor text (basic)
  const flavor = species.flavor_text_entries.find(e => e.language.name === "en");
  const flavorTextEl = document.getElementById("flavorText");
  if (flavorTextEl) flavorTextEl.textContent = flavor ? flavor.flavor_text.replace(/\f/g, " ") : "";
}

// ===============================
// RENDER STATS AS BARS
// ===============================
function renderStats(stats, container) {
  container.innerHTML = "";

  stats.forEach(stat => {
    const li = document.createElement("li");
    li.className = "stat-row";

    const label = document.createElement("span");
    label.textContent = formatStatName(stat.stat.name);
    label.className = "stat-label";

    const barContainer = document.createElement("div");
    barContainer.className = "stat-bar-container";

    const bar = document.createElement("div");
    bar.className = "stat-bar";
    const percent = Math.min((stat.base_stat / 255) * 100, 100);
    bar.style.width = percent + "%";
    bar.style.background = getStatColor(stat.base_stat);

    barContainer.appendChild(bar);
    li.append(label, barContainer);
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
      return { name: m.move.name, level: levelUp.level_learned_at };
    })
    .filter(Boolean)
    .sort((a, b) => a.level - b.level)
    .forEach(m => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${m.level}</td><td>${capitalize(m.name)}</td><td>—</td>`;
      container.appendChild(row);
    });
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
