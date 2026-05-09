# SQL Transformer

Kleines Tool, das SQL-INSERT-Daten in JSON umwandelt.

Ziele:

- SQL Testdaten in ein neutrales JSON Format ueberfuehren
- Optionales Mapping auf API-Shape (z. B. fuer Frontend, MSW, OpenAPI Clients)
- Nutzung als CLI und als Library

## Ordnerstruktur

- Input-Dateien: [architecture/sqlTransformer/input](architecture/sqlTransformer/input)
- Output-Dateien: [architecture/sqlTransformer/output](architecture/sqlTransformer/output)
- TypeScript Source: [architecture/sqlTransformer/src](architecture/sqlTransformer/src)
- SQL Parser Logik: [architecture/sqlTransformer/src/lib/sql.ts](architecture/sqlTransformer/src/lib/sql.ts)
- Mapping/Transforming Logik: [architecture/sqlTransformer/src/lib/transforming.ts](architecture/sqlTransformer/src/lib/transforming.ts)
- CLI Einstieg: [architecture/sqlTransformer/src/cli.ts](architecture/sqlTransformer/src/cli.ts)
- Library Exports: [architecture/sqlTransformer/src/index.ts](architecture/sqlTransformer/src/index.ts)

## Voraussetzungen

- Node.js 18+
- npm

## Installation

Im Ordner architecture/sqlTransformer ausfuehren:

npm install

## Build

npm run build

## CLI Nutzung

Standard-Flow mit Beispiel-Dateien:

npm run transform:sample

Direkter Aufruf:

` node dist/cli.js --input input/testdata.sql --out-raw output/db-data.json --out-mapped output/api-data.json --mapping input/mapping.example.js`

## Input und Output

Input:

- SQL Datei, z. B. [architecture/sqlTransformer/input/testdata.sql](architecture/sqlTransformer/input/testdata.sql)
- Optionales Mapping, z. B. [architecture/sqlTransformer/input/mapping.example.js](architecture/sqlTransformer/input/mapping.example.js)

Output:

- Rohdaten: [architecture/sqlTransformer/output/db-data.json](architecture/sqlTransformer/output/db-data.json)
- Gemappte API Daten: [architecture/sqlTransformer/output/api-data.json](architecture/sqlTransformer/output/api-data.json)

## Mapping Konzept

Du kannst ein Mapping-Modul uebergeben, das eine von zwei Varianten exportiert:

1. Funktion auf Gesamtdatensatz

- Signatur: rawData -> mappedData

2. Objekt mit Table-Mapping

- Pro Tabelle eine Funktion
- Optional zusaetzlich post processing ueber $postProcess

Beispiel liegt in:

- [architecture/sqlTransformer/input/mapping.example.js](architecture/sqlTransformer/input/mapping.example.js)

## Nutzung als Library

Importiere Funktionen aus [architecture/sqlTransformer/src/index.ts](architecture/sqlTransformer/src/index.ts).

Typische Funktionen:

- parseInsertStatements: SQL -> TableRows
- applyMapping: TableRows + Mapping -> JsonValue
- transformSql: SQL + optional Mapping -> rawData und mappedData

Hinweis:
Fuer produktive Nutzung in einem externen Projekt wird ueblicherweise gegen den gebauten Output importiert (dist), nicht gegen src.

## Orval und MSW Einordnung

Der typische Ablauf fuer deinen Anwendungsfall:

1. SQL Testdaten aus input lesen
2. In Rohdaten transformieren
3. Mapping auf API-Shape anwenden
4. Ergebnis in MSW Handlern ausliefern
5. Orval-generierte MSW Handler gezielt mit diesen Datensaetzen ergaenzen oder ueberschreiben

Damit bleibt die Datenquelle nah an DB-Struktur, waehrend die ausgelieferte API-Antwort sauber dem OpenAPI-Vertrag entspricht.

## Skripte

Siehe [architecture/sqlTransformer/package.json](architecture/sqlTransformer/package.json).

Wichtige Skripte:

- npm run build
- npm run transform
- npm run transform:sample
