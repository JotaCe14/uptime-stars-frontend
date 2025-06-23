'use client';
import React, { useEffect, useState } from 'react';
import { statusMap } from '../constants';

type StatusKey = keyof typeof statusMap;

interface StatsBarProps {
    stats: Record<StatusKey, number>;
}

export const StatsBar = ({ stats }: StatsBarProps) => {
    const [animatedStats, setAnimatedStats] = useState<Record<StatusKey, number>>(() =>
        Object.fromEntries(Object.keys(stats).map(key => [key, 0])) as Record<StatusKey, number>
    );

    useEffect(() => {
        const duration = 500;
        const steps = 20;
        const interval = duration / steps;

        let step = 0;

        const timer = setInterval(() => {
            step++;
            setAnimatedStats(() =>
                Object.fromEntries(
                    Object.entries(stats).map(([key, target]) => {
                        const next = Math.round((target / steps) * step);
                        return [key, Math.min(next, target)];
                    })
                ) as Record<StatusKey, number>
            );

            if (step >= steps) clearInterval(timer);
        }, interval);

        return () => clearInterval(timer);
    }, [stats]);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 py-4">
            {Object.entries(animatedStats).map(([key, count]) => (
                <div
                    key={key}
                    className="flex flex-col items-center justify-center p-2 border rounded shadow-sm bg-white"
                >
          <span className={`text-white text-sm px-2 py-1 rounded-full ${statusMap[key as StatusKey]}`}>
            {key}
          </span>
                    <span className="text-xl font-bold text-zinc-800">{count}</span>
                </div>
            ))}
        </div>
    );
};
