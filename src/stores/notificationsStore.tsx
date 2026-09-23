import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Toast from "react-native-toast-message";

import type { Notification } from "@/schemas/notification";
import { readStoredArray, storeArray } from "@/services/localStorage";
import {
  connectNotifications,
  type NotificationConnectionStatus,
} from "@/services/notifications";

const NOTIFICATIONS_STORAGE_KEY = "notifications";

interface NotificationsContextValue {
  notifications: Notification[];
  connectionStatus: NotificationConnectionStatus;
  addNotification: (notification: Notification) => void;
}

const NotificationsContext = createContext<
  NotificationsContextValue | undefined
>(undefined);

interface NotificationsProviderProps {
  children: ReactNode;
}

// Specifies how long each notification is displayed.
const TOAST_DURATION = 3000;
// Specifies time between notifications, so as not to spam the user.
const NOTIFICATION_DELAY = TOAST_DURATION + 3000;

export function NotificationsProvider({
  children,
}: NotificationsProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    readStoredArray<Notification>(NOTIFICATIONS_STORAGE_KEY),
  );
  const [connectionStatus, setConnectionStatus] =
    useState<NotificationConnectionStatus>("connecting");
  const queueRef = useRef<Notification[]>([]);
  const processingRef = useRef(false);

  const processQueue = useCallback(async () => {
    if (processingRef.current || queueRef.current.length === 0) {
      return;
    }

    processingRef.current = true;

    while (queueRef.current.length > 0) {
      const notification = queueRef.current.shift();

      if (!notification) {
        continue;
      }

      Toast.show({
        type: "success",
        text1: notification.documentTitle,
        text2: `${notification.userName} created ${notification.documentTitle}.`,
        visibilityTime: TOAST_DURATION,
        position: "top",
      });

      await new Promise((resolve) => {
        setTimeout(resolve, NOTIFICATION_DELAY);
      });
    }

    processingRef.current = false;
  }, []);

  const addNotification = useCallback(
    (notification: Notification) => {
      setNotifications((current) => [...current, notification]);

      queueRef.current.push(notification);
      processQueue();
    },
    [processQueue],
  );

  useEffect(() => {
    storeArray(NOTIFICATIONS_STORAGE_KEY, notifications);
  }, [notifications]);

  useEffect(() => {
    const disconnect = connectNotifications(
      addNotification,
      setConnectionStatus,
    );

    return disconnect;
  }, [addNotification]);

  const value = useMemo(
    () => ({
      notifications,
      connectionStatus,
      addNotification,
    }),
    [notifications, connectionStatus, addNotification],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider",
    );
  }

  return context;
}
