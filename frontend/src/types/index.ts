// Common TypeScript types for the app
export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  dateOfBirth?: string;
  emailVerified?: boolean;
}

export interface TravelPlan {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
}
