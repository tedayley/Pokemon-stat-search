// ===============================
// TAB SWITCHING
// ===============================
const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    contents.forEach(c => c.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

// ===============================
// RANDOM NAME GENERATOR BUTTON
// ===============================
const nameGenButton = document.getElementById("openNameGen");
const nameOutput = document.getElementById("generatedName");

function generatePokemonName() {
  const starts = [
    "ka", "zu", "mi", "ra", "to", "shi", "no", "li",
    "py", "fi", "dra", "ze", "cha", "lu", "sa", "ve"
  ];

  const middles = [
    "ra", "zu", "mi", "lo", "ka", "shi", "ven", "tor",
    "la", "ne", "ri", "do", "ma"
  ];

  const ends = [
    "mon", "chu", "rex", "dra", "lin", "gon", "fy",
    "no", "ra", "tar", "zor", "ling", "mite"
  ];

  let name =
    starts[Math.floor(Math.random() * starts.length)] +
    (Math.random() > 0.5
      ? middles[Math.floor(Math.random() * middles.length)]
      : "") +
    ends[Math.floor(Math.random() * ends.length)];

  // Cleanup rules
  name = name
    .replace(/aa|ee|ii|oo|uu/g, match => match[0])
    .replace(/kk|zz|rr|tt|ll|ss/g, match => match[0])
    .replace(/(.)\1{2,}/g, "$1$1");

  return name.charAt(0).toUpperCase() + name.slice(1);
}

// Generate on page load
document.addEventListener("DOMContentLoaded", () => {
  nameOutput.textContent = `Random Pokémon Name: ${generatePokemonName()}`;
});

nameGenButton.addEventListener("click", () => {
  nameOutput.textContent = `Random Pokémon Name: ${generatePokemonName()}`;
});




// ===============================
// THEME PULSE IS IN themePulse.js
// ===============================
// This file does NOT touch Pokémon DOM elements
// All Pokémon-specific UI is handled in pokemonData.js

// ===============================
// OPTIONAL: PAGE LOAD DEFAULT
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  // Any non-Pokémon page logic goes here
  console.log("Script.js loaded — tabs and name generator ready.");
});
