import axios from "axios";

import { fetchDocuments } from "./documents";

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

describe("fetchDocuments", () => {
  const mockGet = jest.mocked(axios.get);

  beforeEach(() => {
    mockGet.mockReset();
  });

  it("requests documents and returns normalized, validated data", async () => {
    mockGet.mockResolvedValue({ data: [validServerDocument] });

    await expect(fetchDocuments()).resolves.toEqual({
      documents: [{
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
      }],
      error: null,
    });
    expect(mockGet).toHaveBeenCalledWith("http://localhost:8080/documents");
  });

  it("returns a validation error when the response does not match the document schema", async () => {
    mockGet.mockResolvedValue({
      data: [{ ...validServerDocument, Title: null }],
    });

    await expect(fetchDocuments()).resolves.toMatchObject({
      documents: null,
      error: expect.any(Error),
    });
  });

  it("returns a request error result when fetching or validation fails", async () => {
    mockGet.mockRejectedValue(new Error("offline"));

    await expect(fetchDocuments()).resolves.toEqual({
      documents: null,
      error: new Error("offline"),
    });
  });
});
