import { FlatList, StyleSheet } from "react-native";

import { spacing } from "../designSystem";
import { Document } from "../types/document";
import { DocumentCard } from "./DocumentCard";

interface DocumentListProps {
  documents: Document[];
  onDocumentPress?: (document: Document) => void;
}

export function DocumentList({
  documents,
  onDocumentPress,
}: DocumentListProps) {
  return (
    <FlatList
      data={documents}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <DocumentCard document={item} onPress={onDocumentPress} />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
});
