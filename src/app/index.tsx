import axios from "axios";
import { useEffect, useState } from "react";

import { DocumentsScreen } from "@/screens/DocumentsScreen";
import { Document } from "@/types/document";
import { normalizeKeys } from "@/utils";

import { requireOptionalNativeModule } from "expo";

const DevMenuPreferences = requireOptionalNativeModule("DevMenuPreferences");
DevMenuPreferences?.setPreferencesAsync({ showFloatingActionButton: false });

export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL!,
  wsUrl: process.env.EXPO_PUBLIC_WS_URL!,
};

export default function HomeScreen() {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    axios.get(config.apiUrl).then((r) => {
      const normalizedData = normalizeKeys(r.data) as Document[];
      console.log(JSON.stringify(normalizedData, null, 2));
      setDocuments(normalizedData);
    });
  }, []);

  useEffect(() => {
    // const disconnect = connectNotifications((notification) => {
    //   console.log(
    //     `${notification.UserName} created ${notification.DocumentTitle}`,
    //   );
    // });
    // return disconnect;
  }, []);

  return <DocumentsScreen documents={documents} onAddDocument={() => {}} />;
}
