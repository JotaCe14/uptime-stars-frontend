'use client';
import { ExportButton } from '@/components/ExportButton';

const mockEvents = [
    { name: 'Internal', status: 'Functional', date: '2025-06-19 09:20:36', message: 'All children up and running' },
    { name: 'SMTP Server', status: 'Down', date: '2025-06-19 08:52:56', message: 'Child inaccessible' },
];

export default function ReportPage() {
    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Availability Report</h1>
            <table className="w-full border text-sm">
                <thead>
                <tr className="bg-zinc-100">
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Message</th>
                </tr>
                </thead>
                <tbody>
                {mockEvents.map((event, i) => (
                    <tr key={i}>
                        <td className="border px-2 py-1">{event.name}</td>
                        <td className="border px-2 py-1">{event.status}</td>
                        <td className="border px-2 py-1">{event.date}</td>
                        <td className="border px-2 py-1">{event.message}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="mt-4">
                <ExportButton/>
            </div>
        </div>
    );
}