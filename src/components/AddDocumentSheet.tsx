import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import * as Crypto from "expo-crypto";
import * as DocumentPicker from "expo-document-picker";
import { forwardRef, useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Document } from "@/types/document";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  colors,
  fontWeights,
  iconSize,
  radius,
  spacing,
  typography,
} from "../designSystem";
import { BottomButton } from "./BottomButton";

export interface NewDocumentData {
  title: string;
  version: string;
  file: DocumentPicker.DocumentPickerAsset | null;
}

interface AddDocumentSheetProps {
  onSubmit: (data: Document) => Promise<void> | void;
}

export const AddDocumentSheet = forwardRef<
  BottomSheetModal,
  AddDocumentSheetProps
>(function AddDocumentSheet({ onSubmit }, ref) {
  const snapPoints = useMemo(() => ["78%"], []);
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState("");
  const [version, setVersion] = useState("");
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(
    null,
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasRequiredFields = title !== "" && version !== "";
  const bottomSpacer = insets.bottom || spacing.lg;

  const resetForm = useCallback(() => {
    setTitle("");
    setVersion("");
    setFile(null);
    setError(null);
    setSubmitting(false);
  }, []);

  const handleClose = useCallback(() => {
    if (submitting) {
      return;
    }

    (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
  }, [ref, submitting]);

  const handlePickFile = useCallback(async () => {
    setError(null);

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled) {
        setFile(result.assets[0]);
      }
    } catch {
      setError("Unable to select the file.");
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!title.trim()) {
      setError("Please enter a document name.");
      return;
    }

    if (!version.trim()) {
      setError("Please enter a version.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const now = new Date().toISOString();

    const newDocument: Document = {
      id: Crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      title,
      version,
      // TODO: convert file to attachements
      attachments: [],
      contributors: [
        {
          id: "current-user",
          name: "You",
        },
      ],
    };

    try {
      await onSubmit(newDocument);

      resetForm();

      (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
    } catch {
      setError("Unable to create the document.");
    } finally {
      setSubmitting(false);
    }
  }, [title, version, file, onSubmit, resetForm, ref]);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose={!submitting}
      enableDynamicSizing={false}
      handleComponent={null}
      backgroundStyle={styles.background}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.35}
        />
      )}
      onDismiss={resetForm}
    >
      <View style={[styles.container, { paddingBottom: bottomSpacer }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Add document</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            disabled={submitting}
            onPress={handleClose}
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.pressed,
            ]}
          >
            <MaterialCommunityIcons
              name="close"
              size={30}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>

        <BottomSheetScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Document informations</Text>

          <FormField label="Name">
            <BottomSheetTextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Super Stout"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              returnKeyType="next"
              editable={!submitting}
            />
          </FormField>

          <FormField label="Version">
            <BottomSheetTextInput
              value={version}
              onChangeText={setVersion}
              placeholder="Version 1.3.0"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              returnKeyType="done"
              editable={!submitting}
            />
          </FormField>

          <View style={styles.field}>
            <Text style={styles.label}>File</Text>

            <Pressable
              onPress={handlePickFile}
              disabled={submitting}
              style={({ pressed }) => [
                styles.fileButton,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name="file-document-outline"
                size={iconSize.md}
                color={colors.primary}
              />

              <Text style={styles.fileButtonText}>Choose file</Text>
            </Pressable>

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
                  onPress={() => setFile(null)}
                  disabled={submitting}
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

          {error && <Text style={styles.error}>{error}</Text>}
        </BottomSheetScrollView>

        <BottomButton
          label="Submit"
          onPress={handleSubmit}
          loading={submitting}
          disabled={!hasRequiredFields}
        />
      </View>
    </BottomSheetModal>
  );
});

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
  background: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  container: {
    flex: 1,
  },
  header: {
    minHeight: 88,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.xxl.fontSize,
    lineHeight: typography.xxl.lineHeight,
    fontWeight: fontWeights.bold,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.6,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.xl,
    color: colors.textPrimary,
    fontSize: typography.xl.fontSize,
    lineHeight: typography.xl.lineHeight,
    fontWeight: fontWeights.semibold,
  },
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
    fontSize: typography.lg.fontSize,
    lineHeight: typography.lg.lineHeight,
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
    fontSize: typography.lg.fontSize,
    lineHeight: typography.lg.lineHeight,
    fontWeight: fontWeights.medium,
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
  error: {
    marginBottom: spacing.md,
    color: colors.error,
    fontSize: typography.sm.fontSize,
    lineHeight: typography.sm.lineHeight,
    fontWeight: fontWeights.medium,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  submitButton: {
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  submitPressed: {
    backgroundColor: colors.primaryPressed,
  },
  submitDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: colors.textOnPrimary,
    fontSize: typography.xl.fontSize,
    lineHeight: typography.xl.lineHeight,
    fontWeight: fontWeights.semibold,
  },
});
