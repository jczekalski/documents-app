import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import {
  colors,
  fontWeights,
  iconSize,
  radius,
  shadows,
  spacing,
  typography,
} from "../designSystem";

import { Document } from "../types/document";

interface DocumentCardProps {
  document: Document;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: (document: Document) => void;
}

export function DocumentCard({
  document,
  compact = false,
  style,
  onPress,
}: DocumentCardProps) {
  const titleRowFlexDirection = compact ? "column" : "row";

  return (
    <Pressable onPress={() => onPress?.(document)} style={[styles.card, style]}>
      <View style={[styles.titleRow, { flexDirection: titleRowFlexDirection }]}>
        <Text numberOfLines={1} style={styles.title}>
          {document.title}
        </Text>
        <Text style={styles.version}>Version {document.version}</Text>
      </View>
      {!compact && (
        <View style={styles.columns}>
          <DocumentSection
            icon="account-group-outline"
            title="Contributors"
            items={document.contributors.map((contributor) => contributor.name)}
          />
          <DocumentSection
            icon="link-variant"
            title="Attachments"
            items={document.attachments}
          />
        </View>
      )}
    </Pressable>
  );
}

interface DocumentSectionProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  items: string[];
}

function DocumentSection({ icon, title, items }: DocumentSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons
          name={icon}
          size={iconSize.md}
          color={colors.textSecondary}
        />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.items}>
        {items.map((item, index) => (
          <Text key={`${item}-${index}`} numberOfLines={1} style={styles.item}>
            {item}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: spacing.sm,
  },
  title: {
    flexShrink: 1,
    color: colors.textPrimary,
    fontSize: typography.md.fontSize,
    lineHeight: typography.md.lineHeight,
    fontWeight: fontWeights.semibold,
    marginRight: spacing.md,
  },
  version: {
    color: colors.textSecondary,
    fontSize: typography.xs.fontSize,
    lineHeight: typography.xs.lineHeight,
    fontWeight: fontWeights.regular,
  },
  columns: {
    flexDirection: "row",
    gap: spacing.xl,
  },
  section: {
    flex: 1,
    minWidth: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    marginLeft: spacing.sm,
    color: colors.textPrimary,
    fontSize: typography.xs.fontSize,
    lineHeight: typography.xs.lineHeight,
    fontWeight: fontWeights.semibold,
  },
  items: {
    gap: spacing.sm,
  },
  item: {
    color: colors.textSecondary,
    fontSize: typography.xs.fontSize,
    lineHeight: typography.xs.lineHeight,
    fontWeight: fontWeights.regular,
  },
});
