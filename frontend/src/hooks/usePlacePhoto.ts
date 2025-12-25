import { useState, useEffect } from "react";
import { getRealPlacePhoto } from "../utils/googlePlaces";

interface UsePlacePhotoOptions {
  placeName: string;
  coordinates?: { latitude: number; longitude: number };
  enabled?: boolean;
}

/**
 * Hook to fetch real photos from Google Places API
 */
export const usePlacePhoto = ({
  placeName,
  coordinates,
  enabled = true,
}: UsePlacePhotoOptions) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !placeName) {
      return;
    }

    let cancelled = false;

    const fetchPhoto = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = await getRealPlacePhoto(placeName, coordinates);

        if (!cancelled) {
          setPhotoUrl(url);
          setLoading(false);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || "Failed to fetch photo");
          setLoading(false);
        }
      }
    };

    fetchPhoto();

    return () => {
      cancelled = true;
    };
  }, [placeName, coordinates?.latitude, coordinates?.longitude, enabled]);

  return { photoUrl, loading, error };
};
