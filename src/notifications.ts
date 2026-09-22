export type Notification = {
  Timestamp: string;
  UserID: string;
  UserName: string;
  DocumentID: string;
  DocumentTitle: string;
};

const WS_URL = process.env.EXPO_PUBLIC_WS_URL ?? "";

export function connectNotifications(
  onNotification: (notification: Notification) => void,
) {
  const socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    try {
      const notification: Notification = JSON.parse(event.data);

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
