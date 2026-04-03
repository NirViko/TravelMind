import { useMemo } from "react";
import { TravelPlan, Destination, Restaurant } from "../../../types/travel";
import {
  getCalendarDateForDay,
  formatDisplayTime,
  TRANSIT_LABELS,
  TransitLabel,
} from "../../../utils/itineraryTime";

export interface TimelineItem {
  id: string;
  type: "destination" | "restaurant";
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  timeLabel: string; // "09:30 AM"
  sortTime: string;  // "HH:MM" for sorting
  duration?: string;
  rating?: number;
  visitOrder?: number; // for destination tap → detail card
}

interface UseNocturnalItineraryProps {
  travelPlan: TravelPlan;
  selectedDayIndex: number; // 0-based
}

interface UseNocturnalItineraryResult {
  dayDates: Date[];
  timelineItems: TimelineItem[];
  transitLabels: TransitLabel[];
  totalDays: number;
}

export function useNocturnalItinerary({
  travelPlan,
  selectedDayIndex,
}: UseNocturnalItineraryProps): UseNocturnalItineraryResult {
  const totalDays = travelPlan.totalDays;

  // Build one Date per day of the trip
  const dayDates = useMemo<Date[]>(() => {
    return Array.from({ length: totalDays }, (_, i) =>
      getCalendarDateForDay(travelPlan.startDate, i + 1)
    );
  }, [travelPlan.startDate, totalDays]);

  // Build the timeline items for the selected day (1-based dayNumber)
  const timelineItems = useMemo<TimelineItem[]>(() => {
    const dayNumber = selectedDayIndex + 1;

    // Destinations for this day
    const dayDestinations: TimelineItem[] = travelPlan.itinerary
      .filter((d: Destination) => d.day === dayNumber)
      .map((d: Destination) => ({
        id: `dest-${d.visitOrder}`,
        type: "destination" as const,
        title: d.title,
        description: d.description,
        imageUrl: d.imageUrl,
        category: d.category ?? "SIGHTSEEING",
        timeLabel: formatDisplayTime(d.startTime),
        sortTime: d.startTime,
        duration: d.estimatedDuration,
        visitOrder: d.visitOrder,
      }));

    // Restaurants assigned to this day
    const dayRestaurants: TimelineItem[] = (travelPlan.restaurants ?? [])
      .filter((r: Restaurant) => r.day === dayNumber)
      .map((r: Restaurant, i: number) => ({
        id: `rest-${dayNumber}-${i}`,
        type: "restaurant" as const,
        title: r.name,
        description: r.description,
        imageUrl: r.imageUrl,
        category: "FOOD",
        timeLabel: r.startTime ? formatDisplayTime(r.startTime) : "13:00 PM",
        sortTime: r.startTime ?? "13:00",
        duration: undefined,
        rating: r.rating,
      }));

    // Merge and sort by startTime
    const merged = [...dayDestinations, ...dayRestaurants].sort((a, b) =>
      a.sortTime.localeCompare(b.sortTime)
    );

    return merged;
  }, [travelPlan, selectedDayIndex]);

  // Transit labels between each pair of consecutive items
  const transitLabels = useMemo<TransitLabel[]>(
    () =>
      timelineItems.slice(0, -1).map((_, i) => TRANSIT_LABELS[i % TRANSIT_LABELS.length]),
    [timelineItems]
  );

  return { dayDates, timelineItems, transitLabels, totalDays };
}
