export function mergeClassNames(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}
