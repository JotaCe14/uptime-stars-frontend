'use client';
import { useParams } from 'next/navigation';
import { MonitorForm } from '@/components/MonitorForm';

export default function EditMonitorPage() {
    const { id } = useParams() as { id: string };
    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Edit monitor</h1>
            <MonitorForm monitorId={id} />
        </div>
    );
}