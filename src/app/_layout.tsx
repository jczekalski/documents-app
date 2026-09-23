import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { DocumentsProvider } from "@/stores/documentsStore";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DocumentsProvider>
        <BottomSheetModalProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </BottomSheetModalProvider>
      </DocumentsProvider>
    </GestureHandlerRootView>
  );
}
