import axios from "axios";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { connectNotifications } from "@/notifications";

export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL!,
  wsUrl: process.env.EXPO_PUBLIC_WS_URL!,
};

export default function HomeScreen() {
  useEffect(() => {
    axios
      .get(config.apiUrl)
      .then((r) => console.log(JSON.stringify(r.data.length, null, 2)));
  }, []);

  useEffect(() => {
    const disconnect = connectNotifications((notification) => {
      console.log(
        `${notification.UserName} created ${notification.DocumentTitle}`,
      );
    });

    return disconnect;
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.heroSection}>
          <Text>Hello</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: "center",
  },
  code: {
    textTransform: "uppercase",
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
