import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import {
  colors,
  fontWeights,
  iconSize,
  radius,
  spacing,
  typography,
} from "@/constants/designSystem";

export type DocumentSortOption = "dateNewest" | "dateOldest" | "title";

export const DOCUMENT_SORT_OPTIONS: {
  value: DocumentSortOption;
  label: string;
}[] = [
  { value: "dateNewest", label: "Date - newest" },
  { value: "dateOldest", label: "Date - oldest" },
  { value: "title", label: "Title" },
];

interface SortOptionsModalProps {
  visible: boolean;
  selectedOption: DocumentSortOption;
  onSelect: (option: DocumentSortOption) => void;
  onClose: () => void;
}

export function SortOptionsModal({
  visible,
  selectedOption,
  onSelect,
  onClose,
}: SortOptionsModalProps) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close sort options"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <View accessibilityRole="radiogroup" style={styles.dialog}>
          <Text style={styles.title}>Sort by</Text>
          {DOCUMENT_SORT_OPTIONS.map((option) => {
            const selected = option.value === selectedOption;

            return (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                onPress={() => onSelect(option.value)}
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.optionLabel}>{option.label}</Text>
                <MaterialCommunityIcons
                  name={selected ? "radiobox-marked" : "radiobox-blank"}
                  size={iconSize.lg}
                  color={selected ? colors.primary : colors.textSecondary}
                />
              </Pressable>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.xl,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  dialog: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
  },
  title: {
    marginBottom: spacing.md,
    color: colors.textPrimary,
    fontSize: typography.lg.fontSize,
    lineHeight: typography.lg.lineHeight,
    fontWeight: fontWeights.semibold,
  },
  option: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  optionLabel: {
    color: colors.textPrimary,
    fontSize: typography.md.fontSize,
    lineHeight: typography.md.lineHeight,
  },
  pressed: {
    backgroundColor: colors.surfaceAlt,
  },
});
