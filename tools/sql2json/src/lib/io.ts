import fs from "node:fs";
import path from "node:path";
import type { JsonValue } from "./types";

export function writeJson(
  filePath: string,
  data: JsonValue,
  pretty: boolean,
): void {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  const spaces = pretty ? 2 : 0;
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, spaces)}\n`, "utf8");
}
