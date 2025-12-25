import { StyleSheet } from "react-native";

export const tabStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 16,
    padding: 4,
    minHeight: 50,
  },
  containerExpanded: {
    padding: 6,
    minHeight: 50,
  },
  containerMinimized: {
    padding: 4,
    minHeight: 40,
    marginTop: 8,
    marginBottom: 0,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  tabExpanded: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tabMinimized: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  activeTab: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

