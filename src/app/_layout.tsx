import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { Platform } from "react-native";

import { spacing } from "@/constants/designSystem";
import { DocumentsProvider } from "@/stores/documentsStore";
import { NotificationsProvider } from "@/stores/notificationsStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function AndroidToast() {
  const insets = useSafeAreaInsets();

  return Platform.OS === "android" ? (
    <Toast topOffset={insets.top + spacing.md} />
  ) : null;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DocumentsProvider>
        <NotificationsProvider>
          <BottomSheetModalProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </BottomSheetModalProvider>
        </NotificationsProvider>
      </DocumentsProvider>
      <AndroidToast />
    </GestureHandlerRootView>
  );
}
