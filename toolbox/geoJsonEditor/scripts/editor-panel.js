export class GeoJsonEditorPanel {
  constructor(options) {
    this.options = options;
    this.editor = document.getElementById("json-editor");
    this.statusText = document.getElementById("status-text");
    this.featureCount = document.getElementById("feature-count");
    this.loadSampleButton = document.getElementById("load-sample");
    this.applyJsonButton = document.getElementById("apply-json");
    this.formatJsonButton = document.getElementById("format-json");
    this.clearAllButton = document.getElementById("clear-all");

    this.bindEvents();
  }

  bindEvents() {
    this.loadSampleButton.addEventListener("click", () => {
      this.options.onLoadSample();
    });

    this.applyJsonButton.addEventListener("click", () => {
      this.handleApplyJson();
    });

    this.formatJsonButton.addEventListener("click", () => {
      this.handleFormatJson();
    });

    this.clearAllButton.addEventListener("click", () => {
      this.options.onClearAll();
    });

    this.editor.addEventListener("input", () => {
      this.setUnsavedChangesStatus();
    });
  }

  render(geojson) {
    this.editor.value = JSON.stringify(geojson, null, 2);
    this.updateFeatureCount(geojson.features.length);
  }

  setStatus(message, isError) {
    this.statusText.textContent = message;
    this.statusText.style.color = isError ? "var(--error)" : "";
  }

  setUnsavedChangesStatus() {
    this.statusText.textContent = "Ungespeicherte Änderungen im Editor";
    this.statusText.style.color = "";
  }

  updateFeatureCount(count) {
    this.featureCount.textContent = `${count} Feature${count === 1 ? "" : "s"}`;
  }

  handleApplyJson() {
    try {
      const parsedGeojson = JSON.parse(this.editor.value);
      this.options.onApplyJson(parsedGeojson);
    } catch (error) {
      this.setStatus(error.message || "Ungültiges JSON.", true);
    }
  }

  handleFormatJson() {
    try {
      const parsedGeojson = JSON.parse(this.editor.value);
      this.editor.value = JSON.stringify(parsedGeojson, null, 2);
      this.setStatus("JSON formatiert.", false);
    } catch (error) {
      this.setStatus("Formatieren nicht möglich: ungültiges JSON.", true);
    }
  }
}
