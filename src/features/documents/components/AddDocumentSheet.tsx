import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Asset } from "expo-asset";
import * as Crypto from "expo-crypto";
import * as DocumentPicker from "expo-document-picker";
import { forwardRef, useCallback, useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomButton } from "@/components/base";
import {
  colors,
  fontWeights,
  radius,
  spacing,
  typography,
} from "@/constants/designSystem";
import { AttachmentField } from "@/features/documents/components/AttachmentField";
import { DocumentInfoFields } from "@/features/documents/components/DocumentInfoFields";
import type { Document } from "@/schemas/document";
import {
  formatDocumentVersion,
  isValidDocumentVersion,
} from "@/utils/documentVersion";
import { readAttachmentCsv } from "@/utils/attachmentsCsv";

import attachmentsCsv from "../../../../assets/attachements-data.csv";

async function readDevelopmentAttachmentCsv(): Promise<string[]> {
  const asset = Asset.fromModule(attachmentsCsv);
  await asset.downloadAsync();

  if (!asset.localUri) {
    throw new Error("Unable to load the sample attachments CSV.");
  }

  return readAttachmentCsv(asset.localUri);
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

  const hasRequiredFields =
    title.trim() !== "" &&
    isValidDocumentVersion(version) &&
    (file !== null || __DEV__);

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
        type: "text/csv",
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

    if (!isValidDocumentVersion(version)) {
      setError("Please enter a valid version number like 1.2.0.");
      return;
    }

    if (!file && !__DEV__) {
      setError("Please select a CSV file.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      // Use the bundled CSV as development sample data when no file is selected.
      const attachments = file
        ? await readAttachmentCsv(file.uri)
        : await readDevelopmentAttachmentCsv();
      const now = new Date().toISOString();

      const newDocument: Document = {
        id: Crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        title: title.trim(),
        version: formatDocumentVersion(version),
        attachments,
        contributors: [
          {
            id: "current-user",
            name: "You",
          },
        ],
      };

      await onSubmit(newDocument);

      resetForm();
      (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
    } catch {
      setError("Unable to create the document.");
    } finally {
      setSubmitting(false);
    }
  }, [file, onSubmit, ref, resetForm, title, version]);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose={!submitting}
      enableDynamicSizing={false}
      handleComponent={null}
      backgroundStyle={styles.background}
      keyboardBehavior={Platform.OS === "ios" ? "extend" : "interactive"}
      keyboardBlurBehavior={Platform.OS === "ios" ? "none" : "restore"}
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
          <Text style={styles.sectionTitle}>Document information</Text>

          <DocumentInfoFields
            title={title}
            version={version}
            disabled={submitting}
            onTitleChange={setTitle}
            onVersionChange={setVersion}
          />

          <AttachmentField
            file={file}
            disabled={submitting}
            onPick={handlePickFile}
            onRemove={() => setFile(null)}
          />

          {error && <Text style={styles.error}>{error}</Text>}
        </BottomSheetScrollView>

        <BottomButton
          testID="submit-document-button"
          label="Submit"
          onPress={handleSubmit}
          loading={submitting}
          disabled={!hasRequiredFields}
        />
      </View>
    </BottomSheetModal>
  );
});
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
  error: {
    marginBottom: spacing.md,
    color: colors.error,
    fontSize: typography.sm.fontSize,
    lineHeight: typography.sm.lineHeight,
    fontWeight: fontWeights.medium,
  },
});
