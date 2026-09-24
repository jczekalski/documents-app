const DOCUMENT_VERSION_PATTERN = /^\d+\.\d+\.\d+$/;

export function isValidDocumentVersion(version: string): boolean {
  return DOCUMENT_VERSION_PATTERN.test(version.trim());
}

export function formatDocumentVersion(version: string): string {
  const normalizedVersion = version.trim().replace(/^Version\s+/i, "");

  return `Version ${normalizedVersion}`;
}
