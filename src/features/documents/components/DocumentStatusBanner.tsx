import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  colors,
  fontWeights,
  spacing,
  typography,
} from "@/constants/designSystem";
import type { NotificationConnectionStatus } from "@/services/notifications";

interface DocumentStatusBannerProps {
  hasSavedDocuments: boolean;
  loading: boolean;
  error: Error | null;
  notificationStatus: NotificationConnectionStatus;
  onRetry: () => void;
}

export function DocumentStatusBanner({
  hasSavedDocuments,
  loading,
  error,
  notificationStatus,
  onRetry,
}: DocumentStatusBannerProps) {
  if (!error && notificationStatus === "connected") {
    return null;
  }

  const message = error
    ? hasSavedDocuments
      ? "Can't reach the server. Showing saved documents."
      : "Can't load documents. Check your connection and retry."
    : notificationStatus === "connecting"
      ? "Connecting to notifications…"
      : "Notifications reconnecting…";

  return (
    <View accessibilityLiveRegion="polite" style={styles.banner}>
      <Text style={styles.message}>{message}</Text>
      {error && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retry loading documents"
          disabled={loading}
          onPress={onRetry}
          style={({ pressed }) => [
            styles.retryButton,
            loading && styles.retryDisabled,
            pressed && !loading && styles.retryPressed,
          ]}
        >
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF7E6",
  },
  message: {
    flex: 1,
    color: "#7A4B00",
    fontSize: typography.sm.fontSize,
    lineHeight: typography.sm.lineHeight,
  },
  retryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  retryDisabled: {
    opacity: 0.5,
  },
  retryPressed: {
    opacity: 0.7,
  },
  retryText: {
    color: colors.primary,
    fontSize: typography.sm.fontSize,
    fontWeight: fontWeights.semibold,
  },
});
