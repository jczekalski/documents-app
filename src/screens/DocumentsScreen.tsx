import axios from "axios";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { colors } from "../designSystem";

import { normalizeKeys } from "@/utils";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddDocumentButton } from "../components/AddDocumentButton";
import { DocumentList } from "../components/DocumentList";
import { DocumentToolbar } from "../components/DocumentToolbar";
import { Header } from "../components/Header";
import { DocumentViewMode } from "../components/ViewToggle";
import { Document } from "../types/document";

export function DocumentsScreen() {
  const [viewMode, setViewMode] = useState<DocumentViewMode>("list");
  const [refreshing, setRefreshing] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);

  const notificationCount = 0;

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get(process.env.EXPO_PUBLIC_API_URL!);
      const normalizedData = normalizeKeys(response.data) as Document[];
      console.log(JSON.stringify(normalizedData, null, 2));
      setDocuments(normalizedData);
    } catch (e) {
      console.error("Server error.", e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onAddDocumentPress = () => {
    // TODO
  };

  const onRefresh = () => {
    fetchData();
  };

  // Issue: After creating default Expo project Android requires SafeAreaView, but iOS doesn't.
  const ScreenContainer = Platform.OS === "android" ? SafeAreaView : View;

  return (
    <ScreenContainer style={styles.screen}>
      <Header title="Documents" notificationCount={notificationCount} />
      <DocumentToolbar viewMode={viewMode} onViewModeChange={setViewMode} />
      <View style={styles.listContainer}>
        <DocumentList
          documents={documents}
          viewMode={viewMode}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </View>

      <AddDocumentButton onPress={onAddDocumentPress} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContainer: {
    flex: 1,
  },
});
