import { StyleSheet, Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: "absolute",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "flex-end",
    paddingBottom: 60,
    paddingHorizontal: 24,
  },
  logo: {
    position: "absolute",
    top: 60,
    left: 24,
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 40,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
    opacity: 0.95,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  buttonContainer: {
    alignItems: "center",
  },
  getStartedButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 48,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  loginText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});
