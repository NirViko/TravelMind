import { StyleSheet, Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backgroundImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.4,
    position: "absolute",
    top: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    height: SCREEN_HEIGHT * 0.4,
  },
  content: {
    flex: 1,
    marginTop: SCREEN_HEIGHT * 0.35,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 40,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  input: {
    backgroundColor: "#F5E6D3",
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
  linkText: {
    fontSize: 14,
    color: "#4A90E2",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "500",
  },
});

