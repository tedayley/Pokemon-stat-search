function updateStylesheetForPhone() {
  const phoneCSS = document.getElementById("phone-styles");
  if (window.innerHeight > window.innerWidth) {
    // vertical screen = enable phone.css
    phoneCSS.disabled = false;
  } else {
    // horizontal screen = disable phone.css
    phoneCSS.disabled = true;
  }
}

// Run on load
window.addEventListener("DOMContentLoaded", updateStylesheetForPhone);

// Run on resize/orientation change
window.addEventListener("resize", updateStylesheetForPhone);
