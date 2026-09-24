import axios from "axios";

import { Document, DocumentsSchema } from "@/schemas/document";
import { normalizeKeys } from "@/utils/normalizeKeys";
import { backendUrl } from "./constants";

export type DocumentsFetchResult =
  { documents: Document[]; error: null } | { documents: null; error: Error };

export async function fetchDocuments(): Promise<DocumentsFetchResult> {
  try {
    const response = await axios.get(`${backendUrl}/documents`);
    const documents = DocumentsSchema.parse(normalizeKeys(response.data));

    return { documents, error: null };
  } catch (error) {
    return {
      documents: null,
      error:
        error instanceof Error ? error : new Error("Failed to fetch documents"),
    };
  }
}
