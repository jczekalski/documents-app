function toCamelCase(key: string): string {
  // Split acronym and word boundaries before handling snake/kebab case.
  return key
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word, index) => {
      const lowerCaseWord = word.toLowerCase();
      return index === 0
        ? lowerCaseWord
        : lowerCaseWord[0].toUpperCase() + lowerCaseWord.slice(1);
    })
    .join("");
}

function normalizeArray(values: unknown[]): unknown[] {
  return values.map(normalizeKeys);
}

function normalizeObject(
  value: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      toCamelCase(key),
      normalizeKeys(nestedValue),
    ]),
  );
}

export function normalizeKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return normalizeArray(value);
  }

  if (value !== null && typeof value === "object") {
    return normalizeObject(value as Record<string, unknown>);
  }

  return value;
}
