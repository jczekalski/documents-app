import Storage from "expo-sqlite/kv-store";

export function readStoredArray<T>(key: string): T[] {
  const storedValue = Storage.getItemSync(key);

  if (!storedValue) {
    return [];
  }

  try {
    const value: unknown = JSON.parse(storedValue);
    return Array.isArray(value) ? (value as T[]) : [];
  } catch {
    return [];
  }
}

export function storeArray<T>(key: string, value: T[]): void {
  Storage.setItemSync(key, JSON.stringify(value));
}
