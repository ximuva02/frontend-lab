import { html, useMemo } from "../runtime.js";
import { previewRenderer } from "../editor-app-state.js";

export function PreviewPanel({ document }) {
  const htmlOutput = useMemo(
    () => previewRenderer.render(document),
    [document],
  );

  return html`
    <section className="preview-shell">
      <div className="panel-header">
        <div className="panel-title-group">
          <h2>Preview</h2>
          <p>Gerenderte Ausgabe aus derselben Markdown-Quelle.</p>
        </div>
        <span className="status-pill">markdown-it</span>
      </div>
      <div className="preview-surface">
        ${htmlOutput
          ? html`<div dangerouslySetInnerHTML=${{ __html: htmlOutput }}></div>`
          : html`<p className="preview-empty">Noch kein Inhalt vorhanden.</p>`}
      </div>
    </section>
  `;
}
