import { File } from "expo-file-system";

function parseRows(contents: string): string[] {
  return contents
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .flatMap((row) => row.split(";"))
    .map((value) => value.trim())
    .filter(Boolean);
}

export function parseAttachmentCsv(contents: string): string[] {
  return parseRows(contents);
}

export async function readAttachmentCsv(uri: string): Promise<string[]> {
  const contents = await new File(uri).text();

  return parseAttachmentCsv(contents);
}
