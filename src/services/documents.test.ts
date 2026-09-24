import axios from "axios";

import { getDocuments } from "./documents";

jest.mock("axios", () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));
jest.mock("@/services/constants", () => ({
  backendUrl: "http://localhost:8080",
}));

const validServerDocument = {
  ID: "a9c1ac2a-473c-4b46-9388-08f91fcfdc88",
  CreatedAt: "2026-06-01T09:00:00Z",
  UpdatedAt: "2026-06-02T10:30:00Z",
  Title: "Quarterly report",
  Attachments: ["Annual report", "Meeting notes"],
  Contributors: [
    { ID: "586f60c1-64c0-4efb-9544-4e701782c31e", Name: "Sam Rivera" },
  ],
  Version: "1.0.0",
};

describe("getDocuments", () => {
  const mockGet = jest.mocked(axios.get);

  beforeEach(() => {
    mockGet.mockReset();
  });

  it("requests documents and returns normalized, validated data", async () => {
    mockGet.mockResolvedValue({ data: [validServerDocument] });

    await expect(getDocuments()).resolves.toEqual([
      {
        id: validServerDocument.ID,
        createdAt: validServerDocument.CreatedAt,
        updatedAt: validServerDocument.UpdatedAt,
        title: validServerDocument.Title,
        attachments: validServerDocument.Attachments,
        contributors: [
          {
            id: validServerDocument.Contributors[0].ID,
            name: validServerDocument.Contributors[0].Name,
          },
        ],
        version: validServerDocument.Version,
      },
    ]);
    expect(mockGet).toHaveBeenCalledWith("http://localhost:8080/documents");
  });

  it("rejects a response that does not match the document schema", async () => {
    mockGet.mockResolvedValue({
      data: [{ ...validServerDocument, Title: null }],
    });

    await expect(getDocuments()).rejects.toThrow();
  });
});
