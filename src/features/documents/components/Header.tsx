import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  colors,
  fontWeights,
  iconSize,
  radius,
  spacing,
  typography,
} from "@/constants/designSystem";

interface HeaderProps {
  title: string;
  notificationCount?: number;
  onNotificationsPress?: () => void;
}

export function Header({
  title,
  notificationCount = 0,
  onNotificationsPress,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Notifications"
        onPress={onNotificationsPress}
        style={({ pressed }) => [
          styles.notificationButton,
          pressed && styles.pressed,
        ]}
      >
        <MaterialCommunityIcons
          name="bell-outline"
          size={iconSize.sm}
          color={colors.textSecondary}
        />

        {notificationCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {notificationCount > 9 ? "9+" : notificationCount}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,

    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },

  title: {
    color: colors.textPrimary,
    fontSize: typography.xxl.fontSize,
    lineHeight: typography.xxl.lineHeight,
    fontWeight: fontWeights.bold,
  },

  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  pressed: {
    backgroundColor: colors.surfaceAlt,
  },

  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: colors.textOnPrimary,
    fontSize: 8,
    fontWeight: fontWeights.bold,
  },
});
