import { Platform } from "react-native";

export const backendUrl = Platform.select({
  ios: process.env.EXPO_PUBLIC_API_URL_IOS ?? "",
  android: process.env.EXPO_PUBLIC_API_URL_ANDROID ?? "",
  default: "",
});
