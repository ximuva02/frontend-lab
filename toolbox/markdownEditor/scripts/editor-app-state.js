import { sampleMarkdown } from "./sample-markdown.js";
import { EditorStore } from "./editor-store.js";
import { PreviewRenderer } from "./preview-renderer.js";

export const store = new EditorStore(sampleMarkdown);
export const previewRenderer = new PreviewRenderer();
