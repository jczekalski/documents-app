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

import { connectNotifications } from "@/services/notifications";
import { Notification } from "@/types/notification";

interface NotificationsContextValue {
  notifications: Notification[];
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
    const disconnect = connectNotifications(addNotification);

    return disconnect;
  }, [addNotification]);

  const value = useMemo(
    () => ({
      notifications,
      addNotification,
    }),
    [notifications, addNotification],
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
