# Markdown Editor Flow Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the markdown editor's block mode feel like continuous Notion-style writing while preserving the current Markdown source-of-truth model, block types, preview, and import/export flow.

**Architecture:** Keep `toolbox/markdownEditor/scripts/block-adapter.js` and the shared store as the existing document model. Rework the UI around `App`, `BlockEditorView`, `BlockCard`, and `styles.css` so block mode is the default, visible card chrome disappears, and `Enter` plus `/` become the primary creation and transformation paths.

**Tech Stack:** Static HTML, React 18 UMD via CDN, HTM templates, markdown-it preview rendering, vanilla CSS, manual browser verification

---

## Implementation notes

- This repo does **not** currently expose an automated test runner for `toolbox/markdownEditor`, so verification in this plan is explicit manual browser checking.
- Do **not** add a new test framework as part of this change.
- The user wants to handle commits manually, so this plan intentionally omits git commit steps.

## File structure map

- Modify: `toolbox/markdownEditor/scripts/components/App.js:13-111`
  - Change the default mode to block mode and update copy so block mode is the primary experience.
- Modify: `toolbox/markdownEditor/scripts/components/HeaderActions.js:3-49`
  - Reorder and relabel mode controls so block editing reads as the primary tab.
- Modify: `toolbox/markdownEditor/scripts/components/BlockEditorView.js:10-257`
  - Keep block projection logic, but remove button-driven insertion from the main flow and tighten focus / slash handling.
- Modify: `toolbox/markdownEditor/scripts/components/BlockCard.js:11-162`
  - Replace visible card UI with row-oriented, low-chrome block rendering and hover/focus-only affordances.
- Modify: `toolbox/markdownEditor/styles.css:45-459`
  - Rework block editor styles from card stacks into continuous document rows, hover affordances, and subtle active states.
- Modify: `toolbox/markdownEditor/scripts/sample-markdown.js:1-25`
  - Update sample content so the first-run experience matches the new writing-first block mode.
- Modify: `toolbox/markdownEditor/README.md:1-238`
  - Document that block mode opens first and now emphasizes continuous writing instead of visible block cards.

### Task 1: Make block mode the default experience

**Files:**
- Modify: `toolbox/markdownEditor/scripts/components/App.js:13-111`
- Modify: `toolbox/markdownEditor/scripts/components/HeaderActions.js:3-49`
- Modify: `toolbox/markdownEditor/scripts/sample-markdown.js:1-25`
- Test: manual browser check at `toolbox/markdownEditor/index.html`

- [ ] **Step 1: Capture the current behavior manually**

Run:

```bash
cd /home/martina/Development/frontend-lab
python3 -m http.server 4173
```

Expected:

- terminal shows `Serving HTTP on`
- opening `http://localhost:4173/toolbox/markdownEditor/` starts in **Markdown** mode
- the mode toggle presents Markdown and block mode with equal emphasis

- [ ] **Step 2: Change the app default and supporting copy**

Update `toolbox/markdownEditor/scripts/components/App.js` so block mode is the initial state and the intro / panel copy describe block editing as the primary experience:

