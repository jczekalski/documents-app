import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  colors,
  fontWeights,
  iconSize,
  radius,
  spacing,
  typography,
} from "../designSystem";

interface AddDocumentButtonProps {
  onPress: () => void;
}

export function AddDocumentButton({ onPress }: AddDocumentButtonProps) {
  const insets = useSafeAreaInsets();

  // Add additional padding when no gap between button and bottom of screen
  const containerPaddingBottom = insets.bottom === 0 ? spacing.lg : 0;

  return (
    <View style={[styles.container, { paddingBottom: containerPaddingBottom }]}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <MaterialCommunityIcons
          name="plus"
          size={iconSize.md}
          color={colors.textOnPrimary}
        />
        <Text style={styles.text}>Add document</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  button: {
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  pressed: {
    backgroundColor: colors.primaryPressed,
  },
  text: {
    color: colors.textOnPrimary,
    fontSize: typography.md.fontSize,
    lineHeight: typography.md.lineHeight,
    fontWeight: fontWeights.medium,
  },
});
