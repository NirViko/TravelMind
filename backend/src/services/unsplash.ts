/**
 * Unsplash API service for fetching real photos of places
 * Free, easy to use, and provides high-quality travel photos
 */

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export class UnsplashService {
  /**
   * Search for photos on Unsplash
   * @param query - Search query (e.g., "Eiffel Tower Paris")
   * @param orientation - Photo orientation: "landscape" | "portrait" | "squarish"
   * @returns URL to a photo, or null if not found
   */
  static async searchPhoto(
    query: string,
    orientation: "landscape" | "portrait" | "squarish" = "landscape"
  ): Promise<string | null> {
    if (!UNSPLASH_ACCESS_KEY) {
      // Fallback to Unsplash Source API (no key needed, but limited)
      return this.getUnsplashSourcePhoto(query);
    }

    try {
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&orientation=${orientation}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        return data.results[0].urls.regular;
      }

      return null;
    } catch (error: any) {
      console.warn(`Error fetching Unsplash photo for "${query}":`, error.message);
      // Fallback to Unsplash Source
      return this.getUnsplashSourcePhoto(query);
    }
  }

  /**
   * Get photo from Unsplash Source API (no key needed, but less reliable)
   * @param query - Search query
   * @returns URL to a photo
   */
  static getUnsplashSourcePhoto(query: string): string {
    // Unsplash Source API - free, no key needed
    // Format: https://source.unsplash.com/800x600/?{query}
    const encodedQuery = encodeURIComponent(query);
    return `https://source.unsplash.com/800x600/?${encodedQuery}`;
  }

  /**
   * Get photos for multiple places
   */
  static async getPhotosForPlaces(
    places: Array<{
      name: string;
      location?: string;
      type?: "destination" | "hotel" | "restaurant";
    }>
  ): Promise<Map<string, string>> {
    const results = new Map<string, string>();

    for (const place of places) {
      try {
        // Build search query
        let query = place.name;
        if (place.location) {
          query = `${place.name} ${place.location}`;
        }
        if (place.type === "hotel") {
          query = `${place.name} hotel ${place.location || ""}`;
        } else if (place.type === "restaurant") {
          query = `${place.name} restaurant ${place.location || ""}`;
        }

        const photoUrl = await this.searchPhoto(query);
        if (photoUrl) {
          results.set(place.name, photoUrl);
        } else {
          // Use Unsplash Source as fallback
          const fallbackUrl = this.getUnsplashSourcePhoto(query);
          results.set(place.name, fallbackUrl);
        }
      } catch (error: any) {
        console.warn(`Error getting photo for ${place.name}:`, error.message);
        // Use Unsplash Source as fallback
        const fallbackUrl = this.getUnsplashSourcePhoto(place.name);
        results.set(place.name, fallbackUrl);
      }
    }

    return results;
  }
}

