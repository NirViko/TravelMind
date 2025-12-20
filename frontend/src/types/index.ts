// Common TypeScript types for the app
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface TravelPlan {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
}
