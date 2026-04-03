import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: 20,
    height: 48,
  },
  left: {
    width: 40,
    alignItems: "center",
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: "rgba(133, 173, 255, 0.3)",
  },
  right: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 12,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#202020",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: "#adaaaa",
    fontWeight: "500",
  },
});
