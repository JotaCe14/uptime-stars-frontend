import React from "react";
import type { EventItem } from "../types";

interface EventsBarProps {
  events: EventItem[];
  interval: number;
}

const EventsBar: React.FC<EventsBarProps> = ({ events, interval }) => {
 
 const lastEvents = (events || []).slice(0, 20).reverse();

 console.log("Last events:", lastEvents);

 let emptyCount = 0;

 if (lastEvents.length < 20) {
    emptyCount = 20 - lastEvents.length;
 }

 return (
    <div className="w-full bg-zinc-900 rounded-lg p-6 flex flex-col gap-2">
      <div className="flex flex-row gap-2 justify-end items-center w-full">
        {Array.from({ length: emptyCount }).map((_, idx) => (
          <div
            key={`empty-${idx}`}
            className="flex-1 h-10 rounded-xl bg-gray-700"
          />
        ))}
        {lastEvents.map((event, idx) => (
          <div key={idx} className="flex-1 flex justify-center min-w-0 relative group">
            <div
              className={`h-10 w-full rounded-xl ${
                event.isUp ? "bg-green-400" : "bg-red-400"
              } transition-all duration-200`}
            />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-12 z-10 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-pre-line min-w-max text-center pointer-events-none">
              {event.timestampUtc}
              {event.message && (
                <>
                  <br />
                  {event.message}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-between text-gray-400 text-sm mt-2">
        <span>{`Check every ${interval} minutes`}</span>
        <span>now</span>
      </div>
    </div>
  );
};

export default EventsBar;