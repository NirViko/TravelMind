import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSearchHistoryStore } from "../../../store/searchHistoryStore";
import { useDateFormatter } from "../../../hooks/useDateFormatter";

interface SearchHistoryProps {
  onSelectSearch: (item: {
    destination: string;
    startDate: Date;
    endDate: Date;
    budget: string;
  }) => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  onSelectSearch,
}) => {
  const { history, isLoading, loadHistory, removeSearch, clearHistory } =
    useSearchHistoryStore();
  const { formatDateForDisplay } = useDateFormatter();

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (item: any) => {
    onSelectSearch({
      destination: item.destination,
      startDate: new Date(item.startDate),
      endDate: new Date(item.endDate),
      budget: item.budget,
    });
  };

  const handleRemove = (id: string, e: any) => {
    e.stopPropagation();
    removeSearch(id);
  };

  if (isLoading) {
    return (
      <View style={historyStyles.container}>
        <Text style={historyStyles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  // Always show the section, even if empty (for testing)
  if (history.length === 0) {
    return (
      <View style={historyStyles.container}>
        <View style={historyStyles.header}>
          <View style={historyStyles.headerLeft}>
            <Icon name="history" size={20} color="#4A90E2" />
            <Text style={historyStyles.title}>Recent Searches</Text>
          </View>
        </View>
        <Text style={historyStyles.emptyText}>
          No recent searches yet. Your searches will appear here.
        </Text>
      </View>
    );
  }

  return (
    <View style={historyStyles.container}>
      <View style={historyStyles.header}>
        <View style={historyStyles.headerLeft}>
          <Icon name="history" size={20} color="#4A90E2" />
          <Text style={historyStyles.title}>Recent Searches</Text>
        </View>
        {history.length > 0 && (
          <TouchableOpacity
            onPress={clearHistory}
            style={historyStyles.clearButton}
          >
            <Text style={historyStyles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={historyStyles.scrollView}
        contentContainerStyle={historyStyles.scrollContent}
      >
        {history.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={historyStyles.card}
            onPress={() => handleSelect(item)}
            activeOpacity={0.7}
          >
            <TouchableOpacity
              style={historyStyles.removeButton}
              onPress={(e) => handleRemove(item.id, e)}
            >
              <Icon name="close-circle" size={20} color="#CCCCCC" />
            </TouchableOpacity>

            <View style={historyStyles.cardContent}>
              <View style={historyStyles.destinationRow}>
                <Icon name="map-marker" size={16} color="#4A90E2" />
                <Text style={historyStyles.destination} numberOfLines={1}>
                  {item.destination}
                </Text>
              </View>

              <View style={historyStyles.datesRow}>
                <Icon name="calendar-start" size={14} color="#666666" />
                <Text style={historyStyles.dateText}>
                  {formatDateForDisplay(new Date(item.startDate))}
                </Text>
              </View>

              <View style={historyStyles.datesRow}>
                <Icon name="calendar-end" size={14} color="#666666" />
                <Text style={historyStyles.dateText}>
                  {formatDateForDisplay(new Date(item.endDate))}
                </Text>
              </View>

              <View style={historyStyles.budgetRow}>
                <Icon name="wallet" size={14} color="#4A90E2" />
                <Text style={historyStyles.budgetText}>{item.budget}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const historyStyles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearText: {
    fontSize: 14,
    color: "#4A90E2",
    fontWeight: "500",
  },
  scrollView: {
    marginHorizontal: -4,
  },
  scrollContent: {
    paddingHorizontal: 4,
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    width: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
  cardContent: {
    gap: 8,
  },
  destinationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  destination: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
  },
  datesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: "#666666",
  },
  budgetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  budgetText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A90E2",
  },
  loadingText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    paddingVertical: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center",
    paddingVertical: 12,
    fontStyle: "italic",
  },
});
