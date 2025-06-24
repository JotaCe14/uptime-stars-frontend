'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Status } from "@/constants/index";
import { StatusBadge } from '@/components/StatusBadge';
import { EventEditModal } from '@/components/EventEditModal';
import type { MonitorDetail, EventItem } from "../../../types";
import { ExportEventsButton } from "@/components/ExportEventsButton";
import EventsBar from '@/components/EventsBar';
import { useGroups } from '@/hooks/useGroups';
import { useMonitors } from '@/hooks/useMonitors';

export default function MonitorDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [monitor, setMonitor] = useState<MonitorDetail | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Importa los métodos de acción
    const { enableMonitor, disableMonitor, deleteMonitor, isActionLoading } = useMonitors(1, 20);

    useEffect(() => {
        if (!id) return;

        let isMounted = true;

        const fetchMonitor = () => {
            fetch(`/api/monitor/${id}?lastEventsLimit=20`)
                .then(res => res.json())
                .then(data => {
                    if (isMounted) setMonitor(data);
                })
                .catch(err => console.error('Error fetching monitor details:', err));
        };

        fetchMonitor();
        const interval = setInterval(fetchMonitor, 5000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
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

    const { data: groupsData } = useGroups(1, 100);

    if (!monitor) return <p>Loading monitor...</p>;

    const group = groupsData?.data?.find(g => g.id === monitor.groupId);

    function getStatusFromMonitor(monitor: MonitorDetail): Status {
        if (monitor.isUp !== null && monitor.isUp !== undefined) {
            return monitor.isActive ? monitor.isUp ? 'Functional' : 'Down' : 'Paused';
        } else {
            return 'Unknown';
        }
    }

    // Botón Pause/Resume
    const handlePauseResume = async () => {
        if (!monitor) return;
        if (monitor.isActive) {
            await disableMonitor(monitor.id);
        } else {
            await enableMonitor(monitor.id);
        }
    };

    // Botón Update
    const handleUpdate = () => {
        if (!monitor) return;
        router.push(`/monitors/${monitor.id}/edit`);
    };

    // Botón Remove
    const handleRemove = async () => {
        if (!monitor) return;
        if (window.confirm('Are you sure you want to remove this monitor?')) {
            await deleteMonitor(monitor.id);
            router.push('/dashboard');
        }
    };

    return (
        <div className="p-6 text-white">
            <h1 className="text-4xl font-bold mb-2">{monitor.name}</h1>

            {group && (
                <div className="text-lg text-blue-300 font-semibold mb-4">
                    Group: {group.name}
                </div>
            )}

            <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">Description: {monitor.description}</span>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">Target:</span>
                <a
                    href={monitor.target}
                    className="text-blue-400 underline block"
                    target="_blank"
                    rel="noreferrer"
                >
                    {monitor.target}
                </a>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">Current Status:</span>
                <StatusBadge status={getStatusFromMonitor(monitor)} />
            </div>

            <div className="flex items-center gap-2 mb-4 flex-wrap">
                <ExportEventsButton monitorId={monitor.id} monitorName={monitor.name} />
                <button
                    onClick={async () => {
                        await handlePauseResume();
                        router.refresh();
                    }}
                    className={`px-4 py-2 rounded font-semibold flex items-center gap-2 shadow ${
                        monitor.isActive
                            ? "bg-purple-500 hover:bg-purple-600 text-white"
                            : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                    disabled={isActionLoading}
                >
                    {monitor.isActive ? (
                        <>
                            {/* Pause Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                            </svg>
                            Pause
                        </>
                    ) : (
                        <>
                            {/* Play Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <polygon points="5,3 19,12 5,21" fill="currentColor" />
                            </svg>
                            Resume
                        </>
                    )}
                </button>
                <button
                    onClick={handleUpdate}
                    className="px-4 py-2 rounded font-semibold flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white shadow"
                >
                    {/* Pencil Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2H7v-2l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Update
                </button>
                <button
                    onClick={async () => {
                        await handleRemove();
                        router.push('/dashboard');
                    }}
                    className="px-4 py-2 rounded font-semibold flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white shadow"
                    disabled={isActionLoading}
                >
                    {/* Trash Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Remove
                </button>
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
                    <th className="border border-zinc-700 p-2">Message</th>
                    <th className="border border-zinc-700 p-2">FalsePositive</th>
                    <th className="border border-zinc-700 p-2">Note</th>
                    <th className="border border-zinc-700 p-2">Category</th>
                    <th className="border border-zinc-700 p-2">MaintenanceType</th>
                    <th className="border border-zinc-700 p-2">Ticket</th>
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
                        <td className="border border-zinc-700 p-2">{event.message || '-'}</td>
                        <td className="border border-zinc-700 p-2">{event.falsePositive ? "Yes": "No"}</td>
                        <td className="border border-zinc-700 p-2">{event.note || '-'}</td>
                        <td className="border border-zinc-700 p-2">{event.category || '-'}</td>
                        <td className="border border-zinc-700 p-2">{event.maintenanceType || '-'}</td>
                        <td className="border border-zinc-700 p-2">{event.ticketId || '-'}</td>
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