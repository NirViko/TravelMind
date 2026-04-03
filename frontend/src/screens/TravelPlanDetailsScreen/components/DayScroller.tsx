import React, { useRef, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { formatDayPill } from "../../../utils/itineraryTime";
import { styles } from "./DayScroller.styles";

interface DayScrollerProps {
  days: Date[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function DayScroller({ days, selectedIndex, onSelect }: DayScrollerProps) {
  const scrollRef = useRef<ScrollView>(null);

  // Auto-scroll to keep the selected pill visible
  useEffect(() => {
    scrollRef.current?.scrollTo({ x: selectedIndex * 66, animated: true });
  }, [selectedIndex]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      style={styles.scroll}
    >
      {days.map((date, i) => {
        const active = i === selectedIndex;
        const [month, day] = formatDayPill(date).split("\n");
        return (
          <TouchableOpacity
            key={i}
            style={[styles.pill, active && styles.pillActive]}
            onPress={() => onSelect(i)}
            activeOpacity={0.8}
          >
            <Text style={[styles.month, active && styles.monthActive]}>
              {month}
            </Text>
            <Text style={[styles.day, active && styles.dayActive]}>
              {day}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

