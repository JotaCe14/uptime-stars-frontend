'use client';

import { useState } from 'react';
import { useMonitors } from '@/hooks/useMonitors';
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

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1 space-y-4 py-4">
                {isLoading ? (
                    <p>Loading monitors...</p>
                ) : isError ? (
                    <p className="text-red-400">Error loading monitors.</p>
                ) : (
                    data?.data.map(monitor => (
                        <MonitorCard key={monitor.id} monitor={monitor} />
                    ))
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
