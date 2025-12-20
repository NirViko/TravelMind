import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    marginBottom: 30,
    textAlign: "center",
    color: "#666",
  },
  formCard: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    marginTop: 5,
    fontWeight: "600",
  },
  dateInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#000",
  },
  dateIcon: {
    fontSize: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    marginTop: 10,
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    textAlign: "center",
  },
  errorCard: {
    marginTop: 20,
    backgroundColor: "#ffebee",
  },
  errorTitle: {
    marginBottom: 10,
    fontWeight: "bold",
    color: "#c62828",
  },
  errorText: {
    color: "#c62828",
  },
  currencyHint: {
    color: "#666",
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 12,
    fontSize: 12,
  },
  iosPickerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
});

