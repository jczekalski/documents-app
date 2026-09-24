import axios from "axios";

import { Document, DocumentsSchema } from "@/schemas/document";
import { normalizeKeys } from "@/utils/normalizeKeys";
import { backendUrl } from "./constants";

export async function getDocuments(): Promise<Document[]> {
  const response = await axios.get(`${backendUrl}/documents`);
  return DocumentsSchema.parse(normalizeKeys(response.data));
}
