'use client';

import { useState } from "react";

function formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

export function ExportButton() {
    const now = new Date();

    const [dateFrom, setDateFrom] = useState(formatDate(new Date(now.getFullYear(), now.getMonth(), 1)));
    const [dateTo, setDateTo] = useState(formatDate(now));

    const exportUrl = `https://uptime-stars-backend-api-production.up.railway.app/api/v1/monitor/export?dateFrom=${dateFrom}&dateTo=${dateTo}`;

    const handleDateChange = (setter: (val: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (!val) return setter("");
        const [year, month, day] = val.split("-");
        setter(`${day}/${month}/${year}`);
    };

    const toInputValue = (val: string) => {
        if (!val) return "";
        const [day, month, year] = val.split("/");
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="flex items-center gap-2">
            <input
                type="date"
                value={toInputValue(dateFrom)}
                onChange={handleDateChange(setDateFrom)}
                className="border rounded px-2 py-1 text-grey-500"
            />
            <span className="text-grey-500">to</span>
            <input
                type="date"
                value={toInputValue(dateTo)}
                onChange={handleDateChange(setDateTo)}
                className="border rounded px-2 py-1 text-grey-500"
            />
            <a
                href={exportUrl}
                download={`monitor_export_${dateFrom.replace(/\//g, "_")}_to_${dateTo.replace(/\//g, "_")}.xlsx`}
                target="_blank"
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2"
            >
                Export SLA Report
            </a>
        </div>
    );
}
