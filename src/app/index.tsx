import { DocumentsScreen } from "@/screens/DocumentsScreen";

export default function HomeScreen() {
  // useEffect(() => {
  //   const disconnect = connectNotifications((notification) => {
  //     console.log(
  //       `${notification.userId} created ${notification.documentTitle}`,
  //     );
  //   });
  //   return disconnect;
  // }, []);

  return <DocumentsScreen />;
}
