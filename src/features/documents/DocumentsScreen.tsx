import { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import { colors } from "@/constants/designSystem";

import { BottomButton } from "@/components/base";
import { useDocuments } from "@/stores/documentsStore";
import { useNotifications } from "@/stores/notificationsStore";
import type { Document } from "@/types/document";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AddDocumentSheet,
  DocumentList,
  DocumentToolbar,
  Header,
  type DocumentViewMode,
} from "./components";
import type { DocumentSortOption } from "./components/SortOptionsModal";

function sortDocuments(
  documents: Document[],
  sortOption: DocumentSortOption,
): Document[] {
  const documentsCopy = [...documents];

  switch (sortOption) {
    case "dateOldest":
      return documentsCopy.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    case "title":
      return documentsCopy.sort((a, b) => a.title.localeCompare(b.title));
    case "dateNewest":
      return documentsCopy.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }
}

export function DocumentsScreen() {
  const [viewMode, setViewMode] = useState<DocumentViewMode>("list");
  const [sortOption, setSortOption] =
    useState<DocumentSortOption>("dateNewest");

  const addDocumentSheetRef = useRef<BottomSheetModal>(null);

  const { documents, loading, loadDocuments, addDocument } = useDocuments();
  const { notifications } = useNotifications();

  const sortedDocuments = useMemo(
    () => sortDocuments(documents, sortOption),
    [documents, sortOption],
  );
  const notificationCount = notifications.length;

  const refresh = async () => {
    await loadDocuments();
  };

  const openAddDocumentSheet = useCallback(() => {
    addDocumentSheetRef.current?.present();
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <Header title="Documents" notificationCount={notificationCount} />
      <DocumentToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortOption={sortOption}
        onSortOptionChange={setSortOption}
      />
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
      <AddDocumentSheet ref={addDocumentSheetRef} onSubmit={addDocument} />
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
