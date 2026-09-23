import { NotificationSchema, type Notification } from "@/schemas/notification";

import { normalizeKeys } from "../utils/normalizeKeys";
import { backendUrl } from "./constants";

const INITIAL_RETRY_DELAY_MS = 1_000;
const MAX_RETRY_DELAY_MS = 30_000;
const STABLE_CONNECTION_DURATION_MS = 30_000;

export type NotificationConnectionStatus =
  "connecting" | "connected" | "reconnecting";

export function connectNotifications(
  onNotification: (notification: Notification) => void,
  onStatusChange: (status: NotificationConnectionStatus) => void,
) {
  let socket: WebSocket | null = null;
  let retryTimeout: ReturnType<typeof setTimeout> | null = null;
  let stableConnectionTimeout: ReturnType<typeof setTimeout> | null = null;
  let retryAttempt = 0;
  let isStopped = false;

  const scheduleReconnect = () => {
    onStatusChange("reconnecting");

    const delay = Math.min(
      INITIAL_RETRY_DELAY_MS * 2 ** retryAttempt,
      MAX_RETRY_DELAY_MS,
    );
    retryAttempt += 1;
    retryTimeout = setTimeout(connect, delay);
  };

  function connect() {
    if (isStopped) {
      return;
    }

    onStatusChange(retryAttempt === 0 ? "connecting" : "reconnecting");

    try {
      socket = new WebSocket(`${backendUrl}/notifications`);

      socket.onopen = () => {
        if (isStopped) return;
        onStatusChange("connected");
        stableConnectionTimeout = setTimeout(() => {
          retryAttempt = 0;
        }, STABLE_CONNECTION_DURATION_MS);
      };

      socket.onmessage = (event) => {
        try {
          const notification = NotificationSchema.parse(
            normalizeKeys(JSON.parse(event.data)),
          );

          onNotification(notification);
        } catch (error) {
          console.error("Failed to parse WebSocket message", error);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socket.onclose = (event) => {
        if (isStopped) {
          return;
        }
        if (stableConnectionTimeout) {
          clearTimeout(stableConnectionTimeout);
          stableConnectionTimeout = null;
        }

        console.log("WebSocket closed:", event.code, event.reason);
        scheduleReconnect();
      };
    } catch (error) {
      console.error("Unable to connect to notifications:", error);
      scheduleReconnect();
    }
  }

  connect();

  return () => {
    isStopped = true;
    if (retryTimeout) {
      clearTimeout(retryTimeout);
    }
    if (stableConnectionTimeout) {
      clearTimeout(stableConnectionTimeout);
    }
    socket?.close();
  };
}
