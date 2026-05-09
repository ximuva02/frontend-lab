#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { createDefaultCliArgs, parseArgs } from "./lib/args";
import { writeJson } from "./lib/io";
import { parseInsertStatements } from "./lib/sql";
import { applyMapping, loadMapping } from "./lib/transforming";

export function runCli(): void {
  const baseDir = path.resolve(__dirname, "..");
  const defaults = createDefaultCliArgs(baseDir);
  const args = parseArgs(process.argv.slice(2), defaults);
  const sql = fs.readFileSync(args.input, "utf8");

  const rawData = parseInsertStatements(sql);
  const mapping = loadMapping(args.mapping);
  const mappedData = applyMapping(rawData, mapping);

  writeJson(args.outRaw, rawData, args.pretty);
  writeJson(args.outMapped, mappedData, args.pretty);

  process.stdout.write(
    `${JSON.stringify({
      input: args.input,
      outRaw: args.outRaw,
      outMapped: args.outMapped,
      tables: Object.keys(rawData),
      mappingApplied: Boolean(args.mapping),
    })}\n`,
  );
}

export function executeCli(): void {
  try {
    runCli();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`sqlTransformer failed: ${message}\n`);
    process.exit(1);
  }
}

if (require.main === module) {
  executeCli();
}
