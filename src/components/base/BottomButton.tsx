import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, spacing } from "@/constants/designSystem";
import { Button, ButtonProps } from "./Button";

export function BottomButton(props: ButtonProps) {
  const insets = useSafeAreaInsets();

  // Add additional padding when no gap between button and bottom of screen
  const containerPaddingBottom = insets.bottom === 0 ? spacing.lg : 0;

  return (
    <View style={[styles.container, { paddingBottom: containerPaddingBottom }]}>
      <Button {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
