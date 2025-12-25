/**
 * Google Places API utility functions
 * Used to fetch real photos of destinations, hotels, and restaurants
 */

const GOOGLE_PLACES_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || "";

interface PlacePhoto {
  photo_reference: string;
  width: number;
  height: number;
}

interface PlaceResult {
  place_id: string;
  photos?: PlacePhoto[];
  name: string;
}

interface PlacesSearchResponse {
  results: PlaceResult[];
  status: string;
}

interface PlaceDetailsResponse {
  result: {
    photos?: PlacePhoto[];
  };
  status: string;
}

/**
 * Search for a place by name and location
 */
export const searchPlace = async (
  placeName: string,
  coordinates?: { latitude: number; longitude: number }
): Promise<PlaceResult | null> => {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn("Google Places API key not configured");
    return null;
  }

  try {
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      placeName
    )}&key=${GOOGLE_PLACES_API_KEY}`;

    // Add location bias if coordinates are provided
    if (coordinates) {
      url += `&location=${coordinates.latitude},${coordinates.longitude}&radius=5000`;
    }

    const response = await fetch(url);
    const data: PlacesSearchResponse = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      return data.results[0];
    }

    return null;
  } catch (error) {
    console.error("Error searching for place:", error);
    return null;
  }
};

/**
 * Get place details by place_id
 */
export const getPlaceDetails = async (
  placeId: string
): Promise<PlacePhoto[] | null> => {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn("Google Places API key not configured");
    return null;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(url);
    const data: PlaceDetailsResponse = await response.json();

    if (data.status === "OK" && data.result.photos) {
      return data.result.photos;
    }

    return null;
  } catch (error) {
    console.error("Error getting place details:", error);
    return null;
  }
};

/**
 * Get photo URL from Google Places API
 * @param photoReference - The photo reference from Google Places API
 * @param maxWidth - Maximum width of the photo (default: 800)
 * @returns URL to the photo
 */
export const getPlacePhotoUrl = (
  photoReference: string,
  maxWidth: number = 800
): string => {
  if (!GOOGLE_PLACES_API_KEY) {
    return "";
  }

  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
};

/**
 * Get real photo URL for a place
 * @param placeName - Name of the place
 * @param coordinates - Optional coordinates for better search results
 * @returns URL to a real photo of the place, or null if not found
 */
export const getRealPlacePhoto = async (
  placeName: string,
  coordinates?: { latitude: number; longitude: number }
): Promise<string | null> => {
  try {
    // Search for the place
    const place = await searchPlace(placeName, coordinates);

    if (!place) {
      return null;
    }

    // If place has photos, use the first one
    if (place.photos && place.photos.length > 0) {
      return getPlacePhotoUrl(place.photos[0].photo_reference);
    }

    // Try to get more photos from place details
    const photos = await getPlaceDetails(place.place_id);
    if (photos && photos.length > 0) {
      return getPlacePhotoUrl(photos[0].photo_reference);
    }

    return null;
  } catch (error) {
    console.error("Error getting real place photo:", error);
    return null;
  }
};
