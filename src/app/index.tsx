import { useEffect } from "react";

import { DocumentsScreen } from "@/screens/DocumentsScreen";
import { connectNotifications } from "@/services/notifications";

export default function HomeScreen() {
  useEffect(() => {
    const disconnect = connectNotifications((notification) => {
      console.log(
        `${notification.userId} created ${notification.documentTitle}`,
      );
    });
    return disconnect;
  }, []);

  return <DocumentsScreen />;
}
