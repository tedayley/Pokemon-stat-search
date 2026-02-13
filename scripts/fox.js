async function getRandomFox() {
  try {
    const response = await fetch("https://randomfox.ca/floof/");

    if (!response.ok) {
      throw new Error("API error");
    }

    const data = await response.json();

    const popup = window.open("", "_blank", "width=600,height=600");

    if (!popup) {
      alert("Popup blocked. Please allow popups.");
      return;
    }

    popup.document.write(`
      <html>
        <head>
          <title>Random Fox</title>
          <style>
            body {
              margin: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              background: #111;
              height: 100vh;
            }
            img {
              max-width: 100%;
              max-height: 100%;
              border-radius: 12px;
              box-shadow: 0 0 20px orange;
            }
          </style>
        </head>
        <body>
          <img src="${data.image}" alt="Random Fox">
        </body>
      </html>
    `);

    popup.document.close();

  } catch (error) {
    console.error("Error fetching fox image:", error);
    alert("Failed to fetch fox 🦊");
  }
}

window.getRandomFox = getRandomFox;
