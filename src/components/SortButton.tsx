import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  colors,
  fontWeights,
  iconSize,
  radius,
  spacing,
  typography,
} from "../designSystem";

const ICON_SIZE = iconSize.sm;

interface SortButtonProps {
  label?: string;
  onPress?: () => void;
}

export function SortButton({ label = "Sort by", onPress }: SortButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.content}>
        <MaterialCommunityIcons
          name="swap-vertical"
          size={ICON_SIZE}
          color={colors.textSecondary}
        />
        <Text style={styles.label}>{label}</Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={ICON_SIZE}
          color={colors.textSecondary}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  label: {
    color: colors.textPrimary,
    fontSize: typography.sm.fontSize,
    lineHeight: typography.sm.lineHeight,
    fontWeight: fontWeights.medium,
  },
  pressed: {
    backgroundColor: colors.surfaceAlt,
  },
});
