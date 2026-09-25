import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors, radius, shadows, spacing } from "@/constants/designSystem";

interface CardProps {
  children: ReactNode;
  withShadow?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, withShadow = false, style }: CardProps) {
  return (
    <View style={[styles.card, withShadow && styles.shadow, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  shadow: shadows.card,
});
