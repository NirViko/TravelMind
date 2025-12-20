/**
 * Utility functions for fetching images for destinations, hotels, and restaurants
 * Uses direct Unsplash image URLs with specific photo IDs for reliability
 */

// High-quality Unsplash images for different categories
const TRAVEL_IMAGES = [
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
];

const HOTEL_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
];

const RESTAURANT_IMAGES = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
];

/**
 * Get a random image from an array based on a seed (place name)
 */
const getImageBySeed = (images: string[], seed: string): string => {
  // Use the seed to consistently pick the same image for the same place
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % images.length;
  return images[index];
};

/**
 * Get image URL for a destination/place by name
 */
export const getPlaceImageUrl = (placeName: string, type: 'destination' | 'hotel' | 'restaurant' = 'destination'): string => {
  const images = type === 'hotel' ? HOTEL_IMAGES : type === 'restaurant' ? RESTAURANT_IMAGES : TRAVEL_IMAGES;
  return getImageBySeed(images, placeName);
};

/**
 * Get destination image URL
 */
export const getDestinationImage = (destinationName: string, cityName?: string): string => {
  const searchTerm = cityName ? `${destinationName} ${cityName}` : destinationName;
  return getPlaceImageUrl(searchTerm, 'destination');
};

/**
 * Get hotel image URL
 */
export const getHotelImage = (hotelName: string, cityName?: string): string => {
  const searchTerm = cityName ? `${hotelName} ${cityName}` : hotelName;
  return getPlaceImageUrl(searchTerm, 'hotel');
};

/**
 * Get restaurant image URL
 */
export const getRestaurantImage = (restaurantName: string, cuisine?: string): string => {
  const searchTerm = cuisine ? `${restaurantName} ${cuisine}` : restaurantName;
  return getPlaceImageUrl(searchTerm, 'restaurant');
};

/**
 * Fallback to a default travel image if image loading fails
 */
export const getDefaultTravelImage = (): string => {
  return TRAVEL_IMAGES[0];
};

export const getDefaultHotelImage = (): string => {
  return HOTEL_IMAGES[0];
};

export const getDefaultRestaurantImage = (): string => {
  return RESTAURANT_IMAGES[0];
};
