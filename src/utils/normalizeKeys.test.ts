import { normalizeKeys } from "./normalizeKeys";

describe("normalizeKeys", () => {
  it("converts snake case and PascalCase keys to camel case", () => {
    expect(
      normalizeKeys({ DOCUMENT_NAME: "Plan", CreatedAt: "today" }),
    ).toEqual({ documentName: "Plan", createdAt: "today" });
  });

  it("preserves acronym boundaries while converting keys", () => {
    expect(normalizeKeys({ HTTPServerID: 3, documentID: "abc" })).toEqual({
      httpServerId: 3,
      documentId: "abc",
    });
  });

  it("recursively normalizes nested objects and objects in arrays", () => {
    expect(
      normalizeKeys({
        DOCUMENTS: [
          { DOCUMENT_ID: "1", CREATED_AT: "today" },
          { DOCUMENT_ID: "2", CREATED_AT: "tomorrow" },
        ],
      }),
    ).toEqual({
      documents: [
        { documentId: "1", createdAt: "today" },
        { documentId: "2", createdAt: "tomorrow" },
      ],
    });
  });

  it.each([null, undefined, "text", 42, true])(
    "returns primitive values unchanged (%s)",
    (value) => {
      expect(normalizeKeys(value)).toBe(value);
    },
  );

  it("preserves empty arrays and objects", () => {
    expect(normalizeKeys({ EMPTY_LIST: [], EMPTY_OBJECT: {} })).toEqual({
      emptyList: [],
      emptyObject: {},
    });
  });

  it("normalizes keys with spaces, hyphens, and underscores", () => {
    expect(
      normalizeKeys({
        DOCUMENT_TITLE: "Plan",
        "CREATED-AT": "today",
        "UPDATED AT": "tomorrow",
      }),
    ).toEqual({
      documentTitle: "Plan",
      createdAt: "today",
      updatedAt: "tomorrow",
    });
  });

  it("recursively normalizes mixed arrays, objects, and null values", () => {
    expect(
      normalizeKeys({
        DOCUMENTS: [
          { ATTACHMENT_NAMES: ["one", "two"] },
          null,
          [{ FILE_ID: "file-1" }, { FILE_ID: "file-2" }],
        ],
      }),
    ).toEqual({
      documents: [
        { attachmentNames: ["one", "two"] },
        null,
        [{ fileId: "file-1" }, { fileId: "file-2" }],
      ],
    });
  });

  it("does not mutate the input object", () => {
    const input = { DOCUMENT_NAME: "Plan", METADATA: { CREATED_AT: "today" } };

    normalizeKeys(input);

    expect(input).toEqual({
      DOCUMENT_NAME: "Plan",
      METADATA: { CREATED_AT: "today" },
    });
  });
});
