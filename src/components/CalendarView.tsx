import { useState } from "react";
import { DAYS, type SubCalendarProps } from "./CalendarPage"
import { type CalendarEvent } from "../dataTypes/CalendarEvent";
import EventView from "./EventView";
import { MONTHS } from "../App";
import type { CalendarDay } from "../dataTypes/CalendarDay";

export function setColor(ev: CalendarEvent) {
  return ev.calendar.color ? ev.calendar.color : "Blue"
}

export function dateDisplay(date: Date) {
  let dayOfTheWeek = date.getDay()
  dayOfTheWeek = dayOfTheWeek === 0 ? 6 : dayOfTheWeek - 1
  let day = date.getDate()
  let month = date.getMonth() + 1
  let year = date.getFullYear()

  return `${DAYS[dayOfTheWeek]}, ${day} ${MONTHS[month]} ${year == (new Date().getFullYear()) ? "" : year}`
}

export function timeDisplay(date: Date) {
  let hours = date.getHours() % 12
  if (hours == 0) 
    hours = 12
  
  let minutes = date.getMinutes()
  
  let extension = date.getHours() >= 12 ? "pm" : "am"

  if (minutes == 0) 
    return `${hours}${extension}`

  let minutesString = minutes.toString().padStart(2, "0");
  return `${hours}:${minutesString}${extension}`
}

function generateMonthMatrix(
  year: number,
  month: number,
  events: CalendarEvent[]
): CalendarDay[][] {
  const firstDay = new Date(year, month - 1, 1);

  // Shift so Monday is start of week
  const startOffset = (firstDay.getDay() + 6) % 7;
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - startOffset);

  const matrix: CalendarDay[][] = [];

  // Always 42 days (6 weeks × 7 days)
  for (let i = 0; i < 42; i++) {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + i);

    const dayEvents = events
      .filter(
        (e) =>
          e.start.getFullYear() === current.getFullYear() &&
          e.start.getMonth() === current.getMonth() &&
          e.start.getDate() === current.getDate()
      )
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    const weekIndex = Math.floor(i / 7);
    if (!matrix[weekIndex]) matrix[weekIndex] = [];
    matrix[weekIndex].push({ date: current, events: dayEvents });
  }

  return matrix;
}

function isToday(day: Date) {
  let today = new Date()

  if (day.getDate() != today.getDate()) { 
    return false
  }

  if (day.getMonth() != today.getMonth()) {
    return false
  } 
  
  if (day.getFullYear() != today.getFullYear()) {
    return false
  }

  return true
}


function MonthlyCalendar(props: SubCalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  const monthMatrix: CalendarDay[][] = generateMonthMatrix(
    props.selectedYear,
    props.selectedMonth,
    props.events
  );

  return (
    <>
      <div className="flex flex-col rounded-md border border-gdgBlue overflow-hidden w-full h-full">
        {/* Fixed days-of-week header */}
        <div className="grid grid-cols-7 bg-gdgBlue text-white dark:text-neutral-900 font-bold flex-none">
          {DAYS.map((day) => (
            <div key={day} className="py-1.5 text-xs text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Scrollable calendar body */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-rows-6 grid-cols-7 gap-px bg-neutral-300 dark:bg-neutral-700 h-full">
            {monthMatrix.flat().map((day) => (
              <div
                key={day.date.toDateString()}
                className={`bg-white dark:bg-neutral-900 p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800
                  ${
                    day.date.getMonth() + 1 === props.selectedMonth
                      ? "text-neutral-900 dark:text-neutral-200"
                      : "text-neutral-400 dark:text-neutral-600"
                  }
                  flex flex-col relative
                `}
              >
                {/* Date number */}
                <div className="text-right text-sm font-semibold mr-1">
                  <div
                    className={`ml-auto rounded-full w-6 px-1 py-0.5 ${
                      isToday(day.date)
                        ? "bg-gdgBlue text-center text-neutral-100 dark:text-neutral-900"
                        : ""
                    }`}
                  >
                    {day.date.getDate()}
                  </div>
                </div>

                {/* Events list with fixed gradient */}
                <div className="flex-1 relative">
                  {/* Scrollable event list */}
                  <div className="absolute inset-0 overflow-y-auto no-scrollbar space-y-0.5 pr-1">
                    {day.events.map((ev) => (
                      <div
                        key={ev.id}
                        className={`flex items-center text-xs ${
                          ev.isAllDay
                            ? `bg-gdg${setColor(ev)} rounded-sm text-white dark:text-neutral-900 hover:opacity-80`
                            : `border border-l-3 border-r-0 border-t-0 border-b-0 border-gdg${setColor(ev)} hover:rounded-r-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 `
                        } px-1 cursor-pointer`}
                        onClick={() => setSelectedEvent(ev)}
                      >
                        <span className="truncate">
                          {!ev.isAllDay ? `${timeDisplay(ev.start)} ` : null}
                          <span className="ml-0.5 font-bold">{ev.summary}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Fixed fade-out gradient */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent" />
                
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedEvent && (
        <EventView selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} />
      )}
    </>
  );
}


export default MonthlyCalendar