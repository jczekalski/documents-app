import { StyleSheet, View } from "react-native";

import { spacing } from "../designSystem";
import { SortButton } from "./SortButton";
import { DocumentViewMode, ViewToggle } from "./ViewToggle";

interface DocumentToolbarProps {
  viewMode: DocumentViewMode;
  onViewModeChange: (mode: DocumentViewMode) => void;
  onSortPress?: () => void;
}

export function DocumentToolbar({
  viewMode,
  onViewModeChange,
  onSortPress,
}: DocumentToolbarProps) {
  return (
    <View style={styles.container}>
      <SortButton onPress={onSortPress} />
      <ViewToggle value={viewMode} onChange={onViewModeChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
