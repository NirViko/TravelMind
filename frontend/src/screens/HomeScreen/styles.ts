import { StyleSheet, Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Colors matching the design: bright blue (#4A90E2), sand/beige (#F5E6D3), white
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backgroundContainer: {
    flex: 1,
  },
  backgroundImage: {
    width: SCREEN_WIDTH,
    height: 450,
    position: "absolute",
    top: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(74, 144, 226, 0.15)",
    height: 450,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "black",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: "#666666",
    lineHeight: 26,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    marginTop: 20,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 10,
    marginTop: 16,
  },
  dateInput: {
    borderWidth: 2,
    borderColor: "#4A90E2",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "500",
  },
  dateIcon: {
    fontSize: 24,
  },
  input: {
    borderWidth: 2,
    borderColor: "#4A90E2",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    fontSize: 16,
    color: "#333333",
  },
  button: {
    marginTop: 12,
    borderRadius: 16,
    paddingVertical: 4,
    backgroundColor: "#4A90E2",
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  loadingText: {
    marginTop: 12,
    color: "#666666",
    fontSize: 14,
    textAlign: "center",
  },
  errorCard: {
    marginTop: 20,
    backgroundColor: "#FFEBEE",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#C62828",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#C62828",
  },
  currencyHint: {
    color: "#666666",
    marginTop: -8,
    marginBottom: 12,
    marginLeft: 18,
    fontSize: 12,
  },
  iosPickerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    borderRadius: 12,
  },
  scrollContent: {
    paddingBottom: 100,
  },
});
