// Travel plan types (matching backend types)
export interface TravelPlanRequest {
  startDate: string;
  endDate: string;
  destination: string;
  budget?: number;
  preferences?: string[];
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Hotel {
  name: string;
  description: string;
  coordinates?: Location;
  bookingLinks: {
    booking?: string;
    expedia?: string;
    agoda?: string;
    hotels?: string;
  };
  estimatedPrice?: number;
  imageUrl?: string;
}

export interface Destination {
  title: string;
  description: string;
  coordinates: Location;
  visitOrder: number;
  day: number; // Day number (1-based)
  startTime: string; // "HH:MM" 24h format, e.g. "09:30"
  category?: string; // e.g. "SIGHTSEEING", "CULTURE", "NATURE", "SHOPPING"
  estimatedDuration?: string;
  imageUrl?: string;
  price?: number;
  ticketLink?: string;
}

export interface Restaurant {
  name: string;
  description: string;
  cuisine?: string;
  priceRange?: string;
  coordinates: Location;
  rating?: number;
  day?: number; // Day of the trip this restaurant is recommended for
  startTime?: string; // "HH:MM" 24h format, e.g. "13:00"
  website?: string;
  imageUrl?: string;
}

export interface TravelPlan {
  destination: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  budget?: number; // Optional budget
  estimatedTotalCost: number;
  currency?: string;
  itinerary: Destination[];
  hotels: Hotel[];
  selectedHotelIndex?: number;
  restaurants?: Restaurant[];
  recommendations?: string[];
}

export interface TravelPlanResponse {
  success: boolean;
  data?: TravelPlan;
  error?: string;
}

