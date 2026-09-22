import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { colors } from "../designSystem";

import { AddDocumentButton } from "../components/AddDocumentButton";
import { DocumentList } from "../components/DocumentList";
import { DocumentToolbar } from "../components/DocumentToolbar";
import { Header } from "../components/Header";
import { DocumentViewMode } from "../components/ViewToggle";
import { Document } from "../types/document";

interface DocumentsScreenProps {
  documents: Document[];
  notificationCount?: number;
  onAddDocument: () => void;
  onNotificationsPress?: () => void;
  onDocumentPress?: (document: Document) => void;
}

export function DocumentsScreen({
  documents,
  notificationCount = 0,
  onAddDocument,
  onNotificationsPress,
  onDocumentPress,
}: DocumentsScreenProps) {
  const [viewMode, setViewMode] = useState<DocumentViewMode>("grid");

  if (documents.length === 0) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <Header
        title="Documents"
        notificationCount={notificationCount}
        onNotificationsPress={onNotificationsPress}
      />

      <DocumentToolbar viewMode={viewMode} onViewModeChange={setViewMode} />

      <View style={styles.listContainer}>
        <DocumentList
          documents={documents}
          viewMode={viewMode}
          onDocumentPress={onDocumentPress}
        />
      </View>

      <AddDocumentButton onPress={onAddDocument} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContainer: {
    flex: 1,
  },
});
