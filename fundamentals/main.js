const deployText = document.querySelector("#deploy-text");

if (deployText) {
  const scriptPath = new URL("./main.js", window.location.href).pathname;
  deployText.textContent = `Relative Pfade sind aktiv. Dieses Skript wird aus ${scriptPath} geladen.`;
}
