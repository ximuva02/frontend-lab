export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export type JsonObject = { [key: string]: JsonValue };
export type TableRows = Record<string, JsonObject[]>;

export type MappingContext = {
  table: string;
  index: number;
  allData: TableRows;
};

export type TableMapper = (
  row: JsonObject,
  context: MappingContext,
) => JsonObject;

export type MappingObject = {
  [table: string]:
    | TableMapper
    | ((mapped: TableRows, rawData: TableRows) => JsonValue)
    | undefined;
  $postProcess?: (mapped: TableRows, rawData: TableRows) => JsonValue;
};

export type MappingModule = MappingObject | ((rawData: TableRows) => JsonValue);

export type CliArgs = {
  input: string;
  outRaw: string;
  outMapped: string;
  mapping: string | null;
  pretty: boolean;
};
