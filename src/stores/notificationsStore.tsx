import type { Notification } from "@/schemas/notification";
import { readStoredArray, storeArray } from "@/services/localStorage";
import {
  configureNotificationPresentation,
  presentQueuedNotification,
} from "@/services/notificationPresentation";
import {
  connectNotifications,
  type NotificationConnectionStatus,
} from "@/services/notifications";
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

// Space notifications out so queued events are presented one at a time.
const NOTIFICATION_DELAY = 6000;

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

      try {
        await presentQueuedNotification(notification);
      } catch (error) {
        console.error("Failed to present notification", error);
      }

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
    // Setup is async, so keep the disconnect function available to cleanup
    // even when the socket is created after this effect first runs.
    let disconnect: (() => void) | undefined;
    // If cleanup runs while setup is awaiting permission, skip connecting later.
    let isCancelled = false;

    async function connectAfterNotificationSetup() {
      await configureNotificationPresentation();

      if (!isCancelled) {
        disconnect = connectNotifications(addNotification, setConnectionStatus);
      }
    }

    connectAfterNotificationSetup().catch((error) => {
      console.error("Failed to set up local notifications", error);
      if (!isCancelled) {
        disconnect = connectNotifications(addNotification, setConnectionStatus);
      }
    });

    return () => {
      isCancelled = true;
      disconnect?.();
    };
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
