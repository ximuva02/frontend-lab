# Design Tokens Grundgeruest

Design Tokens funktionieren am stabilsten in drei Ebenen:

1. Primitive Tokens: rohe Werte wie Farben, Spacing, Radius, Schatten, Typografie.
2. Semantische Tokens: Bedeutungen wie `--color-bg`, `--color-text`, `--color-border`, `--space-section`.
3. Komponenten-Tokens: optionale Ableitungen pro Baustein wie `--card-bg`, `--button-padding-inline`, `--menu-shadow`.

Das typische Vorgehen ist nicht, direkt in Komponenten mit Rohwerten zu arbeiten, sondern Primitive in semantische Tokens zu mappen. Komponenten verwenden dann fast nur semantische oder komponentenspezifische Tokens.

## Typisches Raster

Ein praxistaugliches Minimalraster umfasst meistens:

- Farben: neutrale Skala, Akzentfarben, Statusfarben.
- Surface-System: Hintergrund, Surface, erhöhte Surface, Border.
- Typografie: Schriftfamilien, Größen, Zeilenhöhen, Gewichte.
- Spacing: kleine, konsistente Skala wie `4, 8, 12, 16, 24, 32, 48, 64`.
- Radius: kleine, mittlere, große Rundungen.
- Schatten: leicht, mittel, stark.
- Breakpoints oder Containerbreiten.
- Motion: Dauer und Easing.
- Z-Index-Layer nur falls wirklich nötig.

## Light und Dark Theme

Für Light und Dark sollte man fast nie Primitive komplett doppeln. Üblich ist:

1. Primitive definieren.
2. Semantische Tokens für Light auf Primitive mappen.
3. Für Dark nur die semantischen Tokens überschreiben.

Beispiel:

```css
:root {
  --color-sand-100: #f4efe7;
  --color-slate-900: #18211d;
  --color-forest-500: #0a7f5a;
}

:root,
:root[data-theme="light"] {
  --color-bg: var(--color-sand-100);
  --color-text: var(--color-slate-900);
  --color-accent: var(--color-forest-500);
}

:root[data-theme="dark"] {
  --color-bg: #121715;
  --color-text: #ecf2ef;
  --color-accent: #7ae8be;
}
```

Optional kann `prefers-color-scheme` als Default verwendet werden, solange ein explizites `data-theme` den Vorrang behaelt.

## Typische vordefinierte Tokens

Ein guter Start fuer die meisten Projekte:

```css
:root {
  --color-bg: ...;
  --color-bg-alt: ...;
  --color-surface: ...;
  --color-surface-strong: ...;
  --color-text: ...;
  --color-text-muted: ...;
  --color-border: ...;
  --color-accent: ...;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;

  --radius-sm: 0.75rem;
  --radius-md: 1rem;
  --radius-lg: 1.5rem;

  --shadow-soft: ...;
  --shadow-strong: ...;

  --font-family-body: ...;
  --font-family-heading: ...;
  --font-size-body: 1rem;
  --font-size-title: clamp(...);
  --line-height-body: 1.6;

  --motion-fast: 160ms ease;
  --motion-base: 240ms ease;
}
```

## Empfehlung fuer dieses Repo

Die gemeinsame Basis liegt jetzt in [index.css](../index.css). Das ist bereits nach diesem Muster aufgebaut:

- Primitive Tokens oben.
- Semantische Theme-Zuweisungen fuer Light und Dark.
- Gemeinsame Layout- und Surface-Klassen darunter.
- Bereichsspezifische Overrides nur noch lokal in [fundamentals/styles.css](./styles.css) oder [toolbox/styles.css](../toolbox/styles.css).

Wenn spaeter mehr UI-Komponenten dazukommen, ist der naechste sinnvolle Schritt ein eigener Komponenten-Layer, zum Beispiel `--card-*`, `--button-*` und `--input-*`.
