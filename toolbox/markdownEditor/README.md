# Markdown Editor

Statisches HTML-Tool fuer die Toolbox mit React per CDN. Das Tool startet als Hybrid aus klassischem Markdown-Editor und einem ersten Notion-inspirierten Blockeditor. Beide Ansichten arbeiten auf derselben Markdown-Quelle.

## Ziel

Das Tool soll:

- Markdown eingeben und live rendern
- zwischen zwei Editormodi umschalten:
  - klassischer Markdown-Modus
  - Blockmodus mit Notion-aehnlichem Editing
- erste Slash-Commands fuer Blocktypen anbieten
- komplett statisch laufen, ohne Build-Step und ohne Backend
- spaeter schrittweise wachsen koennen, ohne die Architektur neu zu bauen

## MVP Scope

Enthalten im ersten Release:

- statische Seite mit React per CDN
- zweispaltiges Layout: Editor links, Preview rechts
- Umschalter zwischen Markdown-Modus und Blockmodus
- Live-Preview fuer das aktuelle Dokument
- Import von `.md` Dateien
- Export des aktuellen Dokuments als `.md`
- Slash-Commands fuer:
  - Heading
  - Bullet List
  - Numbered List
  - Quote
  - Code Block
  - Divider
  - Todo

Nicht im MVP:

- Backend
- localStorage
- Multiuser-Sync
- Drag-and-drop fuer Bloecke
- Uploads von Bildern oder Dateien
- komplexe Rich-Text-Formatierung innerhalb eines Blocks
- vollstaendige Notion-Paritaet

## Produktentscheidung

Die kanonische Datenquelle ist immer ein Markdown-String.

Das bedeutet:

- der Markdown-Modus bearbeitet die Quelle direkt
- der Blockmodus zeigt eine strukturierte Projektion derselben Quelle
- jede Blockaenderung wird wieder in Markdown serialisiert
- Sonderfaelle von Markdown, die der Blockmodus nicht sauber abbildet, bleiben im Markdown-Modus editierbar

Diese Entscheidung ist fuer das MVP bewusst konservativ. Sie reduziert Komplexitaet und verhindert, dass frueh ein schwergewichtiges Dokumentmodell gebaut werden muss.

## Technische Leitlinien

- rein statische HTML-Seite
- relative Asset-Pfade, damit das Tool unter `/toolbox/` funktioniert
- React und ReactDOM per CDN
- HTM statt JSX-Transpilation
- lokale ES-Module fuer Struktur und Wartbarkeit
- kleine, explizite Store-Logik statt State-Library
- Markdown-Rendering ueber eine CDN-Library

## Nutzerfluss

1. Nutzer oeffnet das Tool
2. Ein Startdokument oder Sample wird geladen
3. Nutzer entscheidet sich fuer:
   - Markdown bearbeiten
   - Blockeditor verwenden
4. Jede Aenderung aktualisiert sofort die Preview
5. Nutzer kann Markdown importieren oder exportieren
6. Im Blockmodus kann der Nutzer ueber `/` neue Blocktypen einfuegen oder bestehende umwandeln

## Architektur-Skizze

### Uebersicht

Markdown bleibt in der Mitte des Systems. Alle anderen Teile lesen daraus oder schreiben dorthin zurueck.

Editor UI -> EditorStore -> Markdown String -> Preview Renderer
Block Editor -> BlockAdapter -> Markdown String -> Preview Renderer
Import/Export -> EditorStore

### Modul-Skizze

- `MarkdownEditorApp`
  - baut die Anwendung zusammen
  - initialisiert Store, Renderer, Editor-Views und Toolbar
  - verbindet UI-Ereignisse mit den Modulen

- `EditorStore`
  - haelt den aktuellen Markdown-String
  - bietet `getDocument()`, `setDocument()`, `subscribe()`
  - ist die einzige Quelle fuer Dokumentzustand

- `MarkdownTextareaView`
  - klassische Markdown-Eingabe
  - schreibt direkt in den Store
  - reagiert auf Store-Updates

- `BlockEditorView`
  - zeigt das Dokument als Blockliste
  - arbeitet mit einer abgeleiteten Blockstruktur
  - serialisiert Aenderungen wieder nach Markdown
  - oeffnet Slash-Menue bei `/`

