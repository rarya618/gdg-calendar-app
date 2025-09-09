import type { Calendar } from "./Calendar";

export interface CalendarEvent {
  id: string;
  summary: string;
  start: Date;
  end: Date;
  colorId: string;
  organizer: {
    email: string;
    displayName?: string;
    self: boolean;
  };
  creator: {
    email: string;
    self: boolean;
  }
  htmlLink: string;
  hangoutLink?: string;
  description?: string;
  location?: string;
  isAllDay: boolean;
  calendar: Calendar
}