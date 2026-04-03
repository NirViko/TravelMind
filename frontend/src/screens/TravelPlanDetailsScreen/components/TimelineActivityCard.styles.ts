import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  left: {
    width: 40,
    alignItems: "center",
  },
  time: {
    fontSize: 10,
    fontWeight: "700",
    color: "#85adff",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  dotWrap: {
    alignItems: "center",
    flex: 1,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#85adff",
    borderWidth: 2,
    borderColor: "#0e0e0e",
  },
  lineSeg: {
    flex: 1,
    width: 2,
    backgroundColor: "rgba(133, 173, 255, 0.3)",
    marginTop: 2,
  },
  right: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 4,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 0,
  },
  image: {
    width: 110,
    height: 100,
  },
  imagePlaceholder: {
    backgroundColor: "#262626",
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: "#adaaaa",
    lineHeight: 17,
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  chip: {
    backgroundColor: "#262626",
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  chipText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#85adff",
    letterSpacing: 0.5,
  },
  meta: {
    fontSize: 12,
    color: "#adaaaa",
    fontWeight: "500",
  },
});
