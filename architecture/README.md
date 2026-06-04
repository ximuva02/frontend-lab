# Architecture

Frontend-Architekturthemen, die ueber einzelne Komponenten hinausgehen.

- Architektur-Notizen und Entscheidungsdokumentation
- kleine technische Beispiele oder Setup-Demos
- Einordnung von Tradeoffs und Grenzen
- wiederverwendbare Ausgangspunkte fuer reale Projekte

### Orval + MSW PoC (React + TypeScript)

kleines Testprojekt, das zeigt:

- OpenAPI-Spezifikation als Quelle
- Orval generiert daraus einen TypeScript-Client
- MSW mocked dieselben Endpunkte im Browser fuer lokale Entwicklung
- transformieren von SQL Daten inkl. Mapping auf Response um definierte Daten aus E2E Test weiterzuverwenden

### Microfrontends

Prototyp für getrennte Microfrontends gekoppelt in einer Shell-App

### App Development mit Web Components in Litjs mit Statemanagement

Beispiel Anwendung mit Litjs WebComponents inkl. Routing und Statemanagement. Austesten der Grenzen von ShadowDom und LightDom mit Lit.

### OpenAPI Generation mit Orval, Zod und Tanstack Query

Automatisierte Client-Generierung als Grundlage fuer typsichere API-Nutzung, konsistente Datenzugriffe und geringeren manuellen Pflegeaufwand.
