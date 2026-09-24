import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { StyleSheet, Text, View } from "react-native";

import {
  colors,
  fontWeights,
  radius,
  spacing,
  typography,
} from "@/constants/designSystem";
import { isValidDocumentVersion } from "@/utils/documentVersion";

interface DocumentInfoFieldsProps {
  title: string;
  version: string;
  disabled: boolean;
  onTitleChange: (title: string) => void;
  onVersionChange: (version: string) => void;
}

export function DocumentInfoFields({
  title,
  version,
  disabled,
  onTitleChange,
  onVersionChange,
}: DocumentInfoFieldsProps) {
  const hasInvalidVersion =
    version.trim() !== "" && !isValidDocumentVersion(version);

  return (
    <>
      <FormField label="Name">
        <BottomSheetTextInput
          testID="document-title-input"
          value={title}
          onChangeText={onTitleChange}
          placeholder="Super Stout"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          returnKeyType="next"
          editable={!disabled}
        />
      </FormField>

      <FormField label="Version">
        <BottomSheetTextInput
          testID="document-version-input"
          value={version}
          onChangeText={onVersionChange}
          placeholder="1.3.0"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          keyboardType="decimal-pad"
          returnKeyType="done"
          editable={!disabled}
        />
        <Text
          style={[
            styles.validationMessage,
            !hasInvalidVersion && styles.validationHint,
          ]}
        >
          {hasInvalidVersion
            ? "Enter a version number, e.g. 1.2.0."
            : "Use a version like 1.2.0."}
        </Text>
      </FormField>
    </>
  );
}

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

function FormField({ label, children }: FormFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
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
  input: {
    height: 64,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    color: colors.textPrimary,
    fontSize: typography.md.fontSize,
    lineHeight: typography.md.lineHeight,
  },
  validationMessage: {
    marginTop: spacing.xs,
    color: colors.error,
    fontSize: typography.xs.fontSize,
    lineHeight: typography.xs.lineHeight,
  },
  validationHint: {
    color: colors.textMuted,
  },
});
