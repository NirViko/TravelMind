import { StyleSheet } from "react-native";

export const detailCardStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  card: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 250,
  },
  placeholderImage: {
    backgroundColor: "#3A3A3A",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    marginBottom: 16,
  },
  orderBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  orderText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 6,
  },
  description: {
    fontSize: 16,
    color: "#FFFFFF",
    lineHeight: 24,
    marginBottom: 20,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3A3A3A",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A90E2",
    marginLeft: 8,
  },
  coordinatesContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3A3A3A",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  coordinates: {
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 8,
    fontFamily: "monospace",
  },
  ticketButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4A90E2",
    paddingVertical: 16,
    borderRadius: 16,
  },
  ticketButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },
});

