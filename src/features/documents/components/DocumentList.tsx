import { FlatList, StyleSheet, useWindowDimensions } from "react-native";

import { spacing } from "@/constants/designSystem";
import { Document } from "@/types/document";
import { DocumentCard } from "./DocumentCard";
import { DocumentViewMode } from "./ViewToggle";

const PADDING_BETWEEN_ITEMS = spacing.lg;
const GRID_MODE_COLUMNS_COUNT = 2;

interface DocumentListProps {
  documents: Document[];
  viewMode: DocumentViewMode;
  refreshing: boolean;
  onDocumentPress?: (document: Document) => void;
  onRefresh?: () => void;
}

export function DocumentList({
  documents,
  viewMode,
  refreshing,
  onDocumentPress,
  onRefresh,
}: DocumentListProps) {
  const { width } = useWindowDimensions();

  const gridModeEnabled = viewMode === "grid";

  const numColumns = gridModeEnabled ? GRID_MODE_COLUMNS_COUNT : 1;
  const columnWrapperStyle = gridModeEnabled
    ? { gap: PADDING_BETWEEN_ITEMS }
    : undefined;

  const cardWidthInGridMode =
    (width - PADDING_BETWEEN_ITEMS * (numColumns + 1)) / numColumns;
  const cardStyle = gridModeEnabled
    ? {
        width: cardWidthInGridMode,
      }
    : undefined;

  return (
    <FlatList
      data={documents}
      // allows us to change numColumns on the fly by forcing the list to re-render
      // when switching between view modes
      key={viewMode}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <DocumentCard
          document={item}
          compact={gridModeEnabled}
          style={cardStyle}
          onPress={onDocumentPress}
        />
      )}
      showsVerticalScrollIndicator={false}
      numColumns={numColumns}
      columnWrapperStyle={columnWrapperStyle}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: PADDING_BETWEEN_ITEMS,
    paddingBottom: spacing.xxxl,
  },
});
