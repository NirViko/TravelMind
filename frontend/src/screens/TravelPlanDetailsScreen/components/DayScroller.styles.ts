import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scroll: {
    backgroundColor: "#0e0e0e",
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  pill: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#262626",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  pillActive: {
    backgroundColor: "#85adff",
  },
  month: {
    fontSize: 9,
    fontWeight: "600",
    color: "#adaaaa",
    letterSpacing: 0.5,
    lineHeight: 11,
  },
  monthActive: {
    color: "#0e0e0e",
  },
  day: {
    fontSize: 18,
    fontWeight: "700",
    color: "#adaaaa",
    lineHeight: 22,
  },
  dayActive: {
    color: "#0e0e0e",
  },
});
