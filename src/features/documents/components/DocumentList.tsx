import { FlatList, StyleSheet, useWindowDimensions } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";

import { colors, spacing } from "@/constants/designSystem";
import type { Document } from "@/schemas/document";
import { DocumentCard } from "./DocumentCard";
import { DocumentViewMode } from "./ViewToggle";

const PADDING_BETWEEN_ITEMS = spacing.lg;
const GRID_MODE_COLUMNS_COUNT = 2;
const CARD_ENTER_STAGGER_INTERVAL_MS = 25;
const CARD_ENTER_STAGGER_MAX_INDEX = 6;
const CARD_ENTER_DURATION_MS = 220;
const CARD_EXIT_DURATION_MS = 120;

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
      style={styles.list}
      contentContainerStyle={styles.content}
      renderItem={({ item, index }) => (
        // The FlatList remounts when view mode changes. Animate each card
        // into the new layout with a short stagger.
        <Animated.View
          entering={FadeInDown.delay(
            Math.min(index, CARD_ENTER_STAGGER_MAX_INDEX) *
              CARD_ENTER_STAGGER_INTERVAL_MS,
          ).duration(CARD_ENTER_DURATION_MS)}
          exiting={FadeOutUp.duration(CARD_EXIT_DURATION_MS)}
          // Resolves elevation issues on Android
          needsOffscreenAlphaCompositing
          renderToHardwareTextureAndroid
        >
          <DocumentCard
            document={item}
            compact={gridModeEnabled}
            style={cardStyle}
            onPress={onDocumentPress}
          />
        </Animated.View>
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
  list: {
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: spacing.sm,
    paddingHorizontal: PADDING_BETWEEN_ITEMS,
    paddingBottom: spacing.xxxl,
    backgroundColor: colors.background,
  },
});