- `BlockAdapter`
  - parst Markdown in eine einfache Blockliste
  - serialisiert Blockliste zurueck nach Markdown
  - unterstuetzt nur die MVP-Blocktypen
  - ist bewusst deterministisch und begrenzt

- `PreviewRenderer`
  - rendert Markdown in HTML
  - reagiert auf Store-Updates
  - kapselt die Markdown-Library

- `SlashCommandMenu`
  - zeigt verfuegbare Blockaktionen
  - filtert nach Eingabe
  - meldet die gewaehlte Aktion an den Blockeditor zurueck

- `ImportExportService`
  - liest `.md` Dateien ein
  - erzeugt Download fuer das aktuelle Dokument

## Kleine Class-/Verantwortungsskizze

### `MarkdownEditorApp`

Verantwortung:
Startpunkt der App und Composition Root.

Wichtige Beziehungen:

- besitzt `EditorStore`
- initialisiert `MarkdownTextareaView`
- initialisiert `BlockEditorView`
- initialisiert `PreviewRenderer`
- initialisiert `ImportExportService`

### `EditorStore`

Verantwortung:
Single Source of Truth fuer das Dokument.

Oeffentliche API:

- `getDocument()`
- `setDocument(markdown)`
- `subscribe(listener)`

### `BlockAdapter`

Verantwortung:
uebersetzt zwischen Markdown und Blockliste.

Oeffentliche API:

- `parse(markdown)`
- `serialize(blocks)`

### `BlockEditorView`

Verantwortung:
Notion-inspiriertes Bearbeiten auf Blockebene.

Oeffentliche API:

- `render(markdown)`
- `focusBlock(blockId)`
- `openSlashMenu(blockId, query)`

### `SlashCommandMenu`

Verantwortung:
Blocktyp-Aktionen anzeigen und auswaehlen.

Oeffentliche API:

- `open(anchor, query)`
- `close()`
- `select(commandId)`

## Dateistruktur

Geplante Struktur:

- `index.html`
- `styles.css`
- `scripts/app.js`
- `scripts/editor-store.js`
- `scripts/markdown-textarea-view.js`
- `scripts/block-editor-view.js`
- `scripts/block-adapter.js`
- `scripts/preview-renderer.js`
- `scripts/slash-command-menu.js`
- `scripts/import-export-service.js`
- `scripts/sample-markdown.js`

## Umsetzungsplan

### Phase 0: Blueprint

- README mit Zielbild, Scope und Architektur finalisieren
- Modulgrenzen festziehen
- MVP-Regeln fuer Blocktypen und Slash-Commands einfrieren

### Phase 1: Statisches Grundgeruest

- `index.html` als statische Seite mit CDN-Abhaengigkeiten aufsetzen
- `styles.css` fuer Layout und Editorflaechen anlegen
- `app.js` als Entry-Modul definieren

### Phase 2: Kernfluss

- `EditorStore` implementieren
- Markdown-Textarea an den Store anbinden
- Preview-Renderer anbinden
- Import/Export ermoeglichen

### Phase 3: Blockmodus MVP

- einfache Blockliste aus Markdown ableiten
- Blockeditor fuer die MVP-Blocktypen bauen
- Enter, Backspace und Fokuswechsel definieren
- Slash-Menue anbinden

### Phase 4: UX und Integration

- Sample-Dokument
- Fehlerbehandlung
- responsive Verhalten
- Toolbox-Link und Tool-Dokumentation

## Verifikation

- Tool laeuft ohne Build-Step direkt im Browser
- Markdown- und Blockmodus zeigen dasselbe Dokument
- jede Aenderung aktualisiert die Preview
- Import und Export funktionieren fuer `.md`
- alle Slash-Commands erzeugen gueltiges Markdown
- die Seite bleibt auf schmalen Viewports benutzbar

## Offene Leitplanke fuer spaeter

Wenn der Blockeditor spaeter deutlich komplexer wird, ist der naechste sinnvolle Schritt ein internes Dokumentmodell mit Selection-State und stabileren Block-Operationen. Fuer den MVP wird das bewusst noch nicht eingefuehrt.