```js
export function App() {
  const fileInputRef = useRef(null);
  const snapshot = useEditorStore(store);
  const [mode, setMode] = useState("blocks");

  return html`
    <main className="editor-page">
      <section className="editor-hero">
        <div className="editor-hero-copy">
          <p className="eyebrow">frontend-lab toolbox</p>
          <h1>Markdown Editor</h1>
          <p className="intro">
            Blockorientiertes Schreiben mit direkter Markdown-Quelle, Live-Preview und einem
            zweiten Modus fuer den Rohtext.
          </p>
        </div>
        <${HeaderActions}
          mode=${mode}
          onModeChange=${setMode}
          onImportClick=${() => fileInputRef.current?.click()}
          onExportClick=${handleExport}
          onLoadSample=${() =>
            store.setDocument(sampleMarkdown, createStatus("ok", "Beispieldokument geladen."))}
        />
        <div className=${classNames("status-line", statusClassName)}>
          <span className="status-pill">${mode === "blocks" ? "Blockmodus" : "Markdown"}</span>
          <span>${snapshot.status.message}</span>
        </div>
      </section>

      <div className="editor-layout">
        <section className="editor-shell">
          <div className="panel-header">
            <div className="panel-title-group">
              <h2>${mode === "blocks" ? "Dokument" : "Markdown-Quelle"}</h2>
              <p>
                ${mode === "blocks"
                  ? "Schreibe im Blockfluss. Enter fuegt direkt den naechsten Absatz ein, / wandelt die aktuelle Zeile um."
                  : "Direkter Zugriff auf denselben Inhalt als Markdown-Quelle."}
              </p>
            </div>
            <a className="button" href="../index.html">Zur Toolbox</a>
          </div>
```

- [ ] **Step 3: Make the mode toggle read as block-first**

Update `toolbox/markdownEditor/scripts/components/HeaderActions.js` so block mode is the first / primary tab label:

```js
<div className="mode-toggle" role="tablist" aria-label="Editor-Modus">
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
</div>
```

- [ ] **Step 4: Refresh the sample document copy for the new first impression**

Update `toolbox/markdownEditor/scripts/sample-markdown.js` so the loaded sample reinforces writing flow instead of visible block manipulation:

```js
export const sampleMarkdown = String.raw`# Projektnotiz

Willkommen im neuen Markdown Editor. Der Blockmodus ist jetzt der Standard und soll sich wie ein fortlaufendes Dokument anfuehlen.

- Schreibe direkt los
- Druecke Enter fuer den naechsten Absatz
- Nutze / in einer leeren Zeile fuer Blocktypen

> Dieselbe Markdown-Quelle bleibt die Basis fuer Blockmodus, Rohtext und Preview.

## Erste Bausteine

1. Blockfluss ausprobieren
2. Bei Bedarf in Markdown wechseln
3. Dokument exportieren

---

- [ ] Offene Aufgabe fuer spaeter
`;
```

- [ ] **Step 5: Re-run the browser check**

Run:

```bash
cd /home/martina/Development/frontend-lab
python3 -m http.server 4173
```

Expected:

- opening `http://localhost:4173/toolbox/markdownEditor/` now starts in **Blockmodus**
- the primary copy frames Markdown mode as the secondary/raw editing surface
- switching to Markdown still shows the same document

### Task 2: Remove permanent block cards and replace them with document rows

**Files:**
- Modify: `toolbox/markdownEditor/scripts/components/BlockCard.js:11-162`
- Modify: `toolbox/markdownEditor/styles.css:177-364`
- Test: manual browser check at `toolbox/markdownEditor/index.html`

- [ ] **Step 1: Capture the current visual chrome**

Run:

```bash
cd /home/martina/Development/frontend-lab
python3 -m http.server 4173
```

Expected:

- each block is wrapped in a visible `.block-card`
- block meta and `Block darunter einfuegen` are always visible
- the editor feels like stacked widgets instead of a continuous page

- [ ] **Step 2: Reshape `BlockCard` into a row-oriented block renderer**

Update `toolbox/markdownEditor/scripts/components/BlockCard.js` so each block renders as a row with optional affordances instead of a persistent card/footer:

