import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  colors,
  fontWeights,
  iconSize,
  radius,
  spacing,
  typography,
} from "@/constants/designSystem";

interface AttachmentFieldProps {
  file: DocumentPicker.DocumentPickerAsset | null;
  disabled: boolean;
  onPick: () => void;
  onRemove: () => void;
}

export function AttachmentField({
  file,
  disabled,
  onPick,
  onRemove,
}: AttachmentFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>File</Text>

      <Pressable
        accessibilityRole="button"
        onPress={onPick}
        disabled={disabled}
        style={({ pressed }) => [styles.fileButton, pressed && styles.pressed]}
      >
        <MaterialCommunityIcons
          name="file-document-outline"
          size={iconSize.md}
          color={colors.primary}
        />
        <Text style={styles.fileButtonText}>Choose CSV file</Text>
      </Pressable>

      {__DEV__ && !file && (
        <Text style={styles.fileHint}>
          Sample attachments from the bundled CSV will be used.
        </Text>
      )}

      {file && (
        <View style={styles.selectedFile}>
          <MaterialCommunityIcons
            name="file-check-outline"
            size={20}
            color={colors.success}
          />
          <Text numberOfLines={1} style={styles.selectedFileText}>
            {file.name}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Remove selected file"
            onPress={onRemove}
            disabled={disabled}
            hitSlop={8}
          >
            <MaterialCommunityIcons
              name="close"
              size={18}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: spacing.xl,
  },
  label: {
    marginBottom: spacing.sm,
    color: colors.textPrimary,
    fontSize: typography.md.fontSize,
    lineHeight: typography.md.lineHeight,
    fontWeight: fontWeights.semibold,
  },
  pressed: {
    opacity: 0.6,
  },
  fileButton: {
    height: 56,
    alignSelf: "flex-start",
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  fileButtonText: {
    color: colors.primary,
    fontSize: typography.md.fontSize,
    lineHeight: typography.md.lineHeight,
    fontWeight: fontWeights.medium,
  },
  fileHint: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontSize: typography.sm.fontSize,
    lineHeight: typography.sm.lineHeight,
  },
  selectedFile: {
    marginTop: spacing.md,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
  },
  selectedFileText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: typography.sm.fontSize,
    lineHeight: typography.sm.lineHeight,
  },
});
