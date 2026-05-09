import path from "node:path";
import type { CliArgs } from "./types";

export function createDefaultCliArgs(baseDir: string): CliArgs {
  return {
    input: path.join(baseDir, "input", "testdata.sql"),
    outRaw: path.join(baseDir, "output", "db-data.json"),
    outMapped: path.join(baseDir, "output", "api-data.json"),
    mapping: null,
    pretty: true,
  };
}

export function parseArgs(argv: string[], defaults: CliArgs): CliArgs {
  const args: CliArgs = { ...defaults };

  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    const val = argv[i + 1];

    if (key === "--input" && val) {
      args.input = path.resolve(process.cwd(), val);
      i += 1;
      continue;
    }

    if (key === "--out-raw" && val) {
      args.outRaw = path.resolve(process.cwd(), val);
      i += 1;
      continue;
    }

    if (key === "--out-mapped" && val) {
      args.outMapped = path.resolve(process.cwd(), val);
      i += 1;
      continue;
    }

    if (key === "--mapping" && val) {
      args.mapping = path.resolve(process.cwd(), val);
      i += 1;
      continue;
    }

    if (key === "--compact") {
      args.pretty = false;
    }
  }

  return args;
}
