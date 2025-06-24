'use client';

import { useMonitors } from '@/hooks/useMonitors';
import { useState } from 'react';
import { StatusBadge } from './StatusBadge';

interface EventItem {
    id?: string;
    name: string;
    monitorId: string;
    status: 'Functional' | 'Down' | 'Maintenance' | 'Unknown' | 'Paused';
    timestamp: string;
    message: string;
}

export default function EventsTable() {
    const [selectedMonitorId, setSelectedMonitorId] = useState<string | null>(null);
    const { data, isLoading, isError } = useMonitors(1, 100, 10);

    if (isLoading) return <p>Loading recent events...</p>;
    if (isError || !data) return <p className="text-red-500">Failed to load events</p>;

    const monitors = data.data;

    const allEvents: EventItem[] = monitors.flatMap(monitor =>
        monitor.lastImportantEvents.map((event, index) => ({
            id: event.id ?? `${monitor.id}-${index}`,
            name: monitor.name,
            monitorId: monitor.id,
            status: event.isUp ? 'Functional' : 'Down',
            timestamp: event.timestampUtc,
            message: event.message || 'No message',
        }))
    );

    const filteredEvents = selectedMonitorId
        ? allEvents.filter(e => e.monitorId === selectedMonitorId)
        : allEvents;

    const sortedEvents = filteredEvents.slice().sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return (
        <div className="bg-zinc-800 rounded-md p-4 shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recent Events</h2>
                {selectedMonitorId && (
                    <button
                        onClick={() => setSelectedMonitorId(null)}
                        className="text-sm underline text-zinc-300 hover:text-white"
                    >
                        Clear Filter
                    </button>
                )}
            </div>
            <div className="overflow-auto max-h-[600px]">
                <table className="min-w-full text-sm text-left">
                    <thead>
                    <tr className="text-zinc-400 border-b border-zinc-700">
                        <th className="p-2">Name</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Date & Time</th>
                        <th className="p-2">Message</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedEvents.map(event => (
                        <tr
                            key={event.id}
                            className="border-b border-zinc-700 hover:bg-zinc-700/30 cursor-pointer"
                            onClick={() => setSelectedMonitorId(event.monitorId)}
                        >
                            <td className="p-2 font-medium">{event.name}</td>
                            <td className="p-2">
                                <StatusBadge status={event.status} />
                            </td>
                            <td className="p-2">{event.timestamp}</td>
                            <td className="p-2 text-zinc-300">{event.message}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
