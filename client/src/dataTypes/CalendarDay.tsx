import type { CalendarEvent } from "./CalendarEvent";

export interface CalendarDay {
  date: Date;
  events: CalendarEvent[];
}
