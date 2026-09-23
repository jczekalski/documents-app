import axios from "axios";

import { normalizeKeys } from "@/utils/normalizeKeys";
import { Document } from "../types/document";
import { backendUrl } from "./constants";

export async function getDocuments() {
  const response = await axios.get(`${backendUrl}/documents`);
  return normalizeKeys(response.data) as Document[];
}
