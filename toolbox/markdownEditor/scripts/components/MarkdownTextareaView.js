import { html } from "../runtime.js";

export function MarkdownTextareaView({ document, onChange }) {
  return html`
    <label>
      <span className="editor-hint">
        Direkte Markdown-Bearbeitung fuer freie Syntax und Sonderfaelle.
      </span>
      <textarea
        className="markdown-textarea"
        value=${document}
        onInput=${(event) => onChange(event.target.value)}
        spellcheck=${false}
      ></textarea>
    </label>
  `;
}
