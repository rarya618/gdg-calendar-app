import { MONTHS } from "../App"
import type { SubCalendarProps } from "./Calendar"

function DayCalendar(props : SubCalendarProps) {
    return (
      <div>
        <h2 className="text-xl">{MONTHS[props.selectedMonth]} 2025</h2>
        <div className="mt-4 grid grid-cols-3 gap-5">
          {props.events.map((event) => (
            <div className="px-6 py-5 border rounded-md text-left" key={event.id}>
              <h2 className="font-bold text-lg">{event.summary}</h2>
              <p>Start: {event.start.toDateString()}</p>
              <p>End: {event.end.toDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    )
}

export default DayCalendar