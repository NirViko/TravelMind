import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginBottom: 32,
    padding: 24,
    backgroundColor: "#2A2A2A",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#4A90E2",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
    marginBottom: 8,
  },
  email: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A90E2",
    textAlign: "center",
    marginBottom: 24,
  },
  instructions: {
    fontSize: 14,
    color: "#CCCCCC",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 24,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#4A90E2",
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#4A90E2",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  secondaryButtonText: {
    color: "#4A90E2",
  },
  resendLink: {
    paddingVertical: 12,
    alignItems: "center",
  },
  resendLinkText: {
    fontSize: 14,
    color: "#4A90E2",
    fontWeight: "500",
  },
});