```js
export function BlockCard({
  block,
  index,
  inputValue,
  isActive,
  isSlashOpen,
  slashQuery,
  slashIndex,
  onFocus,
  onChange,
  onKeyDown,
  onToggleTodo,
  onSlashSelect,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    normalizeTextareaHeight(inputRef.current);
  }, [inputValue, block.type]);

  return html`
  <article
    className=${classNames(
      "block-row",
      isActive && "block-row-active",
      isSlashOpen && "block-row-slash-open",
      `block-row-${block.type}`,
    )}
  >
    <div className="block-row-gutter">
      <button className="block-handle" type="button" tabindex="-1" aria-hidden="true">
        +
      </button>
    </div>

    <div className="block-row-body">
      <div className="block-row-meta">
        <span className="block-type-label">${getBlockTypeLabel(block.type)}</span>
        ${block.type === "todo"
          ? html`
              <label className="block-todo-toggle">
                <input
                  type="checkbox"
                  checked=${Boolean(block.checked)}
                  onChange=${(event) => onToggleTodo(event.target.checked)}
                />
                Erledigt
              </label>
            `
          : null}
      </div>

      ${block.type === "code"
        ? html`
            <textarea
              ref=${inputRef}
              className="block-code"
              value=${inputValue}
              onFocus=${onFocus}
              onInput=${(event) => {
                normalizeTextareaHeight(event.target);
                onChange(event.target.value, block);
              }}
              onKeyDown=${(event) => onKeyDown(event, block)}
              spellcheck=${false}
              placeholder="Code eingeben"
            ></textarea>
          `
        : html`
            <textarea
              ref=${inputRef}
              className=${inputClassName}
              value=${inputValue}
              onFocus=${onFocus}
              onInput=${(event) => {
                normalizeTextareaHeight(event.target);
                onChange(event.target.value, block);
              }}
              onKeyDown=${(event) => onKeyDown(event, block)}
              rows=${1}
              spellcheck=${false}
              placeholder=${block.type === "heading"
                ? "Titel eingeben"
                : "Text eingeben oder / fuer Kommandos"}
            ></textarea>
          `}

      ${isSlashOpen &&
      html`<${SlashMenu}
        query=${slashQuery}
        activeIndex=${slashIndex}
        onSelect=${onSlashSelect}
      />`}
    </div>
  </article>
`;
}
```

- [ ] **Step 3: Replace the card styling with low-chrome row styling**

Update `toolbox/markdownEditor/styles.css` around the existing `.block-card`, `.block-meta`, `.block-footer`, and `.block-insert-button` rules:

```css
.block-list {
  display: grid;
  gap: 0.15rem;
}

.block-row {
  position: relative;
  display: grid;
  grid-template-columns: 1.75rem minmax(0, 1fr);
  gap: 0.65rem;
  padding: 0.2rem 0;
  border-radius: 0.85rem;
}

.block-row:hover,
.block-row-active {
  background: rgba(159, 61, 24, 0.05);
}

.block-row-gutter {
  display: flex;
  justify-content: center;
  padding-top: 0.45rem;
}

.block-handle,
.block-type-label,
.block-todo-toggle {
  opacity: 0;
  transition: opacity var(--motion-fast);
}

.block-row:hover .block-handle,
.block-row:hover .block-type-label,
.block-row-active .block-handle,
.block-row-active .block-type-label,
.block-row-active .block-todo-toggle {
  opacity: 1;
}

.block-row-body {
  position: relative;
  min-width: 0;
}

.block-row-meta {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  min-height: 1rem;
  margin-bottom: 0.15rem;
}
```

- [ ] **Step 4: Preserve block-type recognition with minimal styling**

Update the existing type-specific rules in `toolbox/markdownEditor/styles.css` so the block still reads correctly without looking like a card:

```css
.block-input {
  width: 100%;
  min-height: 1.9rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-text);
  font: inherit;
  resize: none;
  outline: none;
}

.block-input-heading {
  font-family: var(--font-family-heading);
  font-size: clamp(1.55rem, 2vw, 2rem);
  font-weight: 700;
  line-height: 1.2;
}

.block-input-quote {
  padding-left: 1rem;
  border-left: 3px solid color-mix(in srgb, var(--brand-accent) 55%, transparent);
  font-style: italic;
}

.block-code {
  min-height: 7rem;
  padding: 0.85rem 1rem;
  border-radius: 0.9rem;
  background: var(--preview-code-bg);
  font: 0.96rem/1.6 var(--font-family-mono);
}

.block-divider {
  margin: 0.55rem 0;
}
```

