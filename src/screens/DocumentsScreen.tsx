import { useCallback, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import { colors } from "../designSystem";

import { AddDocumentSheet } from "@/components/AddDocumentSheet";
import { BottomButton } from "@/components/BottomButton";
import { useDocuments } from "@/stores/documentsStore";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import { DocumentList } from "../components/DocumentList";
import { DocumentToolbar } from "../components/DocumentToolbar";
import { Header } from "../components/Header";
import { DocumentViewMode } from "../components/ViewToggle";

export function DocumentsScreen() {
  const [viewMode, setViewMode] = useState<DocumentViewMode>("list");

  const addDocumentSheetRef = useRef<BottomSheetModal>(null);

  const { documents, loading, loadDocuments, addDocument } = useDocuments();

  const notificationCount = 0;
  const sortedDocuments = [...documents].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  const refresh = async () => {
    await loadDocuments();
  };

  const openAddDocumentSheet = useCallback(() => {
    addDocumentSheetRef.current?.present();
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <Header title="Documents" notificationCount={notificationCount} />
      <DocumentToolbar viewMode={viewMode} onViewModeChange={setViewMode} />
      <View style={styles.listContainer}>
        <DocumentList
          documents={sortedDocuments}
          viewMode={viewMode}
          refreshing={loading}
          onRefresh={refresh}
        />
      </View>
      <BottomButton
        label="Add document"
        icon="plus"
        onPress={openAddDocumentSheet}
      />
      <AddDocumentSheet
        ref={addDocumentSheetRef}
        // Note: Stores data locally, since using a database is not allowed in this task
        onSubmit={addDocument}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  listContainer: {
    flex: 1,
  },
});
