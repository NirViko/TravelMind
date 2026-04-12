import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TimelineItem } from "../hooks/useNocturnalItinerary";
import { styles } from "./EditPlanView.styles";

interface EditPlanViewProps {
  items: TimelineItem[];
  onSave: (items: TimelineItem[]) => void;
}

export function EditPlanView({ items, onSave }: EditPlanViewProps) {
  const [thread, setThread] = useState<TimelineItem[]>(items);

  const handleRemove = (id: string) => {
    setThread((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit Plan</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => onSave(thread)}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Section label */}
      <Text style={styles.sectionLabel}>THE THREAD</Text>

      <ScrollView contentContainerStyle={styles.listContent}>
        {thread.map((item) => (
          <View key={item.id} style={styles.row}>
            {/* Drag handle placeholder */}
            <MaterialCommunityIcons
              name="dots-grid"
              size={20}
              color="#484847"
            />

            {/* Thumbnail */}
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
            ) : (
              <View style={[styles.thumbnail, styles.thumbnailPlaceholder]} />
            )}

            {/* Info */}
            <View style={styles.info}>
              <Text style={styles.activityTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.activityMeta} numberOfLines={1}>
                {item.timeLabel}
                {item.duration ? ` • ${item.duration}` : ""}
              </Text>
            </View>

            {/* Remove button */}
            <TouchableOpacity
              onPress={() => handleRemove(item.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialCommunityIcons name="close" size={18} color="#767575" />
            </TouchableOpacity>
          </View>
        ))}

        {/* AI Suggestion card */}
        <View style={styles.suggestionCard}>
          <View style={styles.suggestionHeader}>
            <MaterialCommunityIcons name="creation" size={14} color="#fab0ff" />
            <Text style={styles.suggestionLabel}>AI SUGGESTION</Text>
          </View>
          <View style={styles.suggestionBody}>
            <View style={styles.suggestionTextBlock}>
              <Text style={styles.suggestionTitle}>
                Based on your schedule, want to add a morning coffee stop?
              </Text>
              <Text style={styles.suggestionDesc}>
                A great café near your first activity — only 3 mins away.
              </Text>
              <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
                <MaterialCommunityIcons name="plus" size={14} color="#002c65" />
                <Text style={styles.addButtonText}>Add to Thread</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.suggestionImagePlaceholder}>
              <MaterialCommunityIcons name="coffee-outline" size={32} color="#484847" />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
