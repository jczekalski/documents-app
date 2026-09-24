import {
  formatDocumentVersion,
  isValidDocumentVersion,
} from "./documentVersion";

describe("isValidDocumentVersion", () => {
  it.each(["1.2.0", "0.0.0", "12.34.56", " 1.2.0 "])(
    "accepts %s",
    (version) => {
      expect(isValidDocumentVersion(version)).toBe(true);
    },
  );

  it.each(["", "1", "1.2", "1.2.0.1", "v1.2.0", "1.2.beta", "1..0"])(
    "rejects %s",
    (version) => {
      expect(isValidDocumentVersion(version)).toBe(false);
    },
  );
});

describe("formatDocumentVersion", () => {
  it("trims input and adds the Version prefix", () => {
    expect(formatDocumentVersion(" 1.2.0 ")).toBe("Version 1.2.0");
  });

  it("does not add a duplicate Version prefix", () => {
    expect(formatDocumentVersion("Version 1.2.0")).toBe("Version 1.2.0");
  });

  it("normalizes the prefix casing", () => {
    expect(formatDocumentVersion("version 1.2.0")).toBe("Version 1.2.0");
  });
});
