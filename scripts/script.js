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

nameGenButton.addEventListener("click", () => {
  // Simple random name generator
  const syllables = ["ka", "zu", "mi", "ra", "to", "shi", "no", "li", "pa"];
  const name =
    syllables[Math.floor(Math.random() * syllables.length)] +
    syllables[Math.floor(Math.random() * syllables.length)];
  alert(`Random Pokémon Name: ${name.charAt(0).toUpperCase() + name.slice(1)}`);
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
