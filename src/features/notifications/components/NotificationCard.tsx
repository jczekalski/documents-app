import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/base";
import {
  colors,
  fontWeights,
  iconSize,
  radius,
  spacing,
  typography,
} from "@/constants/designSystem";
import type { Notification } from "@/schemas/notification";

const NOTIFICATION_CARD_MIN_HEIGHT = 88;
const NOTIFICATION_ICON_SIZE = 40;

function relativeTime(timestamp: string): string {
  const date = new Date(timestamp);

  return Number.isNaN(date.getTime())
    ? ""
    : formatDistanceToNow(date, { addSuffix: true });
}

export const NotificationCard = memo(function NotificationCard({
  notification,
}: {
  notification: Notification;
}) {
  return (
    <Card style={styles.card}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="file-document-outline"
          size={iconSize.md}
          color={colors.primary}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {notification.documentTitle}
        </Text>
        <Text style={styles.message} numberOfLines={2}>
          {notification.userName} created this document.
        </Text>
        <Text style={styles.timestamp}>
          {relativeTime(notification.timestamp)}
        </Text>
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    minHeight: NOTIFICATION_CARD_MIN_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconContainer: {
    width: NOTIFICATION_ICON_SIZE,
    height: NOTIFICATION_ICON_SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.md.fontSize,
    lineHeight: typography.md.lineHeight,
    fontWeight: fontWeights.semibold,
  },
  message: {
    color: colors.textSecondary,
    fontSize: typography.sm.fontSize,
    lineHeight: typography.sm.lineHeight,
  },
  timestamp: {
    color: colors.textSecondary,
    fontSize: typography.xs.fontSize,
    lineHeight: typography.xs.lineHeight,
  },
});
