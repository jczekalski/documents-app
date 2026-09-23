import { StyleSheet } from "react-native";

export const colors = {
  // Brand
  primary: "#4873EB",
  primaryPressed: "#2563EB",
  primaryLight: "#EFF6FF",

  // Neutrals
  background: "#F5F6F8",
  surface: "#FFFFFF",
  surfaceAlt: "#F8F9FB",

  border: "#D9DDE5",
  borderLight: "#E7E9EE",

  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  textOnPrimary: "#FFFFFF",

  // Semantic
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
} as const;

export const typography = {
  xs: {
    fontSize: 12,
    lineHeight: 16,
  },
  sm: {
    fontSize: 14,
    lineHeight: 20,
  },
  md: {
    fontSize: 16,
    lineHeight: 24,
  },
  lg: {
    fontSize: 18,
    lineHeight: 24,
  },
  xl: {
    fontSize: 20,
    lineHeight: 28,
  },
  xxl: {
    fontSize: 24,
    lineHeight: 32,
  },
} as const;

export const fontWeights = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export const shadows = {
  card: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
} as const;

export const iconSize = {
  sm: 18,
  md: 20,
  lg: 24,
} as const;

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
  },

  horizontalPadding: {
    paddingHorizontal: spacing.lg,
  },
});
