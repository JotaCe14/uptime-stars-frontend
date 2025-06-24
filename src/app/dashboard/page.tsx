'use client';

import { useState } from 'react';
import { useMonitors } from '@/hooks/useMonitors';
import { useGroups } from '@/hooks/useGroups';
import { useMonitorStats } from '@/hooks/useMonitorsStats';

import MonitorCard from '@/components/MonitorCard';
import { StatsBar } from '@/components/StatsBar';
import EventsTable from '@/components/EventsTable';

const defaultStats = {
    Functional: 0,
    Down: 0,
    Maintenance: 0,
    Unknown: 0,
    Paused: 0,
    Pending: 0,
};

export default function DashboardPage() {
    const [page] = useState(1);
    const { data, isLoading, isError } = useMonitors(page, 100);
    const { stats, isLoading: statsLoading, isError: statsError } = useMonitorStats();
    const { data: groups } = useGroups(page, 100);
    
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const monitorsByGroup: Record<string, any[]> = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const monitorsWithoutGroup: any[] = [];

    if (data?.data) {
        data.data.forEach(monitor => {
            if (monitor.groupId) {
                if (!monitorsByGroup[monitor.groupId]) {
                    monitorsByGroup[monitor.groupId] = [];
                }
                monitorsByGroup[monitor.groupId].push(monitor);
            } else {
                monitorsWithoutGroup.push(monitor);
            }
        });
    }

    const UNGROUPED_KEY = "__ungrouped__";

    const toggleGroup = (groupId: string) => {
        setOpenGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId],
        }));
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1 space-y-4 py-4">
                {isLoading ? (
                    <p>Loading monitors...</p>
                ) : isError ? (
                    <p className="text-red-400">Error loading monitors.</p>
                ) : (
                    <>
                        {groups && Object.entries(monitorsByGroup).map(([groupId, monitors]) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const group = groups.data.find((g: any) => g.id === groupId);
                            const isOpen = openGroups[groupId] ?? true;
                            return (
                                <div key={groupId} className="mb-6">
                                    <button
                                        className="font-bold text-lg mb-2 flex items-center gap-2 w-full text-left focus:outline-none"
                                        onClick={() => toggleGroup(groupId)}
                                    >
                                        <span>
                                            {isOpen ? "▼" : "►"}
                                        </span>
                                        {group ? group.name : "Un"}
                                    </button>
                                    {isOpen && (
                                        <div className="space-y-2">
                                            {monitors.map(monitor => (
                                                <MonitorCard key={monitor.id} monitor={monitor} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {monitorsWithoutGroup.length > 0 && (
                            <div className="mb-6">
                                <button
                                    className="font-bold text-lg mb-2 flex items-center gap-2 w-full text-left focus:outline-none text-gray-400"
                                    onClick={() => toggleGroup(UNGROUPED_KEY)}
                                >
                                    <span>
                                        {openGroups[UNGROUPED_KEY] ?? true ? "▼" : "►"}
                                    </span>
                                    Ungrouped
                                </button>
                                {(openGroups[UNGROUPED_KEY] ?? true) && (
                                    <div className="space-y-2">
                                        {monitorsWithoutGroup.map(monitor => (
                                            <MonitorCard key={monitor.id} monitor={monitor} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="xl:col-span-2 space-y-6">
                {statsError ? (
                    <p className="text-red-400">Error loading statistics.</p>
                ) : (
                    <StatsBar stats={statsLoading ? defaultStats : stats} />
                )}
                <EventsTable />
            </div>
        </div>
    );
}
