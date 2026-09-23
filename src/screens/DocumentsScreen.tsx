import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import { colors } from "../designSystem";

import { AddDocumentSheet } from "@/components/AddDocumentSheet";
import { BottomButton } from "@/components/BottomButton";
import { getDocuments } from "@/services/documents";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import { DocumentList } from "../components/DocumentList";
import { DocumentToolbar } from "../components/DocumentToolbar";
import { Header } from "../components/Header";
import { DocumentViewMode } from "../components/ViewToggle";
import { Document } from "../types/document";

export function DocumentsScreen() {
  const [viewMode, setViewMode] = useState<DocumentViewMode>("list");
  const [refreshing, setRefreshing] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);

  const addDocumentSheetRef = useRef<BottomSheetModal>(null);

  const notificationCount = 0;

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const documents = await getDocuments();
      console.log(JSON.stringify(documents, null, 2));
      setDocuments(documents);
    } catch (e) {
      console.error("Server error.", e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetchData = () => {
    fetchData();
  };

  const openAddDocumentSheet = useCallback(() => {
    addDocumentSheetRef.current?.present();
  }, []);

  // Note: Stores data locally, since using a database is not allowed in this task
  const handleCreateDocument = (data: Document) => {
    setDocuments((current) => [data, ...current]);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Header title="Documents" notificationCount={notificationCount} />
      <DocumentToolbar viewMode={viewMode} onViewModeChange={setViewMode} />
      <View style={styles.listContainer}>
        <DocumentList
          documents={documents}
          viewMode={viewMode}
          refreshing={refreshing}
          onRefresh={refetchData}
        />
      </View>
      <BottomButton
        label="Add document"
        icon="plus"
        onPress={openAddDocumentSheet}
      />
      <AddDocumentSheet
        ref={addDocumentSheetRef}
        onSubmit={handleCreateDocument}
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
