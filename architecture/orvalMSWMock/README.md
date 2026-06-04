# Orval + MSW PoC (React + TypeScript)

Dieses Verzeichnis enthaelt ein kleines Testprojekt, das zeigt:

- OpenAPI-Spezifikation als Quelle
- Orval generiert daraus einen TypeScript-Client
- MSW mocked dieselben Endpunkte im Browser fuer lokale Entwicklung
- transformieren von SQL Daten inkl. Mapping auf Response um definierte Daten aus E2E Test weiterzuverwenden

## Projektstruktur

- `openapi/shop-api.yaml`: Beispiel-OpenAPI mit Customers, Products, Orders
- `orval.config.ts`: Orval-Konfiguration
- `src/api/generated/*`: von Orval generierter Client und Modelle
- `mockData/mocks/*`: MSW-Worker, Handler und Beispieldaten
- `mockData/input/*`: SQL- und Mapping-Input fuer Mockdaten
- `mockData/scripts/generate-mock-data.mjs`: Generator fuer transformierte Mockdaten
- `src/App.tsx`: Showcase-UI fuer den End-to-End-Flow

## Setup

```bash
npm install
```

## Wichtige Skripte

```bash
npm run generate:mock-data  # liest mockData/input/* und schreibt mockData/mocks/data.ts
npm run transform:single-file # verarbeitet nur mockData/input/testdata.sql per sqltransformer-CLI
npm run generate:api   # OpenAPI -> TypeScript Client (Orval)
npm run mock:init      # legt public/mockServiceWorker.js an
npm run dev            # startet Vite mit aktivem MSW in DEV
npm run build          # Typecheck + Production Build
```

Der Command `transform:single-file` ist der einfache Einstieg ueber genau eine Datei, schreibt JSON nach `mockData/output/*` und aktualisiert anschliessend `mockData/mocks/data.ts` fuer MSW.
Er verwendet dafuer bewusst `mockData/input/testdata.mapping.cjs`, damit die sqltransformer-CLI im ESM-Frontendprojekt die Mappingdatei per `require(...)` laden kann.

## FE starten: mit und ohne Mockserver

### Mit Mockserver (MSW aktiv)

```bash
npm run dev
```

Standard in DEV: Der Browser-Worker wird gestartet und bedient `/api/*` lokal.

### Ohne Mockserver (MSW deaktiviert)

```bash
VITE_USE_MSW=false npm run dev
```

Dann werden echte HTTP-Requests gegen den konfigurierten API-Server gesendet (hier: `/api`).

## Wie der Mocking-Flow funktioniert

1. In `src/main.tsx` wird im DEV-Modus der MSW-Worker gestartet.
2. Orval generiert in `src/api/generated/shop-api.ts` sowohl den API-Client als auch MSW-Handler-Funktionen.
3. `npm run generate:mock-data` scannt `mockData/input` nach allen `.sql` Dateien, sucht pro SQL optional eine passende `<name>.mapping.(js|cjs|mjs)`, transformiert alles mit dem SQL-Transformer und schreibt die Showcase-Daten nach `mockData/mocks/data.ts`.
4. Der Generator berechnet zusaetzlich aggregierte Metrics (z. B. aktive Customers, Orders nach Status, Top-Cities) und exportiert sie fuer den Endpunkt `/metrics`.
5. `mockData/mocks/handlers.ts` nutzt die generierten Handler und uebergibt fuer den Showcase die transformierten Daten.
6. Das Showcase rendert die geladenen Daten und erlaubt einen einfachen Filter bei Orders.

## Neuer Beispiel-Endpunkt

- Endpoint: `GET /api/metrics`
- Quelle: aus `customers`, `products` und `orders` berechnete Daten aus `mockData/mocks/data.ts`
- Inhalt: Summen, Durchschnittspreis, Orders nach Status, Top-Shipping-Cities
