import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { TimelineItem } from "../hooks/useNocturnalItinerary";
import { styles } from "./TimelineActivityCard.styles";

interface TimelineActivityCardProps {
  item: TimelineItem;
  onPress: () => void;
}

export function TimelineActivityCard({ item, onPress }: TimelineActivityCardProps) {
  const metaText =
    item.type === "restaurant" && item.rating != null
      ? `★ ${item.rating.toFixed(1)}`
      : item.duration ?? "";

  return (
    <View style={styles.row}>
      {/* Left column: time + dot + line */}
      <View style={styles.left}>
        <Text style={styles.time}>{item.timeLabel}</Text>
        <View style={styles.dotWrap}>
          <View style={styles.dot} />
          <View style={styles.lineSeg} />
        </View>
      </View>

      {/* Right column: card */}
      <View style={styles.right}>
        <TouchableOpacity
          style={styles.card}
          onPress={onPress}
          activeOpacity={0.85}
        >
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]} />
          )}

          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
            <View style={styles.footer}>
              <View style={styles.chip}>
                <Text style={styles.chipText}>{item.category}</Text>
              </View>
              {metaText !== "" && (
                <Text style={styles.meta}>{metaText}</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

