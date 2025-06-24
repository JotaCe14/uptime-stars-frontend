import { StatusBadge } from './StatusBadge';
import { MonitorDto } from '@/api/monitors';
import {Status} from "@/constants/index";

export default function MonitorCard({ monitor }: { monitor: MonitorDto }) {
    function getStatusFromMonitor(monitor: MonitorDto): Status {
        if (monitor.isUp !== null && monitor.isUp !== undefined) {
            return monitor.isActive ? monitor.isUp ? 'Functional' : 'Down' : 'Paused';
        } else {
            return 'Unknown';
        }
    }
    return (
        <a href={`/monitors/${monitor.id}`} className="flex items-center justify-between p-4 bg-white rounded shadow">
            <div>
                <h3 className="font-medium text-gray-500">{monitor.name}</h3>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-md text-gray-500">
                    <span className="block">{monitor.uptime24hPercentage}</span>
                </div>
                <StatusBadge status={getStatusFromMonitor(monitor)} />
            </div>
        </a>
    );
}