- [ ] **Step 5: Re-run the browser check**

Run:

```bash
cd /home/martina/Development/frontend-lab
python3 -m http.server 4173
```

Expected:

- paragraph blocks read like continuous document lines
- there are no always-visible `Block darunter einfuegen` controls
- block type chrome appears only on hover or focus
- headings, quotes, todos, code, and dividers remain recognizable

### Task 3: Make Enter and slash the primary block-creation flow

**Files:**
- Modify: `toolbox/markdownEditor/scripts/components/BlockEditorView.js:10-257`
- Modify: `toolbox/markdownEditor/scripts/components/BlockCard.js:11-162`
- Test: manual browser check at `toolbox/markdownEditor/index.html`

- [ ] **Step 1: Capture the current interaction pain points**

Run:

```bash
cd /home/martina/Development/frontend-lab
python3 -m http.server 4173
```

Expected:

- the UI still offers button-driven insertion
- appending blocks visually depends on visible controls
- `/` already transforms an empty block, so that behavior must stay intact

- [ ] **Step 2: Remove button-driven insertion from the render tree**

Update `toolbox/markdownEditor/scripts/components/BlockEditorView.js` to remove the bottom action area and stop passing `onInsertAfter` into `BlockCard`:

```js
return html`
  <div className="editor-stack">
    <p className="editor-hint">
      Schreibe direkt los. Enter erstellt den naechsten Absatz, / in einer leeren Zeile oeffnet
      die Blockauswahl.
    </p>
    <div className="block-list">
      ${blocks.map(
        (block, index) => html`
          <${BlockCard}
            key=${block.id}
            block=${block}
            index=${index}
            inputValue=${drafts[block.id] ?? block.content}
            isActive=${activeBlockId === block.id}
            isSlashOpen=${slashState.blockId === block.id}
            slashQuery=${slashState.query}
            slashIndex=${slashState.activeIndex}
            onFocus=${() => setActiveBlockId(block.id)}
            onChange=${(value, currentBlock) => handleBlockInput(block.id, value, currentBlock)}
            onKeyDown=${handleBlockKeyDown}
            onToggleTodo=${(checked) =>
              updateBlock(block.id, { checked }, checked ? "Todo abgehakt." : "Todo geoeffnet.")}
            onSlashSelect=${(command) => applySlashCommand(block.id, command)}
          />
        `,
      )}
    </div>
  </div>
`;
```

- [ ] **Step 3: Make Enter reliably create the next plain-text block and move focus**

Tighten the block insertion logic in `toolbox/markdownEditor/scripts/components/BlockEditorView.js` so `Enter` is the default writing path and focus jumps immediately:

```js
const insertBlockAfter = (blockId, nextType = "paragraph") => {
  const currentIndex = blocks.findIndex((block) => block.id === blockId);
  const nextBlock = createEmptyBlock(nextType);
  const nextBlocks = [...blocks];

  nextBlocks.splice(currentIndex + 1, 0, nextBlock);
  applyBlocks(nextBlocks, "Neuer Absatz eingefuegt.");
  setActiveBlockId(nextBlock.id);
  closeSlashMenu();
};

const handleBlockKeyDown = (event, block) => {
  const currentIndex = blocks.findIndex((entry) => entry.id === block.id);

  if (slashState.blockId === block.id && filteredCommands.length) {
    // existing arrow, enter, and escape behavior stays here
  }

  if (event.key === "Enter" && !event.shiftKey && block.type !== "code") {
    event.preventDefault();
    insertBlockAfter(block.id, "paragraph");
    return;
  }

  if (event.key === "Backspace" && !block.content && !drafts[block.id] && blocks.length > 1) {
    event.preventDefault();
    const nextBlocks = blocks.filter((entry) => entry.id !== block.id);
    const nextFocusBlock = nextBlocks[Math.max(currentIndex - 1, 0)] || nextBlocks[0];

    applyBlocks(nextBlocks, "Leerer Block entfernt.");
    setActiveBlockId(nextFocusBlock?.id || null);
    closeSlashMenu();
  }
};
```

