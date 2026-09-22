import axios from "axios";
import { Platform } from "react-native";

import { normalizeKeys } from "@/utils";
import { Document } from "../types/document";

const url = Platform.select({
  ios: process.env.EXPO_PUBLIC_DOCUMENTS_URL_IOS ?? "",
  android: process.env.EXPO_PUBLIC_DOCUMENTS_URL_ANDROID ?? "",
  default: "",
});

export async function getDocuments() {
  const response = await axios.get(url);
  return normalizeKeys(response.data) as Document[];
}
