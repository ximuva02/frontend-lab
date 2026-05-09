import fs from "node:fs";
import { transformSql } from "./transforming";
import { loadMapping } from "./transforming";
import type { JsonValue, TableRows } from "./types";

export function transformSqlFromFiles(
  sqlPath: string,
  mappingPath: string | null = null,
): {
  rawData: TableRows;
  mappedData: JsonValue;
} {
  const sql = fs.readFileSync(sqlPath, "utf8");
  const mapping = loadMapping(mappingPath);

  return transformSql(sql, mapping);
}
