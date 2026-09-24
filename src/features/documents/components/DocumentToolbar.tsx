import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { colors, spacing } from "@/constants/designSystem";
import { SortButton } from "./SortButton";
import {
  DOCUMENT_SORT_OPTIONS,
  type DocumentSortOption,
  SortOptionsModal,
} from "./SortOptionsModal";
import { DocumentViewMode, ViewToggle } from "./ViewToggle";

interface DocumentToolbarProps {
  viewMode: DocumentViewMode;
  sortOption: DocumentSortOption;
  onViewModeChange: (mode: DocumentViewMode) => void;
  onSortOptionChange: (option: DocumentSortOption) => void;
}

export function DocumentToolbar({
  viewMode,
  onViewModeChange,
  sortOption,
  onSortOptionChange,
}: DocumentToolbarProps) {
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const sortLabel =
    DOCUMENT_SORT_OPTIONS.find((option) => option.value === sortOption)
      ?.label ?? "Sort by";

  return (
    <View style={styles.container}>
      <SortButton label={sortLabel} onPress={() => setSortModalVisible(true)} />
      <ViewToggle value={viewMode} onChange={onViewModeChange} />
      <SortOptionsModal
        visible={sortModalVisible}
        selectedOption={sortOption}
        onSelect={(option) => {
          onSortOptionChange(option);
          setSortModalVisible(false);
        }}
        onClose={() => setSortModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background,
  },
});
