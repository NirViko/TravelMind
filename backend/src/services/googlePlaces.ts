/**
 * Google Places API service for fetching real photos of places
 * This provides accurate images of destinations, hotels, and restaurants
 */

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

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

export class GooglePlacesService {
  /**
   * Get photo URL from Google Places API
   */
  static getPhotoUrl(photoReference: string, maxWidth: number = 800): string {
    if (!GOOGLE_PLACES_API_KEY) {
      return "";
    }

    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
  }

  /**
   * Search for a place by name and coordinates
   */
  static async searchPlace(
    placeName: string,
    coordinates?: { latitude: number; longitude: number }
  ): Promise<PlaceResult | null> {
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
      const data = (await response.json()) as PlacesSearchResponse;

      if (data.status === "OK" && data.results.length > 0) {
        return data.results[0];
      }

      if (data.status !== "OK") {
        console.warn(
          `Google Places API error for "${placeName}": ${data.status}`
        );
        if (data.status === "REQUEST_DENIED") {
          console.error(
            "❌ REQUEST_DENIED - This usually means:\n" +
              "1. Places API is not enabled in Google Cloud Console\n" +
              "2. API key is invalid or has restrictions\n" +
              "3. API key doesn't have Places API permissions\n" +
              "Please check: https://console.cloud.google.com/apis/library/places-backend.googleapis.com"
          );
        }
      }

      return null;
    } catch (error) {
      console.error("Error searching for place:", error);
      return null;
    }
  }

  /**
   * Get place details by place_id
   */
  static async getPlaceDetails(placeId: string): Promise<PlacePhoto[] | null> {
    if (!GOOGLE_PLACES_API_KEY) {
      console.warn("Google Places API key not configured");
      return null;
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_PLACES_API_KEY}`;

      const response = await fetch(url);
      const data = (await response.json()) as PlaceDetailsResponse;

      if (data.status === "OK" && data.result.photos) {
        return data.result.photos;
      }

      return null;
    } catch (error) {
      console.error("Error getting place details:", error);
      return null;
    }
  }

  /**
   * Get real photo URL for a place
   * @param placeName - Name of the place
   * @param coordinates - Optional coordinates for better search results
   * @returns URL to a real photo of the place, or null if not found
   */
  static async getRealPlacePhoto(
    placeName: string,
    coordinates?: { latitude: number; longitude: number }
  ): Promise<string | null> {
    try {
      if (!GOOGLE_PLACES_API_KEY) {
        return null;
      }

      // Search for the place
      const place = await this.searchPlace(placeName, coordinates);

      if (!place) {
        console.log(`Place not found: ${placeName}`);
        return null;
      }

      // If place has photos, use the first one
      if (place.photos && place.photos.length > 0) {
        const photoUrl = this.getPhotoUrl(place.photos[0].photo_reference);
        return photoUrl;
      }

      // Try to get more photos from place details
      const photos = await this.getPlaceDetails(place.place_id);
      if (photos && photos.length > 0) {
        const photoUrl = this.getPhotoUrl(photos[0].photo_reference);
        return photoUrl;
      }

      console.log(`No photos available for place: ${placeName}`);
      return null;
    } catch (error: any) {
      console.error(
        `Error getting real place photo for ${placeName}:`,
        error.message
      );
      return null;
    }
  }

  /**
   * Get real photos for multiple places in parallel
   */
  static async getRealPlacePhotos(
    places: Array<{
      name: string;
      coordinates?: { latitude: number; longitude: number };
    }>
  ): Promise<Map<string, string | null>> {
    const results = new Map<string, string | null>();

    if (!GOOGLE_PLACES_API_KEY) {
      console.warn(
        "Google Places API key not configured - skipping photo fetch"
      );
      return results;
    }

    // Process in parallel but limit concurrency to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < places.length; i += batchSize) {
      const batch = places.slice(i, i + batchSize);
      const promises = batch.map(async (place) => {
        try {
          const photoUrl = await this.getRealPlacePhoto(
            place.name,
            place.coordinates
          );
          if (photoUrl) {
            console.log(`✅ Found photo for: ${place.name}`);
          } else {
            console.log(`⚠️  No photo found for: ${place.name}`);
          }
          return { name: place.name, photoUrl };
        } catch (error: any) {
          console.warn(
            `❌ Error fetching photo for ${place.name}:`,
            error.message
          );
          return { name: place.name, photoUrl: null };
        }
      });

      const batchResults = await Promise.all(promises);
      batchResults.forEach(({ name, photoUrl }) => {
        results.set(name, photoUrl);
      });

      // Small delay between batches to avoid rate limits
      if (i + batchSize < places.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return results;
  }
}
