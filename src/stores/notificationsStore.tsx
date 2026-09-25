import type { Notification } from "@/schemas/notification";
import { readStoredArray, storeArray } from "@/services/localStorage";
import {
  configureNotificationPresentation,
  presentNotification,
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
// Limit max number of notifications stored.
// Stored notification are only used for display purposes on a screen used for testing.
export const MAX_NOTIFICATIONS = 50;
// This short window groups back-to-back events when the server's random sleep is zero.
const STATE_UPDATE_BATCH_DELAY_MS = 100;

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

function loadNotificationHistory(): Notification[] {
  return readStoredArray<Notification>(NOTIFICATIONS_STORAGE_KEY).slice(
    0,
    MAX_NOTIFICATIONS,
  );
}

export function NotificationsProvider({
  children,
}: NotificationsProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connectionStatus, setConnectionStatus] =
    useState<NotificationConnectionStatus>("connecting");
  // Used to avoid writing the initial empty list over saved fallback history before
  // the connection outcome is known.
  const [persistenceEnabled, setPersistenceEnabled] = useState(false);

  const hasConnectedRef = useRef(false);
  // This flag is used to ensure offline history is only loadded once and retries
  // don't overwrite live state.
  const fallbackLoadedRef = useRef(false);
  const pendingNotificationsRef = useRef<Notification[]>([]);
  const batchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleConnectionStatus = useCallback(
    (status: NotificationConnectionStatus) => {
      setConnectionStatus(status);

      if (status === "connected") {
        hasConnectedRef.current = true;
        return;
      }

      if (
        status === "reconnecting" &&
        !hasConnectedRef.current &&
        !fallbackLoadedRef.current
      ) {
        fallbackLoadedRef.current = true;
        setNotifications(loadNotificationHistory());
        setPersistenceEnabled(true);
      }
    },
    [],
  );

  // Combine a burst of notifications into one state update, preserving newest-first ordering.
  const flushPendingNotifications = useCallback(() => {
    batchTimerRef.current = null;
    const pending = pendingNotificationsRef.current.splice(0);

    if (pending.length === 0) {
      return;
    }

    setNotifications((current) =>
      [...pending.reverse(), ...current].slice(0, MAX_NOTIFICATIONS),
    );
    setPersistenceEnabled(true);
  }, []);

  const addNotification = useCallback(
    (notification: Notification) => {
      pendingNotificationsRef.current.push(notification);

      if (batchTimerRef.current === null) {
        batchTimerRef.current = setTimeout(
          flushPendingNotifications,
          STATE_UPDATE_BATCH_DELAY_MS,
        );
      }

      // Present each notification event immediately, only list and storage
      // updates are batched.
      void presentNotification(notification).catch((error) => {
        console.error("Failed to present notification", error);
      });
    },
    [flushPendingNotifications],
  );

  useEffect(() => {
    if (persistenceEnabled) {
      storeArray(NOTIFICATIONS_STORAGE_KEY, notifications);
    }
  }, [notifications, persistenceEnabled]);

  useEffect(() => {
    // Setup is async, so keep the disconnect function available to cleanup
    // even when the socket is created after this effect first runs.
    let disconnect: (() => void) | undefined;
    // If cleanup runs while setup is awaiting permission, skip connecting later.
    let isCancelled = false;

    async function connectAfterNotificationSetup() {
      await configureNotificationPresentation();

      if (!isCancelled) {
        disconnect = connectNotifications(
          addNotification,
          handleConnectionStatus,
        );
      }
    }

    connectAfterNotificationSetup().catch((error) => {
      console.error("Failed to set up local notifications", error);
      if (!isCancelled) {
        disconnect = connectNotifications(
          addNotification,
          handleConnectionStatus,
        );
      }
    });

    return () => {
      isCancelled = true;
      disconnect?.();
    };
  }, [addNotification, handleConnectionStatus]);

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
