'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {Status} from "@/constants/index";
import { StatusBadge } from '@/components/StatusBadge';
import { EventEditModal } from '@/components/EventEditModal';
import type { MonitorDetail, EventItem} from "../../../types";
import {ExportEventsButton} from "@/components/ExportEventsButton";
import EventsBar from '@/components/EventsBar';

export default function MonitorDetailPage() {
    const { id } = useParams() as { id: string };
    const [monitor, setMonitor] = useState<MonitorDetail | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    console.log('params:', useParams());
    useEffect(() => {
        if (!id) return;
        fetch(`/api/monitor/${id}?lastEventsLimit=20`)
            .then(res => res.json())
            .then(setMonitor)
            .catch(err => console.error('Error fetching monitor details:', err));
    }, [id]);

    const handleEditClick = (event: EventItem) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSave = async (data: any) => {
        if (!selectedEvent?.id) return;
        try {
            await fetch(`/api/event/${selectedEvent.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving event:', error);
        }
    };

    if (!monitor) return <p>Loading monitor...</p>;

    function getStatusFromMonitor(monitor: MonitorDetail): Status {
        if (monitor.isUp !== null && monitor.isUp !== undefined) {
            return monitor.isActive ? monitor.isUp ? 'Functional' : 'Down' : 'Paused';
        } else {
            return 'Unknown';
        }
    }   

    return (
        <div className="p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">{monitor.name}</h1>
            <a
                href={monitor.target}
                className="text-blue-400 underline block mb-2"
                target="_blank"
                rel="noreferrer"
            >
                {monitor.target}
            </a>

            <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">Current Status:</span>
                <StatusBadge status={getStatusFromMonitor(monitor)} />
            </div>

            <div className="flex items-center gap-2 mb-4">
                <ExportEventsButton monitorId={monitor.id} monitorName={monitor.name} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-zinc-800 p-4 shadow rounded">
                    <h3 className="text-sm text-gray-400">Latest Response</h3>
                    <p className="text-xl font-bold">
                        {monitor.lastEvents?.[0]?.latencyMilliseconds ?? 'N/A'} ms
                    </p>
                </div>
                <div className="bg-zinc-800 p-4 shadow rounded">
                    <h3 className="text-sm text-gray-400">Uptime (24h)</h3>
                    <p className="text-xl font-bold">{monitor.uptime24hPercentage}</p>
                </div>
                <div className="bg-zinc-800 p-4 shadow rounded">
                    <h3 className="text-sm text-gray-400">Uptime (30d)</h3>
                    <p className="text-xl font-bold">{monitor.uptime30dPercentage}</p>
                </div>
            </div>
                
            <EventsBar events={monitor.lastEvents} interval={monitor.intervalInMinutes} />

            <table className="w-full text-sm border border-zinc-700 bg-zinc-900">
                <thead>
                <tr className="text-zinc-300 bg-zinc-800">
                    <th className="border border-zinc-700 p-2">Status</th>
                    <th className="border border-zinc-700 p-2">Date</th>
                    <th className="border border-zinc-700 p-2">Latency</th>
                    <th className="border border-zinc-700 p-2">Message</th>
                    <th className="border border-zinc-700 p-2">Note</th>
                    <th className="border border-zinc-700 p-2">Action</th>
                </tr>
                </thead>
                <tbody>
                {monitor.lastImportantEvents.map(event => (
                    <tr key={event.id} className="hover:bg-zinc-700/30">
                        <td className="border border-zinc-700 p-2">
                            <StatusBadge status={event.isUp ? 'Functional' : 'Down'} />
                        </td>
                        <td className="border border-zinc-700 p-2">{event.timestampUtc}</td>
                        <td className="border border-zinc-700 p-2">
                            {event.latencyMilliseconds} ms
                        </td>
                        <td className="border border-zinc-700 p-2">{event.message || '-'}</td>
                        <td className="border border-zinc-700 p-2">{event.note || '-'}</td>
                        <td className="border border-zinc-700 p-2">
                            <button
                                onClick={() => handleEditClick(event)}
                                className="text-xs text-yellow-400 border border-yellow-400 rounded px-2 py-0.5"
                            >
                                Edit
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {selectedEvent && (
                <EventEditModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    defaultValues={selectedEvent}
                />
            )}
        </div>
    );
}
