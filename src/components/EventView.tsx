import { Calendar, MapPin, Video } from "lucide-react";
import { buttonStyle } from "../App";
import type { CalendarEvent } from "../dataTypes/CalendarEvent";
import { dateDisplay, setColor, timeDisplay } from "./CalendarView";

function displayMeetingLink(link: string, platformName: string) {
  return (
    <div className="flex items-center mb-3 gap-2">
      <Video className="mt-2 mb-auto" size={20} />
      <div className="flex flex-col">
        <a href={link} target="_blank" className="mb-1">
          <button className={`${buttonStyle} text-sm px-6 py-1.5`}>
            Join with {platformName}
          </button>
        </a>
        <p className="text-sm text-neutral-500 break-all">
          {link.replace(/^https?:\/\//, "")}
        </p>
      </div>
    </div>
  );
}

function EventView({
  selectedEvent,
  setSelectedEvent,
}: {
  selectedEvent: CalendarEvent;
  setSelectedEvent: (event: CalendarEvent | null) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg w-[90%] max-w-md relative text-left px-7 py-8 pr-12">
        {/* Close button */}
        <button
          onClick={() => setSelectedEvent(null)}
          className="absolute top-5 right-5 text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer"
        >
          ✕
        </button>

        {/* Event Header */}
        <div className="flex items-start mb-4 gap-3">
          <div className={`flex-shrink-0 rounded-full w-4 h-4 mt-2 bg-gdg${setColor(selectedEvent)}`}></div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{selectedEvent.summary}</h2>
            <div className="text-sm text-neutral-700 dark:text-neutral-300 mt-1 flex gap-2 items-center">
              {!selectedEvent.isAllDay ? (
                <>
                  <span>{dateDisplay(selectedEvent.start)}</span>
                  <span>•</span>
                  <span>
                    {timeDisplay(selectedEvent.start)} – {timeDisplay(selectedEvent.end)}
                  </span>
                </>
              ) : (
                <span>{dateDisplay(selectedEvent.start)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Meeting Links */}
        {selectedEvent.hangoutLink && displayMeetingLink(selectedEvent.hangoutLink, "Google Meet")}

        {selectedEvent.location && (
          <>
            {selectedEvent.location.includes(".zoom.us/j/") ? (
              displayMeetingLink(selectedEvent.location, "Zoom")
            ) : (
              <div className="flex items-center gap-2 text-sm mb-3">
                <MapPin size={18} className="flex-shrink-0" />
                <a
                  className="font-bold text-gdgBlue"
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedEvent.location}`}
                  target="_blank"
                >
                  {selectedEvent.location}
                </a>
              </div>
            )}
          </>
        )}

        {/* Organizer & Creator */}
        <div className="flex items-center gap-2 text-sm mb-4">
          <Calendar size={18} className="flex-shrink-0" />
          <div className="flex-1">
            <h2 className="font-semibold">{selectedEvent.organizer.displayName || "Meetings"}</h2>
            <p className="text-xs text-neutral-500 truncate">
              Created by <span className="font-bold">{selectedEvent.creator.email}</span>
            </p>
          </div>
        </div>

        {/* More Details */}
        <div className="mt-4 text-sm text-gdgBlue">
          <a href={selectedEvent.htmlLink} target="_blank">
            More details
          </a>
        </div>
      </div>
    </div>
  );
}

export default EventView;
