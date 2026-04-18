export class PreviewRenderer {
  constructor() {
    this.renderer = window.markdownit({
      html: false,
      linkify: true,
      typographer: true,
      breaks: false,
    });
  }

  render(markdown) {
    if (!String(markdown || "").trim()) {
      return "";
    }

    return this.renderer.render(markdown);
  }
}
