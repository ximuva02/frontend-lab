import { html, useRef, useState } from "../runtime.js";
import { sampleMarkdown } from "../sample-markdown.js";
import { store } from "../editor-app-state.js";
import {
  readMarkdownFile,
  downloadMarkdown,
} from "../import-export-service.js";
import { useEditorStore } from "../hooks/use-editor-store.js";
import { classNames } from "../utils/class-names.js";
import { createStatus } from "../utils/status.js";
import { HeaderActions } from "./HeaderActions.js";
import { MarkdownTextareaView } from "./MarkdownTextareaView.js";
import { BlockEditorView } from "./BlockEditorView.js";
import { PreviewPanel } from "./PreviewPanel.js";

export function App() {
  const fileInputRef = useRef(null);
  const snapshot = useEditorStore(store);
  const [mode, setMode] = useState("blocks");

  const handleDocumentChange = (
    nextDocument,
    statusMessage = "Markdown aktualisiert.",
  ) => {
    store.setDocument(nextDocument, createStatus("ok", statusMessage));
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const markdown = await readMarkdownFile(file);
      store.setDocument(
        markdown,
        createStatus("ok", `${file.name} importiert.`),
      );
    } catch (error) {
      store.setStatus(
        createStatus("error", error.message || "Import fehlgeschlagen."),
      );
    } finally {
      event.target.value = "";
    }
  };

  const handleExport = () => {
    downloadMarkdown("markdown-editor.md", snapshot.document);
    store.setStatus(createStatus("ok", "Dokument exportiert."));
  };

  const statusClassName = classNames(
    snapshot.status.kind === "ok" && "status-ok",
    snapshot.status.kind === "error" && "status-error",
    snapshot.status.kind === "warning" && "status-warning",
  );

  return html`
    <main className="editor-page">
      <section className="editor-hero">
        <div className="editor-hero-copy">
          <p className="eyebrow">frontend-lab toolbox</p>
          <h1>Markdown Editor</h1>
          <p className="intro">
            Blockmodus als primäre Schreiboberfläche: Kontinuierliches Schreiben
            in Bausteinen mit Slash-Commands. Markdown bleibt die rohe
            Quelle und ist als sekundäre Ansicht verfügbar.
          </p>
        </div>

        <${HeaderActions}
          mode=${mode}
          onModeChange=${setMode}
          onImportClick=${() => fileInputRef.current?.click()}
          onExportClick=${handleExport}
          onLoadSample=${() =>
            store.setDocument(
              sampleMarkdown,
              createStatus("ok", "Beispieldokument geladen."),
            )}
        />

        <div className=${classNames("status-line", statusClassName)}>
          <span className="status-pill"
            >${mode === "markdown" ? "Markdown" : "Blockmodus"}</span
          >
          <span>${snapshot.status.message}</span>
        </div>
      </section>

      <div className="editor-layout">
        <section className="editor-shell">
          <div className="panel-header">
            <div className="panel-title-group">
              <h2>Editor</h2>
              <p>
                ${mode === "blocks"
                  ? "Kontinuierlicher Blockmodus: schreibe in Bausteinen, nutze Slash-Commands und sichtbare Einfüge-Aktionen."
                  : "Markdown-Ansicht: die rohe Textquelle für direkten Eingriff."}
              </p>
            </div>
            <a className="button" href="../index.html">Zur Toolbox</a>
          </div>

          ${mode === "markdown"
            ? html`<${MarkdownTextareaView}
                document=${snapshot.document}
                onChange=${(value) =>
                  handleDocumentChange(value, "Markdown aktualisiert.")}
              />`
            : html`<${BlockEditorView}
                document=${snapshot.document}
                onDocumentChange=${handleDocumentChange}
              />`}
        </section>

        <${PreviewPanel} document=${snapshot.document} />
      </div>

      <input
        ref=${fileInputRef}
        className="hidden-file-input"
        type="file"
        accept=".md,text/markdown,text/plain"
        onChange=${handleImport}
      />
    </main>
  `;
}
