import { ReactDOM, html } from "./runtime.js";
import { App } from "./components/App.js";

ReactDOM.createRoot(document.getElementById("app")).render(html`<${App} />`);
