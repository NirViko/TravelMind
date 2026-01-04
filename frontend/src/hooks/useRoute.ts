import { useState, useEffect } from "react";

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface RoutePoint {
  latitude: number;
  longitude: number;
}

interface UseRouteReturn {
  route: RoutePoint[];
  loading: boolean;
  error: string | null;
  distance: number | null;
  duration: number | null;
  isFallback: boolean; // Indicates if this is a fallback (straight line) route
}

// Calculate route using OSRM (Open Source Routing Machine) - free service
const calculateRoute = async (
  origin: Coordinate,
  destination: Coordinate
): Promise<UseRouteReturn> => {
  try {
    // Using OSRM demo server (free, no API key needed)
    const url = `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`;

    // Add timeout to fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Silently use fallback for API errors (400, 500, etc.)
      // Don't log as error since we have a fallback mechanism
      throw new Error("API error");
    }

    const data = await response.json();

    if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
      console.error("Route calculation failed:", data);
      // Use fallback instead of returning error
      throw new Error("Route calculation failed");
    }

    const route = data.routes[0];
    const coordinates = route.geometry.coordinates.map(
      (coord: [number, number]) => ({
        latitude: coord[1],
        longitude: coord[0],
      })
    );

    return {
      route: coordinates,
      loading: false,
      error: null,
      distance: route.distance, // in meters
      duration: route.duration, // in seconds
      isFallback: false,
    };
  } catch (error: any) {
    // Silently use fallback for any error (network, timeout, etc.)
    // Don't log as error since we have a fallback mechanism

    const fallbackRoute = [
      { latitude: origin.latitude, longitude: origin.longitude },
      { latitude: destination.latitude, longitude: destination.longitude },
    ];

    // Calculate approximate distance using Haversine formula
    const R = 6371000; // Earth radius in meters
    const dLat = ((destination.latitude - origin.latitude) * Math.PI) / 180;
    const dLon = ((destination.longitude - origin.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((origin.latitude * Math.PI) / 180) *
        Math.cos((destination.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    const duration = (distance / 50000) * 3600; // Assume 50 km/h average speed

    return {
      route: fallbackRoute,
      loading: false,
      error: null, // Don't show error, just use fallback
      distance: distance,
      duration: duration,
      isFallback: true, // Mark as fallback
    };
  }
};

export const useRoute = (
  origin: Coordinate | null,
  destination: Coordinate | null
): UseRouteReturn => {
  const [route, setRoute] = useState<RoutePoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [isFallback, setIsFallback] = useState<boolean>(false);

  useEffect(() => {
    if (!origin || !destination) {
      setRoute([]);
      setDistance(null);
      setDuration(null);
      setLoading(false);
      setError(null);
      setIsFallback(false);
      return;
    }

    // Validate coordinates
    if (
      isNaN(origin.latitude) ||
      isNaN(origin.longitude) ||
      isNaN(destination.latitude) ||
      isNaN(destination.longitude)
    ) {
      setRoute([]);
      setDistance(null);
      setDuration(null);
      setLoading(false);
      setError("Invalid coordinates");
      return;
    }

    let cancelled = false;

    const fetchRoute = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await calculateRoute(origin, destination);

        if (!cancelled) {
          setRoute(result.route);
          setDistance(result.distance);
          setDuration(result.duration);
          setError(result.error);
          setIsFallback(result.isFallback);
          setLoading(false);
        }
      } catch (err: any) {
        if (!cancelled) {
          // Silently use fallback - don't set error since we have fallback
          setError(null);
          setLoading(false);
          // Calculate fallback route
          const fallbackRoute = [
            { latitude: origin.latitude, longitude: origin.longitude },
            { latitude: destination.latitude, longitude: destination.longitude },
          ];
          const R = 6371000;
          const dLat = ((destination.latitude - origin.latitude) * Math.PI) / 180;
          const dLon =
            ((destination.longitude - origin.longitude) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((origin.latitude * Math.PI) / 180) *
              Math.cos((destination.latitude * Math.PI) / 180) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c;
          const duration = (distance / 50000) * 3600;

          setRoute(fallbackRoute);
          setDistance(distance);
          setDuration(duration);
          setIsFallback(true);
        }
      }
    };

    // Add timeout to prevent infinite loading - use fallback instead
    const timeoutId = setTimeout(() => {
      if (!cancelled) {
        // Silently use fallback on timeout
        // Calculate fallback route
        const fallbackRoute = [
          { latitude: origin.latitude, longitude: origin.longitude },
          { latitude: destination.latitude, longitude: destination.longitude },
        ];
        const R = 6371000;
        const dLat = ((destination.latitude - origin.latitude) * Math.PI) / 180;
        const dLon =
          ((destination.longitude - origin.longitude) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((origin.latitude * Math.PI) / 180) *
            Math.cos((destination.latitude * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        const duration = (distance / 50000) * 3600;

        setRoute(fallbackRoute);
        setDistance(distance);
        setDuration(duration);
        setError(null);
        setIsFallback(true);
        setLoading(false);
      }
    }, 10000); // 10 seconds timeout

    fetchRoute();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [
    origin?.latitude,
    origin?.longitude,
    destination?.latitude,
    destination?.longitude,
  ]);

  return {
    route,
    loading,
    error,
    distance,
    duration,
    isFallback,
  };
};
