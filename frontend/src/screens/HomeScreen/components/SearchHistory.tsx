import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSearchHistoryStore } from "../../../store/searchHistoryStore";
import { useDateFormatter } from "../../../hooks/useDateFormatter";
import { historyStyles } from "./styles/SearchHistory.styles";
import { STRINGS } from "../../../constants/strings";

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
        <Text style={historyStyles.loadingText}>{STRINGS.loadingHistory}</Text>
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={historyStyles.container}>
        <View style={historyStyles.header}>
          <View style={historyStyles.headerLeft}>
            <Icon name="history" size={20} color="#4A90E2" />
            <Text style={historyStyles.title}>{STRINGS.recentSearches}</Text>
          </View>
        </View>
        <Text style={historyStyles.emptyText}>
          {STRINGS.noRecentSearches}
        </Text>
      </View>
    );
  }

  return (
    <View style={historyStyles.container}>
      <View style={historyStyles.header}>
        <View style={historyStyles.headerLeft}>
          <Icon name="history" size={20} color="#4A90E2" />
          <Text style={historyStyles.title}>{STRINGS.recentSearches}</Text>
        </View>
        {history.length > 0 && (
          <TouchableOpacity
            onPress={clearHistory}
            style={historyStyles.clearButton}
          >
            <Text style={historyStyles.clearText}>{STRINGS.clear}</Text>
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
