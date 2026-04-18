import { html } from "../runtime.js";

export function HeaderActions({
  mode,
  onModeChange,
  onImportClick,
  onExportClick,
  onLoadSample,
}) {
  return html`
    <div className="editor-actions">
      <button className="button" type="button" onClick=${onImportClick}>
        Markdown importieren
      </button>
      <button
        className="button button-primary"
        type="button"
        onClick=${onExportClick}
      >
        Dokument exportieren
      </button>
      <button className="button" type="button" onClick=${onLoadSample}>
        Beispiel laden
      </button>
      <div className="mode-toggle" role="tablist" aria-label="Editor-Modus">
        <button
          className="toggle-chip"
          type="button"
          role="tab"
          aria-selected=${mode === "markdown"}
          aria-pressed=${mode === "markdown"}
          onClick=${() => onModeChange("markdown")}
        >
          Markdown
        </button>
        <button
          className="toggle-chip"
          type="button"
          role="tab"
          aria-selected=${mode === "blocks"}
          aria-pressed=${mode === "blocks"}
          onClick=${() => onModeChange("blocks")}
        >
          Blockmodus
        </button>
      </div>
    </div>
  `;
}
