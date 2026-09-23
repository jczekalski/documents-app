import { Notification } from "@/types/notification";

import { normalizeKeys } from "../utils/normalizeKeys";
import { backendUrl } from "./constants";

export function connectNotifications(
  onNotification: (notification: Notification) => void,
) {
  const socket = new WebSocket(`${backendUrl}/notifications`);

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    try {
      const notification = normalizeKeys(
        JSON.parse(event.data),
      ) as Notification;

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

  return () => {
    socket.close();
  };
}
