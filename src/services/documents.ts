import axios from "axios";

import { normalizeKeys } from "@/utils/normalizeKeys";
import { DocumentsSchema } from "@/schemas/document";
import { backendUrl } from "./constants";

export async function getDocuments() {
  const response = await axios.get(`${backendUrl}/documents`);
  return DocumentsSchema.parse(normalizeKeys(response.data));
}
