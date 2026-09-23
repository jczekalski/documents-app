import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import { colors, iconSize, radius } from "@/constants/designSystem";

export type DocumentViewMode = "list" | "grid";

interface ViewToggleProps {
  value: DocumentViewMode;
  onChange: (value: DocumentViewMode) => void;
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <View style={styles.container}>
      <ToggleButton
        mode="list"
        active={value === "list"}
        onPress={() => onChange("list")}
        icon="format-list-bulleted"
      />

      <ToggleButton
        mode="grid"
        active={value === "grid"}
        onPress={() => onChange("grid")}
        icon="view-grid-outline"
      />
    </View>
  );
}

interface ToggleButtonProps {
  mode: DocumentViewMode;
  active: boolean;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
}

function ToggleButton({ active, icon, onPress }: ToggleButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, active && styles.activeButton]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={iconSize.sm}
        color={active ? colors.primary : colors.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    flexDirection: "row",
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  button: {
    width: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  activeButton: {
    backgroundColor: colors.surface,
  },
});
