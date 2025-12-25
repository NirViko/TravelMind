import React from "react";
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
  Modal,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { Destination } from "../../../types/travel";
import { formatCurrency } from "../../../utils/currency";
import { openURL } from "../../../utils/linking";

interface DestinationDetailCardProps {
  destination: Destination | null;
  currency: string;
  visible: boolean;
  onClose: () => void;
}

export const DestinationDetailCard: React.FC<DestinationDetailCardProps> = ({
  destination,
  currency,
  visible,
  onClose,
}) => {
  if (!destination) return null;

  const defaultImage = {
    uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={detailCardStyles.overlay}>
        <View style={detailCardStyles.card}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Close button */}
            <TouchableOpacity
              style={detailCardStyles.closeButton}
              onPress={onClose}
            >
              <Icon name="close" size={24} color="#333333" />
            </TouchableOpacity>

            {/* Image */}
            {destination.imageUrl ? (
              <Image
                source={{ uri: destination.imageUrl }}
                style={detailCardStyles.image}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  detailCardStyles.image,
                  detailCardStyles.placeholderImage,
                ]}
              >
                <Icon name="image-outline" size={48} color="#CCCCCC" />
              </View>
            )}

            {/* Content */}
            <View style={detailCardStyles.content}>
              <View style={detailCardStyles.header}>
                <View style={detailCardStyles.orderBadge}>
                  <Text style={detailCardStyles.orderText}>
                    {destination.visitOrder}
                  </Text>
                </View>
                <View style={detailCardStyles.titleContainer}>
                  <Text style={detailCardStyles.title}>
                    {destination.title}
                  </Text>
                  {destination.estimatedDuration && (
                    <View style={detailCardStyles.metaRow}>
                      <Icon name="clock-outline" size={16} color="#666666" />
                      <Text style={detailCardStyles.metaText}>
                        {destination.estimatedDuration}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <Text style={detailCardStyles.description}>
                {destination.description}
              </Text>

              {destination.price !== undefined &&
                destination.price !== null && (
                  <View style={detailCardStyles.priceContainer}>
                    <Icon name="wallet" size={20} color="#4A90E2" />
                    <Text style={detailCardStyles.price}>
                      {formatCurrency(destination.price, currency)}
                    </Text>
                  </View>
                )}

              {destination.ticketLink && (
                <TouchableOpacity
                  style={detailCardStyles.ticketButton}
                  onPress={() => openURL(destination.ticketLink)}
                >
                  <Icon name="ticket" size={20} color="#FFFFFF" />
                  <Text style={detailCardStyles.ticketButtonText}>
                    Buy Tickets
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const detailCardStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 250,
  },
  placeholderImage: {
    backgroundColor: "#F5E6D3",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    marginBottom: 16,
  },
  orderBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  orderText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 6,
  },
  description: {
    fontSize: 16,
    color: "#666666",
    lineHeight: 24,
    marginBottom: 20,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5E6D3",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A90E2",
    marginLeft: 8,
  },
  coordinatesContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  coordinates: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 8,
    fontFamily: "monospace",
  },
  ticketButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4A90E2",
    paddingVertical: 16,
    borderRadius: 16,
  },
  ticketButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },
});
