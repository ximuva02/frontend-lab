import {
  Parser,
  type AST,
  type Insert_Replace,
  type Value,
} from "node-sql-parser";
import type { JsonObject, JsonPrimitive, JsonValue, TableRows } from "./types";

function toInsertStatements(ast: AST | AST[]): Insert_Replace[] {
  const statements = Array.isArray(ast) ? ast : [ast];
  return statements.filter(
    (node): node is Insert_Replace => node.type === "insert",
  );
}

export function getTableName(statement: Insert_Replace): string {
  const tableNode = Array.isArray(statement.table)
    ? statement.table[0]
    : statement.table;
  const tableName = tableNode?.table;

  if (!tableName || typeof tableName !== "string") {
    throw new Error("Could not resolve table name from INSERT statement.");
  }

  return tableName;
}

function parseExpressionValue(expr: unknown): JsonValue {
  if (!expr || typeof expr !== "object") {
    return null;
  }

  const typedExpr = expr as Value;

  if (typedExpr.type === "null") {
    return null;
  }

  if (
    typedExpr.type === "number" ||
    typedExpr.type === "bool" ||
    typedExpr.type === "boolean" ||
    typedExpr.type === "single_quote_string" ||
    typedExpr.type === "double_quote_string" ||
    typedExpr.type === "string"
  ) {
    const val = typedExpr.value as JsonPrimitive;

    if (typedExpr.type === "number" && typeof val === "string") {
      const numeric = Number.parseFloat(val);
      return Number.isNaN(numeric) ? val : numeric;
    }

    return val;
  }

  if (typedExpr.type === "default") {
    return "DEFAULT";
  }

  if (Object.prototype.hasOwnProperty.call(typedExpr, "value")) {
    return (typedExpr as { value: JsonValue }).value;
  }

  return null;
}

export function parseInsertStatements(sql: string): TableRows {
  const parser = new Parser();
  const ast = parser.astify(sql);
  const inserts = toInsertStatements(ast);

  const result: TableRows = {};

  inserts.forEach((statement) => {
    const table = getTableName(statement);
    const columns = statement.columns ?? [];

    if (!statement.values || statement.values.type !== "values") {
      throw new Error(
        `INSERT statement for ${table} has unsupported VALUES shape.`,
      );
    }

    if (!result[table]) {
      result[table] = [];
    }

    statement.values.values.forEach((rowExprList) => {
      const fields = rowExprList.value;
      if (fields.length !== columns.length) {
        throw new Error(
          `Column/value mismatch in table ${table}: ${columns.length} columns vs ${fields.length} values.`,
        );
      }

      const row: JsonObject = {};
      columns.forEach((column, index) => {
        row[column] = parseExpressionValue(fields[index]);
      });

      result[table].push(row);
    });
  });

  return result;
}
