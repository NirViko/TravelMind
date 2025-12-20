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
}

// Calculate route using OSRM (Open Source Routing Machine) - free service
const calculateRoute = async (
  origin: Coordinate,
  destination: Coordinate
): Promise<UseRouteReturn> => {
  try {
    // Using OSRM demo server (free, no API key needed)
    const url = `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`;

    console.log("Fetching route from:", url);

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
      console.error("Route API error:", response.status, response.statusText);
      // Use fallback instead of returning error
      throw new Error("API error");
    }

    const data = await response.json();
    console.log("Route API response:", data);

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

    console.log("Route calculated successfully:", {
      points: coordinates.length,
      distance: route.distance,
      duration: route.duration,
    });

    return {
      route: coordinates,
      loading: false,
      error: null,
      distance: route.distance, // in meters
      duration: route.duration, // in seconds
    };
  } catch (error: any) {
    console.error("Error calculating route:", error);

    // Always use fallback for any error (network, timeout, etc.)
    console.warn("Using fallback route due to error:", error.message);

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

    console.log("Using fallback route:", { distance, duration });

    return {
      route: fallbackRoute,
      loading: false,
      error: null, // Don't show error, just use fallback
      distance: distance,
      duration: duration,
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

  useEffect(() => {
    if (!origin || !destination) {
      setRoute([]);
      setDistance(null);
      setDuration(null);
      setLoading(false);
      setError(null);
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
      console.log("Calculating route from:", origin, "to:", destination);

      try {
        const result = await calculateRoute(origin, destination);

        if (!cancelled) {
          console.log("Route result:", result);
          setRoute(result.route);
          setDistance(result.distance);
          setDuration(result.duration);
          setError(result.error);
          setLoading(false);
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error("Route calculation error:", err);
          setError(err.message || "Failed to calculate route");
          setLoading(false);
        }
      }
    };

    // Add timeout to prevent infinite loading - use fallback instead
    const timeoutId = setTimeout(() => {
      if (!cancelled) {
        console.warn("Route calculation timeout - using fallback");
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
  };
};