- [ ] **Step 4: Keep slash as an inline transform on the current empty line**

Retain and clarify the current slash behavior in `toolbox/markdownEditor/scripts/components/BlockEditorView.js`:

```js
const handleBlockInput = (blockId, value, block) => {
  const isSlashCommandInput = block.content.trim() === "" && value.startsWith("/");

  if (isSlashCommandInput) {
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [blockId]: value,
    }));
    openSlashMenu(blockId, value.slice(1));
    return;
  }

  clearDraft(blockId);

  if (slashState.blockId === blockId) {
    closeSlashMenu();
  }

  updateBlock(
    blockId,
    (currentBlock) => ({
      ...currentBlock,
      content: value,
    }),
    "Blockinhalt aktualisiert.",
  );
};
```

- [ ] **Step 5: Re-run the browser check**

Run:

```bash
cd /home/martina/Development/frontend-lab
python3 -m http.server 4173
```

Expected:

- pressing `Enter` in a text block creates the next plain text block immediately
- focus lands in the new block without clicking anywhere
- typing `/` in an empty block opens the slash menu and transforms that same block
- `Backspace` on an empty block removes it and returns focus to the previous block

### Task 4: Update docs and run a full regression pass

**Files:**
- Modify: `toolbox/markdownEditor/README.md:1-238`
- Modify: `toolbox/markdownEditor/scripts/components/App.js:18-43`
- Test: manual browser regression at `toolbox/markdownEditor/index.html`

- [ ] **Step 1: Update the README to match the new editing model**

Edit `toolbox/markdownEditor/README.md` in the sections describing the editor modes and block UX so they match the shipped behavior:

```md
## Ziel

Das Tool soll:

- Markdown eingeben und live rendern
- standardmaessig einen ruhigen Blockmodus fuer fortlaufendes Schreiben zeigen
- weiterhin einen separaten Markdown-Modus fuer den Rohtext anbieten
- erste Slash-Commands fuer Blocktypen inline in leeren Zeilen anbieten

## Produktentscheidung

Die kanonische Datenquelle ist immer ein Markdown-String.

Das bedeutet:

- der Blockmodus ist die primaere Oberflaeche fuer das Schreiben
- der Markdown-Modus bleibt fuer direkte Quelltextbearbeitung und Sonderfaelle erhalten
- jede Blockaenderung wird wieder in Markdown serialisiert
```

- [ ] **Step 2: Make sure user-facing status text still matches the redesigned flow**

Review the status messages in `toolbox/markdownEditor/scripts/components/App.js` and `toolbox/markdownEditor/scripts/components/BlockEditorView.js`, keeping messages aligned with the new flow:

```js
const handleDocumentChange = (nextDocument, statusMessage = "Markdown aktualisiert.") => {
  store.setDocument(nextDocument, createStatus("ok", statusMessage));
};

applyBlocks(nextBlocks, "Neuer Absatz eingefuegt.");
applyBlocks(nextBlocks, `${label} eingefuegt.`);
applyBlocks(nextBlocks, "Leerer Block entfernt.");
```

- [ ] **Step 3: Run the full manual regression pass**

Run:

```bash
cd /home/martina/Development/frontend-lab
python3 -m http.server 4173
```

Expected:

- `http://localhost:4173/toolbox/markdownEditor/` opens in block mode
- typing text, pressing `Enter`, and using `/` all work without visible add buttons
- import still loads a Markdown file into both editor modes
- export still downloads the current document
- switching between block mode and Markdown mode preserves the same content
- the preview continues to reflect the shared Markdown source

- [ ] **Step 4: Stop the manual server when finished**

In the terminal where `python3 -m http.server 4173` is running, press `Ctrl+C`.

Expected:

- the server process exits and the terminal returns to the shell prompt
- no repository files change during cleanup
