import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e0e0e",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.2,
  },
  saveButton: {
    backgroundColor: "#85adff",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  saveButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#002c65",
    letterSpacing: 0.3,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#767575",
    letterSpacing: 1.2,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    gap: 10,
  },
  rowActive: {
    backgroundColor: "#20201f",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 10,
  },
  dragHandle: {
    opacity: 0.7,
  },
  thumbnail: {
    width: 52,
    height: 52,
    borderRadius: 10,
  },
  thumbnailPlaceholder: {
    backgroundColor: "#262626",
  },
  info: {
    flex: 1,
    gap: 4,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  activityMeta: {
    fontSize: 12,
    color: "#adaaaa",
  },
  suggestionCard: {
    backgroundColor: "#20201f",
    borderRadius: 20,
    padding: 16,
    marginTop: 8,
  },
  suggestionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  suggestionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fab0ff",
    letterSpacing: 1.2,
  },
  suggestionBody: {
    flexDirection: "row",
    gap: 12,
  },
  suggestionTextBlock: {
    flex: 1,
    gap: 6,
  },
  suggestionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
    lineHeight: 22,
  },
  suggestionDesc: {
    fontSize: 12,
    color: "#adaaaa",
    lineHeight: 18,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#85adff",
    borderRadius: 9999,
    paddingHorizontal: 14,
    paddingVertical: 7,
    gap: 4,
    marginTop: 4,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#002c65",
  },
  suggestionImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#262626",
    alignItems: "center",
    justifyContent: "center",
  },
});
