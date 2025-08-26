import { useEffect, useState } from "react";
import DayCalendar from "./DayCalendar" 
import MonthlyCalendar from "./MonthlyCalendar"

export interface CalendarEvent {
  id: string;
  summary: string;
  start: Date;
  end: Date;
}

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

function Calendar(props: MainCalendarProps) {
  const CLIENT_ID = "120885392007-pv88s7t88vgtck8b9gq84g51i5ghdfcg.apps.googleusercontent.com";
  const API_KEY = "AIzaSyAwSbdyT1fnPmavu0h7C_k_riKRvHlTxjQ"; // optional, for read-only requests

  const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

  const [token, setToken] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const handleLogin = async () => {
    const google = (window as any).google;

    if (!google || !google.accounts) {
      alert("Google Identity Services not loaded.");
      return;
    }

    // Initialize OAuth client
    const client = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (response: any) => {
        setToken(response.access_token);
      },
    });

    client.requestAccessToken();
  };

  const transformEvent = (raw: any): CalendarEvent => ({
    id: raw.id,
    summary: raw.summary || "(No title)",
    start: new Date(raw.start.dateTime || raw.start.date),
    end: new Date(raw.end.dateTime || raw.end.date),
  });

  const fetchEvents = async () => {
    if (!token) {
      alert("Please sign in first.");
      return;
    }

    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?key=${API_KEY}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    const normalizedEvents = (data.items || []).map(transformEvent);
    setEvents(normalizedEvents);
  };

  useEffect(() => {
    handleLogin();
  }, [])

  useEffect(() => {
    if (token)
      fetchEvents();
  }, [token])

  return (
    <div className="p-4">
      {token ? (<>
        {
          (props.calendarType == "month") ? (
            <MonthlyCalendar events={events} selectedMonth={props.selectedMonth} selectedYear={props.selectedYear}/>
          ) : <DayCalendar events={events} selectedMonth={props.selectedMonth} selectedYear={props.selectedYear}/>
        }
      </>) : null}
    </div>
  )

}

export default Calendar
