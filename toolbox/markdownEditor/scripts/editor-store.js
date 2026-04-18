export class EditorStore {
  constructor(initialDocument) {
    this.document = initialDocument || "";
    this.listeners = new Set();
    this.status = {
      kind: "idle",
      message: "Bereit.",
    };
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.getSnapshot());

    return () => {
      this.listeners.delete(listener);
    };
  }

  getSnapshot() {
    return {
      document: this.document,
      status: { ...this.status },
    };
  }

  setDocument(nextDocument, status) {
    this.document = nextDocument;

    if (status) {
      this.status = { ...status };
    }

    this.emit();
  }

  setStatus(status) {
    this.status = { ...status };
    this.emit();
  }

  emit() {
    const snapshot = this.getSnapshot();

    this.listeners.forEach((listener) => {
      listener(snapshot);
    });
  }
}
