import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  colors,
  fontWeights,
  iconSize,
  radius,
  spacing,
  typography,
} from "@/constants/designSystem";
import type { Notification } from "@/schemas/notification";
import {
  MAX_NOTIFICATIONS,
  useNotifications,
} from "@/stores/notificationsStore";
import { NotificationCard } from "./components/NotificationCard";

const SCREEN_HEADER_MIN_HEIGHT = 56;
const HEADER_BUTTON_SIZE = 40;
const EMPTY_STATE_ICON_SIZE = 32;
const LIST_INITIAL_RENDER_COUNT = 10;
const LIST_MAX_RENDER_PER_BATCH = 10;
const LIST_WINDOW_SIZE = 7;

const keyExtractor = (item: Notification, index: number) =>
  `${item.timestamp}-${item.documentId}-${index}`;

export function NotificationsScreen() {
  const { notifications } = useNotifications();
  const renderItem = useCallback(
    ({ item }: { item: Notification }) => (
      <NotificationCard notification={item} />
    ),
    [],
  );

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to documents"
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/");
            }
          }}
          hitSlop={8}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={iconSize.md}
            color={colors.textPrimary}
          />
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        style={styles.list}
        data={notifications}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          notifications.length === 0 && styles.emptyListContent,
        ]}
        ListHeaderComponent={ListNote}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={EmptyState}
        initialNumToRender={LIST_INITIAL_RENDER_COUNT}
        maxToRenderPerBatch={LIST_MAX_RENDER_PER_BATCH}
        windowSize={LIST_WINDOW_SIZE}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function ListNote() {
  return (
    <Text style={styles.listNote}>
      Testing view: notifications update live. If the server is unavailable at
      launch, up to {MAX_NOTIFICATIONS} last saved notifications appear. New
      events are added after reconnect.
    </Text>
  );
}

function ItemSeparator() {
  return <View style={styles.separator} />;
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons
        name="bell-outline"
        size={EMPTY_STATE_ICON_SIZE}
        color={colors.textSecondary}
      />
      <Text style={styles.emptyTitle}>No notifications yet</Text>
      <Text style={styles.emptyMessage}>
        Updates about new documents will appear here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  list: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    minHeight: SCREEN_HEADER_MIN_HEIGHT,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    width: HEADER_BUTTON_SIZE,
    height: HEADER_BUTTON_SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
  },
  pressed: {
    backgroundColor: colors.surfaceAlt,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.lg.fontSize,
    lineHeight: typography.lg.lineHeight,
    fontWeight: fontWeights.semibold,
  },
  headerSpacer: {
    width: HEADER_BUTTON_SIZE,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  listNote: {
    marginBottom: spacing.md,
    color: colors.textSecondary,
    fontSize: typography.xs.fontSize,
    lineHeight: typography.xs.lineHeight,
  },
  separator: {
    height: spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    marginTop: spacing.md,
    color: colors.textPrimary,
    fontSize: typography.md.fontSize,
    lineHeight: typography.md.lineHeight,
    fontWeight: fontWeights.semibold,
  },
  emptyMessage: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: typography.sm.fontSize,
    lineHeight: typography.sm.lineHeight,
    textAlign: "center",
  },
});
