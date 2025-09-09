import { useEffect, useState } from "react";
import DayCalendar from "./ScheduleView" 
import MonthlyCalendar from "./CalendarView"
import type { CalendarEvent } from "../dataTypes/CalendarEvent";
import type { Calendar } from "../dataTypes/Calendar";
import { API_KEY } from "../App";

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface CalendarProps {
  selectedMonth: number;
  selectedYear: number;
}

interface MainCalendarProps extends CalendarProps {
  calendarType: string;
}

export interface SubCalendarProps extends CalendarProps {
  events: CalendarEvent[]
}

function CalendarPage(props: MainCalendarProps) {
  const CALENDARS: Calendar[] = [
    {id: "gdg@sydney.edu.au", color: "Red"},
    {id: "95e854993053fca2595ef3c80ad9a51316adc9b919c7c07ce6b0505173488d29@group.calendar.google.com", color: "Yellow"},
    {id: "d5e926b60697a7adbe99b063ecbc10c6639b3ffc5bc5ae9a26d78bc3c6b4a0a4@group.calendar.google.com", color: "Green"}
  ];

  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const transformEvent = (raw: any, calendar?: Calendar): CalendarEvent => {
    const isAllDay = !!raw.start.date; // true if "date" exists

    const start = isAllDay
    ? new Date(raw.start.date) // 00:00 local time
    : new Date(raw.start.dateTime);

    // Subtract 1 day from "end.date" because it's exclusive for all-day events
    const end = isAllDay
      ? new Date(new Date(raw.end.date).getTime() - 1)
      : new Date(raw.end.dateTime);

    return {
      id: `${calendar?.id}-${raw.id}`,
      summary: raw.summary || "(No title)",
      start: start,
      end: end,
      colorId: raw.colorId,
      organizer: raw.organizer || "(No organiser)",
      creator: raw.creator || "(No creator)",
      htmlLink: raw.htmlLink,
      hangoutLink: raw.hangoutLink || null,
      description: raw.description || null,
      location: raw.location || null,
      isAllDay: isAllDay,
      calendar: calendar ? calendar : {id: "sample", color: "red"} 
    }
  };

  const fetchEvents = async () => {
    // get access token from backend
    const tokenRes = await fetch("http://localhost:4000/access-token");
    const { access_token } = await tokenRes.json();

    const allEvents: CalendarEvent[] = [];

    for (const calendar of CALENDARS) {
      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar.id)}/events`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`, // 👈 use OAuth, not API key
          },
        }
      );

      const data = await res.json();
      console.log(`Events for ${calendar.id}:`, data);

      const normalized = (data.items || []).map((raw: any) =>
        transformEvent(raw, calendar)
      );
      allEvents.push(...normalized);
    }

    // Optional: sort by start time
    allEvents.sort((a, b) => a.start.getTime() - b.start.getTime());

    setEvents(allEvents);
  };

  useEffect(() => {
    fetchEvents()
  }, []);

  return (
    <div className="p-0 pt-2.5 w-full h-full select-none">{
      (props.calendarType == "calendar") ? (
        <MonthlyCalendar events={events} selectedMonth={props.selectedMonth} selectedYear={props.selectedYear}/>
      ) : <DayCalendar events={events} selectedMonth={props.selectedMonth} selectedYear={props.selectedYear}/>
    }</div>
  )

}

export default CalendarPage
