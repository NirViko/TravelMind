import { StyleSheet } from "react-native";

export const transportStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedCard: {
    borderColor: "#4A90E2",
    shadowColor: "#4A90E2",
    shadowOpacity: 0.2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: "#666666",
  },
  infoSection: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 32,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A90E2",
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 22,
  },
  routeCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  routeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  routeInfo: {
    fontSize: 14,
    color: "#666666",
    fontStyle: "italic",
  },
  routeError: {
    fontSize: 14,
    color: "#FF6B6B",
  },
  routeDetails: {
    flexDirection: "row",
    gap: 24,
    marginTop: 8,
  },
  fastestMethodContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    gap: 6,
  },
  fastestMethodText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A90E2",
  },
  routeDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  routeDetailText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A90E2",
  },
  loadingContainer: {
    paddingVertical: 8,
  },
  errorContainer: {
    paddingVertical: 8,
  },
  routeErrorHint: {
    fontSize: 12,
    color: "#999999",
    marginTop: 4,
    fontStyle: "italic",
  },
  transitHint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 12,
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    gap: 8,
  },
  transitHintText: {
    fontSize: 12,
    color: "#666666",
    flex: 1,
    lineHeight: 18,
  },
});

