import { Platform } from "react-native";
import Toast from "react-native-toast-message";

import type { Notification } from "@/schemas/notification";

export async function configureNotificationPresentation(): Promise<void> {
  if (Platform.OS !== "ios") {
    return;
  }

  const Notifications = await import("expo-notifications");

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  const { granted } = await Notifications.getPermissionsAsync();
  if (!granted) {
    await Notifications.requestPermissionsAsync();
  }
}

const TOAST_VISIBILITY_TIME = 3000;

export async function presentQueuedNotification(
  notification: Notification,
): Promise<void> {
  const title = notification.documentTitle;
  const body = `${notification.userName} created ${title}.`;

  if (Platform.OS === "ios") {
    const Notifications = await import("expo-notifications");

    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  } else {
    Toast.show({
      type: "success",
      text1: title,
      text2: body,
      visibilityTime: TOAST_VISIBILITY_TIME,
      position: "top",
    });
  }
}
