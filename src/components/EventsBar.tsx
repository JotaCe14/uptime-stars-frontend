import React from "react";
import type { EventItem } from "../types";

interface EventsBarProps {
  events: EventItem[];
  interval: number;
}

const EventsBar: React.FC<EventsBarProps> = ({ events, interval }) => {
 
 const lastEvents = (events?.slice(-20) || []).reverse();
 
 return (
    <div className="w-full bg-zinc-900 rounded-lg p-6 flex flex-col gap-2">
      <div className="flex flex-row gap-2 justify-between items-center w-full">
        {lastEvents.map((event, idx) => (
          <div
            key={idx}
            className={`flex-1 h-10 rounded-xl ${
              event.isUp ? "bg-green-400" : "bg-red-400"
            } transition-all duration-200`}
            title={event.message || ""}
          />
        ))}
        {Array.from({ length: 20 - lastEvents.length }).map((_, idx) => (
          <div
            key={`empty-${idx}`}
            className="flex-1 h-10 rounded-xl bg-gray-700"
          />
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