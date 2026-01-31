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
  const starts = ["ka", "zu", "mi", "ra", "to", "shi", "no", "li", "py", "fi", "dra", "ze", "cha", "lu", "sa", "ve"];
  const middles = ["ra", "zu", "mi", "lo", "ka", "shi", "la", "ne", "ri", "do", "ma"];
  const ends = ["mon", "chu", "lin", "fy", "no", "ra", "tar", "zor", "ling"];

  // Almost always 2-syllable names, sometimes 3
  let name = starts[Math.floor(Math.random() * starts.length)];
  if (Math.random() < 0.2) { // 20% chance for middle syllable
    name += middles[Math.floor(Math.random() * middles.length)];
  }
  name += ends[Math.floor(Math.random() * ends.length)];

  // Cleanup repeated letters
  name = name
    .replace(/aa|ee|ii|oo|uu/g, match => match[0])
    .replace(/kk|zz|rr|tt|ll|ss/g, match => match[0])
    .replace(/(.)\1{2,}/g, "$1$1");

  // Force maximum length of 5-6 letters for really short names
  if (name.length > 6 && Math.random() < 0.5) {
    name = name.slice(0, 6);
  }

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
