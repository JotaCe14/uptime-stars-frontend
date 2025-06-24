'use client';

import { useEvents } from '@/hooks/useEvents';
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
    
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [selectedMonitorId, setSelectedMonitorId] = useState<string | null>(null);
    const { data, isLoading, isError } = useEvents(pageNumber, pageSize, selectedMonitorId, { refetchInterval: 5000 });

    if (isLoading) return <p>Loading recent events...</p>;
    if (isError || !data) return <p className="text-red-500">Failed to load events</p>;

    const totalPages = data?.pageCount ?? 1;
    const totalItems = data?.totalItemCount ?? 0;

    const allEvents: EventItem[] = data.data.map(event => ({
        id: event.id,
        name: event.monitorName || "",
        monitorId: event.monitorId,
        status: event.isUp ? 'Functional' : 'Down',
        timestamp: event.timestampUtc,
        message: event.message || 'No message',
    }));

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
                    {allEvents.map(event => (
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
            <div className="flex items-center justify-between mt-4">
                <div>
                    Page {data.pageNumber} of {totalPages} (Total Pages: {totalItems})
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
                        disabled={pageNumber <= 1}
                        className="px-3 py-1 rounded bg-zinc-700 text-grey-500 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setPageNumber((prev) => Math.min(totalPages, prev + 1))}
                        disabled={pageNumber >= totalPages}
                        className="px-3 py-1 rounded bg-zinc-700 text-grey-500 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
                <div>
                    <select
                        value={pageSize}
                        onChange={e => {
                            setPageSize(Number(e.target.value));
                            setPageNumber(1);
                        }}
                        className="text-grey-500 px-2 py-1 rounded"
                    >
                        {[10, 20, 50, 100].map(size => (
                            <option className="text-black" key={size} value={size}>{size} per page</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}