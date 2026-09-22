import { useEffect } from "react";

import { DocumentsScreen } from "@/screens/DocumentsScreen";

export default function HomeScreen() {
  useEffect(() => {
    // const disconnect = connectNotifications((notification) => {
    //   console.log(
    //     `${notification.UserName} created ${notification.DocumentTitle}`,
    //   );
    // });
    // return disconnect;
  }, []);

  return <DocumentsScreen />;
}
