import { Platform } from "react-native";
import { normalizeKeys } from "../utils";

export type Notification = {
  Timestamp: string;
  UserID: string;
  UserName: string;
  DocumentID: string;
  DocumentTitle: string;
};

const url = Platform.select({
  ios: process.env.EXPO_PUBLIC_NOTIFICATIONS_WS_URL_IOS ?? "",
  android: process.env.EXPO_PUBLIC_NOTIFICATIONS_WS_URL_ANDROID ?? "",
  default: "",
});

export function connectNotifications(
  onNotification: (notification: Notification) => void,
) {
  const socket = new WebSocket(url);

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    try {
      const notification = normalizeKeys(
        JSON.parse(event.data),
      ) as Notification;

      console.log("Received notification:", notification);

      onNotification(notification);
    } catch (error) {
      console.error("Failed to parse WebSocket message", error);
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onclose = (event) => {
    console.log("WebSocket closed:", event.code, event.reason);
  };

  // Important: return a cleanup function
  return () => {
    socket.close();
  };
}
