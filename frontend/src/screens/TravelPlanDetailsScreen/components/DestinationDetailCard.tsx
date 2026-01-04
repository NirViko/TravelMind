import React from "react";
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
  Modal,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { Destination } from "../../../types/travel";
import { formatCurrency } from "../../../utils/currency";
import { openURL } from "../../../utils/linking";
import { detailCardStyles } from "./styles/DestinationDetailCard.styles";
import { STRINGS } from "../../../constants/strings";

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
            <TouchableOpacity
              style={detailCardStyles.closeButton}
              onPress={onClose}
            >
              <Icon name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>

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
                      <Icon name="clock-outline" size={16} color="#CCCCCC" />
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
                    {STRINGS.buyTickets}
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
