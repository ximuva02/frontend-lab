import fs from "node:fs";
import { parseInsertStatements } from "./sql";
import type { JsonValue, MappingModule, TableMapper, TableRows } from "./types";

export function loadMapping(mappingPath: string | null): MappingModule | null {
  if (!mappingPath) {
    return null;
  }

  if (!fs.existsSync(mappingPath)) {
    throw new Error(`Mapping file not found: ${mappingPath}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(mappingPath) as MappingModule;
}

export function applyMapping(
  rawData: TableRows,
  mapping: MappingModule | null,
): JsonValue {
  if (!mapping) {
    return rawData;
  }

  if (typeof mapping === "function") {
    return mapping(rawData);
  }

  if (typeof mapping !== "object") {
    throw new Error("Mapping must export either a function or an object.");
  }

  const mapped = Object.entries(rawData).reduce<TableRows>(
    (acc, [table, rows]) => {
      const tableMapper = mapping[table];
      if (typeof tableMapper === "function") {
        acc[table] = rows.map((row, index) =>
          (tableMapper as TableMapper)(row, { table, index, allData: rawData }),
        );
      } else {
        acc[table] = rows;
      }

      return acc;
    },
    {},
  );

  if (typeof mapping.$postProcess === "function") {
    return mapping.$postProcess(mapped, rawData);
  }

  return mapped;
}

export function transformSql(
  sql: string,
  mapping: MappingModule | null = null,
): {
  rawData: TableRows;
  mappedData: JsonValue;
} {
  const rawData = parseInsertStatements(sql);
  const mappedData = applyMapping(rawData, mapping);

  return { rawData, mappedData };
}
