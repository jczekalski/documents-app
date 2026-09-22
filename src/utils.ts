const toCamelCase = (key: string) =>
  key
    .replace(/^([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/-([a-z])/g, (_, char) => char.toUpperCase());

export const normalizeKeys = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(normalizeKeys);
  }

  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [
        toCamelCase(key),
        normalizeKeys(val),
      ]),
    );
  }

  return value;
};
