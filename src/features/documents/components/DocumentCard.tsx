import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import {
  Alert,
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
} from "@/constants/designSystem";
import type { Document } from "@/schemas/document";
import { formatDocumentVersion } from "@/utils/documentVersion";

function formatRelativeDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "unknown";
  }

  return formatDistanceToNow(date, { addSuffix: true });
}

const handleShare = async (document: Document) => {
  try {
    const file = new File(Paths.cache, `document-${document.id}.json`);
    file.create({ overwrite: true });
    file.write(JSON.stringify(document, null, 2));

    await Sharing.shareAsync(file.uri, {
      dialogTitle: document.title,
      mimeType: "application/json",
      UTI: "public.json",
    });
  } catch (e) {
    console.error(e);
    Alert.alert("Unable to share document", "Please try again.");
  }
};

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
    <View style={[styles.card, style]}>
      <Pressable onPress={() => onPress?.(document)}>
        <View
          style={[styles.titleRow, { flexDirection: titleRowFlexDirection }]}
        >
          <Text numberOfLines={1} style={styles.title}>
            {document.title}
          </Text>
          <Text style={styles.version}>
            {formatDocumentVersion(document.version)}
          </Text>
        </View>
        <View style={styles.dates}>
          <Text style={styles.dateText}>
            Created: {formatRelativeDate(document.createdAt)}
          </Text>
          <Text style={styles.dateText}>
            Updated: {formatRelativeDate(document.updatedAt)}
          </Text>
        </View>
        {!compact && (
          <View style={styles.columns}>
            <DocumentSection
              icon="account-group-outline"
              title="Contributors"
              items={document.contributors.map(
                (contributor) => contributor.name,
              )}
            />
            <DocumentSection
              icon="link-variant"
              title="Attachments"
              items={document.attachments}
            />
          </View>
        )}
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Share ${document.title}`}
        onPress={() => handleShare(document)}
        hitSlop={8}
        style={({ pressed }) => [
          styles.shareButton,
          pressed && styles.sharePressed,
        ]}
      >
        <MaterialCommunityIcons
          name="share-variant"
          size={iconSize.md}
          color={colors.primary}
        />
      </Pressable>
    </View>
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
    position: "relative",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  titleRow: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: spacing.sm,
    paddingRight: spacing.xxl,
  },
  dates: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  dateText: {
    color: colors.textSecondary,
    fontSize: typography.xs.fontSize,
    lineHeight: typography.xs.lineHeight,
  },
  shareButton: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  sharePressed: {
    backgroundColor: colors.surfaceAlt,
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
