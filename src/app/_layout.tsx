import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

import { spacing } from "@/constants/designSystem";
import { DocumentsProvider } from "@/stores/documentsStore";
import { NotificationsProvider } from "@/stores/notificationsStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function AppToast() {
  const insets = useSafeAreaInsets();

  return <Toast topOffset={insets.top + spacing.md} />;
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
      <AppToast />
    </GestureHandlerRootView>
  );
}
