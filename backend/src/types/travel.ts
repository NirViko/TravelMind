// Travel plan types
export interface TravelPlanRequest {
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  destination: string; // e.g., "Paris, France"
  budget: number; // Budget in USD
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Hotel {
  name: string;
  description: string;
  bookingLinks: {
    booking?: string;
    expedia?: string;
    agoda?: string;
    hotels?: string;
  };
  estimatedPrice?: number; // Price per night in USD
}

export interface Destination {
  title: string;
  description: string;
  coordinates: Location;
  visitOrder: number; // Order in the itinerary
  estimatedDuration?: string; // e.g., "2 hours", "Half day"
  imageUrl?: string; // URL to destination image
  price?: number; // Entry price if applicable
  ticketLink?: string; // Link to buy tickets
}

export interface Restaurant {
  name: string;
  description: string;
  cuisine?: string; // e.g., "Italian", "French", "Asian"
  priceRange?: string; // e.g., "$$", "$$$"
  coordinates: Location;
  rating?: number; // 1-5
  website?: string;
  imageUrl?: string;
}

export interface TravelPlan {
  destination: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  budget: number;
  estimatedTotalCost: number;
  currency?: string; // Currency code (USD, EUR, etc.)
  itinerary: Destination[];
  hotels: Hotel[]; // Multiple hotel options
  selectedHotelIndex?: number; // Index of selected hotel
  restaurants?: Restaurant[]; // Restaurant recommendations
  recommendations?: string[];
}

export interface TravelPlanResponse {
  success: boolean;
  data?: TravelPlan;
  error?: string;
}

