import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [rotateAnim] = useState(new Animated.Value(0));
  const [heightAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(heightAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isExpanded, rotateAnim, heightAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

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
        <TouchableOpacity
          style={historyStyles.header}
          onPress={toggleExpanded}
          activeOpacity={0.7}
        >
          <View style={historyStyles.headerLeft}>
            <Icon name="history" size={22} color="#4A90E2" />
            <Text style={historyStyles.title}>{STRINGS.recentSearches}</Text>
          </View>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Icon name="chevron-down" size={24} color="#4A90E2" />
          </Animated.View>
        </TouchableOpacity>
        {isExpanded && (
          <Text style={historyStyles.emptyText}>
            {STRINGS.noRecentSearches}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={historyStyles.container}>
      <TouchableOpacity
        style={historyStyles.header}
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <View style={historyStyles.headerLeft}>
          <Icon name="history" size={22} color="#4A90E2" />
          <Text style={historyStyles.title}>{STRINGS.recentSearches}</Text>
        </View>
        <View style={historyStyles.headerRight}>
          {isExpanded && history.length > 0 && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                clearHistory();
              }}
              style={historyStyles.clearButton}
            >
              <Text style={historyStyles.clearText}>{STRINGS.clear}</Text>
            </TouchableOpacity>
          )}
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Icon name="chevron-down" size={24} color="#4A90E2" />
          </Animated.View>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <Animated.View
          style={{
            opacity: heightAnim,
            overflow: "hidden",
          }}
        >
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
                    <Icon name="map-marker" size={18} color="#4A90E2" />
                    <Text style={historyStyles.destination} numberOfLines={1}>
                      {item.destination}
                    </Text>
                  </View>

                  <View style={historyStyles.datesRow}>
                    <Icon name="calendar-start" size={14} color="#CCCCCC" />
                    <Text style={historyStyles.dateText}>
                      {formatDateForDisplay(new Date(item.startDate))}
                    </Text>
                  </View>

                  <View style={historyStyles.datesRow}>
                    <Icon name="calendar-end" size={14} color="#CCCCCC" />
                    <Text style={historyStyles.dateText}>
                      {formatDateForDisplay(new Date(item.endDate))}
                    </Text>
                  </View>

                  <View style={historyStyles.budgetRow}>
                    <Icon name="wallet" size={16} color="#4A90E2" />
                    <Text style={historyStyles.budgetText}>{item.budget}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
};
