import { parseAttachmentCsv } from "./attachmentsCsv";

describe("parseAttachmentCsv", () => {
  it("parses semicolon-separated attachment names across rows", () => {
    expect(parseAttachmentCsv("React Native;Expo\nTypeScript;Jest")).toEqual([
      "React Native",
      "Expo",
      "TypeScript",
      "Jest",
    ]);
  });

  it("trims values and ignores empty cells and rows", () => {
    expect(parseAttachmentCsv("  first ; ; second  \n\n ; third; ")).toEqual([
      "first",
      "second",
      "third",
    ]);
  });

  it("supports Windows line endings", () => {
    expect(parseAttachmentCsv("one;two\r\nthree;four")).toEqual([
      "one",
      "two",
      "three",
      "four",
    ]);
  });

  it("returns an empty array for empty input", () => {
    expect(parseAttachmentCsv("")).toEqual([]);
  });

  it("strips a UTF-8 byte-order mark from the first attachment", () => {
    expect(parseAttachmentCsv("\uFEFFReact Native;Expo")).toEqual([
      "React Native",
      "Expo",
    ]);
  });

  it("keeps commas within attachment names and ignores a trailing newline", () => {
    expect(parseAttachmentCsv("Research, Design;Mobile Development\n")).toEqual(
      ["Research, Design", "Mobile Development"],
    );
  });

  it("preserves duplicate attachment names in the source data", () => {
    expect(parseAttachmentCsv("Expo;Expo;TypeScript")).toEqual([
      "Expo",
      "Expo",
      "TypeScript",
    ]);
  });
});
