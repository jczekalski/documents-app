import { act, renderHook, waitFor } from "@testing-library/react-native";

import { getDocuments } from "@/services/documents";
import { readStoredArray, storeArray } from "@/services/localStorage";
import { DocumentsProvider, useDocuments } from "./documentsStore";

jest.mock("@/services/documents", () => ({ getDocuments: jest.fn() }));
jest.mock("@/services/localStorage", () => ({
  readStoredArray: jest.fn(() => []),
  storeArray: jest.fn(),
}));

const savedDocument = {
  id: "a9c1ac2a-473c-4b46-9388-08f91fcfdc88",
  createdAt: "2026-06-01T09:00:00Z",
  updatedAt: "2026-06-02T10:30:00Z",
  title: "Quarterly report",
  attachments: ["Annual report", "Meeting notes"],
  contributors: [
    { id: "586f60c1-64c0-4efb-9544-4e701782c31e", name: "Sam Rivera" },
  ],
  version: "1.0.0",
};

describe("DocumentsProvider", () => {
  const mockGetDocuments = jest.mocked(getDocuments);

  beforeEach(() => {
    mockGetDocuments.mockReset();
    jest.mocked(readStoredArray).mockReturnValue([]);
    jest.mocked(storeArray).mockClear();
  });

  it("loads documents when the provider starts", async () => {
    mockGetDocuments.mockResolvedValue([savedDocument]);

    const { result } = await renderHook(() => useDocuments(), {
      wrapper: DocumentsProvider,
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.documents).toEqual([savedDocument]);
    expect(result.current.error).toBeNull();
    expect(mockGetDocuments).toHaveBeenCalledTimes(1);
  });

  it("exposes an initial fetch error and can retry successfully", async () => {
    mockGetDocuments
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce([savedDocument]);

    const { result } = await renderHook(() => useDocuments(), {
      wrapper: DocumentsProvider,
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error?.message).toBe("offline");
    expect(mockGetDocuments).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.loadDocuments();
    });

    expect(result.current.documents).toEqual([savedDocument]);
    expect(result.current.error).toBeNull();
    expect(mockGetDocuments).toHaveBeenCalledTimes(2);
  });
});
