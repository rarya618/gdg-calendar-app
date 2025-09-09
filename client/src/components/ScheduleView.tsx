import { useState } from "react";

import type { SubCalendarProps } from "./CalendarPage"
import { dateDisplay, timeDisplay } from "./CalendarView"
import type { CalendarEvent } from "../dataTypes/CalendarEvent";
import EventView from "./EventView";

function DayCalendar(props : SubCalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  const monthEvents = props.events
    .filter(
      (e) =>
        e.start.getFullYear() === props.selectedYear &&
        e.start.getMonth() + 1 === props.selectedMonth
    )
    .sort((a, b) => a.start.getTime() - b.start.getTime());
  
  return (<>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-scroll">
      {monthEvents.map((event) => (
        <div
          key={event.id}
          className={`cursor-pointer px-4.5 py-3 border border-gdg${event.calendar.color} border-l-6 hover:border-l-8 rounded-l-xs rounded-r-lg text-left hover:bg-neutral-200 dark:hover:bg-neutral-800 flex justify-between`}
          onClick={() => setSelectedEvent(event)}
          >
          <div>
            <h2 className={`font-bold truncate text-sm text-gdg${event.calendar.color}`}>{event.summary}</h2>
            <div className="text-xs text-neutral-700 dark:text-neutral-300 mt-1 mb-0.5 flex gap-2 items-center">
              {!event.isAllDay ? (
                <>
                  <span>{dateDisplay(event.start)}</span>
                  <span>•</span>
                  <span>
                    {timeDisplay(event.start)} – {timeDisplay(event.end)}
                  </span>
                </>
              ) : (
                <span>{dateDisplay(event.start)}</span>
              )}
            </div>
          </div>
          <span className={`text-2xs text-white dark:text-neutral-900 rounded-full my-auto px-3 py-1 bg-gdg${event.calendar.color}`}>{event.organizer.displayName || "Meetings"}</span>
        </div>
      ))}
    </div>

    {/* Modal */}
    {selectedEvent && (
      <EventView selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} />
    )}
  </>)
}

export default DayCalendar