import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  backgroundContainer: {
    flex: 1,
    width: "100%",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
  },

  // Header section
  headerContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backButtonPlaceholder: {
    width: 44,
  },
  headerTitle: {
    fontSize: 0,
    color: "transparent",
  },
  logoutButton: {
    backgroundColor: "rgba(26, 26, 26, 0.95)",
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },

  // Title section inside scrollview
  titleSection: {
    marginBottom: 36,
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 44,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -1,
    textAlign: "center",
    lineHeight: 50,
  },
  subtitle: {
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 24,
    paddingHorizontal: 20,
  },

  // Form layout
  formCard: {
    backgroundColor: "transparent",
  },

  // Field labels
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
    marginTop: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7FD4",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  // Destination input
  destinationInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  destinationIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 16,
    color: "#FFFFFF",
    backgroundColor: "transparent",
  },

  // Destination dropdown
  destinationDropdown: {
    marginTop: 4,
    marginBottom: 8,
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    maxHeight: 280,
    overflow: "hidden",
  },
  destinationScrollView: {
    height: 260,
  },
  destinationScrollContent: {
    paddingBottom: 8,
  },
  destinationOption: {
    width: "100%",
    minHeight: 52,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
    justifyContent: "center",
  },
  destinationOptionText: {
    fontSize: 16,
    color: "#CCCCCC",
  },

  // Dates row
  datesRow: {
    flexDirection: "row",
    gap: 12,
  },
  dateFieldWrapper: {
    flex: 1,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#2A2A2A",
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
  },
  dateText: {
    fontSize: 15,
    color: "#888888",
    fontWeight: "400",
    flex: 1,
  },
  dateTextFilled: {
    color: "#FFFFFF",
  },

  // Budget slider
  budgetHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 24,
  },
  budgetLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  budgetValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  sliderContainer: {
    marginBottom: 6,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -4,
  },
  sliderLabel: {
    fontSize: 11,
    color: "#666666",
    letterSpacing: 0.5,
    fontWeight: "500",
  },

  // Voyage preferences
  voyageCard: {
    backgroundColor: "#141414",
    borderRadius: 20,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#222222",
  },
  voyageTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  chipsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chipsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  chipPlaceholder: {
    flex: 1,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    backgroundColor: "#1A1A1A",
    gap: 8,
    flex: 1,
    justifyContent: "center",
  },
  chipSelected: {
    borderColor: "#6B7FD4",
    backgroundColor: "rgba(107, 127, 212, 0.15)",
  },
  chipText: {
    fontSize: 15,
    color: "#CCCCCC",
    fontWeight: "500",
  },
  chipTextSelected: {
    color: "#FFFFFF",
  },

  // Submit button
  buttonWrapper: {
    marginTop: 28,
    borderRadius: 30,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A2E",
    letterSpacing: 0.3,
  },
  button: {
    marginTop: 0,
    borderRadius: 30,
  },

  // Loading & error
  loadingContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  loadingText: {
    marginTop: 12,
    color: "#888888",
    fontSize: 14,
    textAlign: "center",
  },
  errorCard: {
    marginTop: 20,
    backgroundColor: "#2A1414",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#5A2020",
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FF6B6B",
    marginBottom: 6,
  },
  errorText: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "400",
  },

  // iOS picker
  iosPickerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#1A1A1A",
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
    borderRadius: 12,
  },

  // Top navigation bar
  topNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  topNavTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  topNavIconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  // Bottom navigation bar
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D0D0D",
    borderTopWidth: 1,
    borderTopColor: "#1A1A1A",
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  bottomNavTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 4,
    position: "relative",
  },
  activeCircle: {
    position: "absolute",
    top: 8,
    left: -10,
    width: 72,
    height: 52,
    borderRadius: 26,
    overflow: "hidden",
  },
  activeCircleGradient: {
    flex: 1,
    borderRadius: 26,
  },
  tabIconWrapper: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  tabPill: {
    position: "absolute",
    top: 4,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#5B6FD4",
  },
  bottomNavLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: "#555555",
    letterSpacing: 0.8,
  },
  bottomNavLabelActive: {
    color: "#FFFFFF",
  },

  // FAB Add button
  fabBtn: {
    marginLeft: 8,
    borderRadius: 28,
    overflow: "hidden",
  },
  fabGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 18,
    gap: 6,
    borderRadius: 28,
  },

  // Legacy (kept for SearchHistory compatibility)
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    height: 320,
  },
  header: {
    marginBottom: 12,
    paddingTop: 80,
  },
  budgetContainer: {
    flexDirection: "row",
    gap: 12,
  },
  budgetInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    borderRadius: 14,
    padding: 18,
    fontSize: 16,
    color: "#FFFFFF",
    backgroundColor: "#1A1A1A",
  },
  currencySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: "#1A1A1A",
    minWidth: 100,
    gap: 8,
  },
  currencyText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  currencyDropdown: {
    marginTop: 4,
    marginBottom: 8,
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    maxHeight: 300,
    overflow: "hidden",
  },
  currencyOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  currencyOptionSelected: {
    backgroundColor: "#2A2A2A",
  },
  currencyOptionText: {
    fontSize: 15,
    color: "#CCCCCC",
  },
  currencyOptionTextSelected: {
    color: "#6B7FD4",
    fontWeight: "600",
  },
  currencyHint: {
    color: "#888888",
    marginTop: -8,
    marginBottom: 16,
    marginLeft: 16,
    fontSize: 13,
  },
});
