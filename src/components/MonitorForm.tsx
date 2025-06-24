'use client';

import {useState, useEffect } from 'react';
import {createMonitor} from '@/api/monitors';
import {useRouter} from 'next/navigation';
import { useGroups } from '@/hooks/useGroups';
import { GroupDto } from '@/api/groups';

export const MonitorForm = ({ monitorId }: { monitorId?: string | null }) => {
    
    const router = useRouter();

    const { data: groupsData } = useGroups(1, 100);

    const [form, setForm] = useState({
        type: 'HTTPS',
        name: '',
        target: '',
        intervalInMinutes: 1,
        tiemoutInMilliseconds: 1000,
        alertEmails: '',
        requestHeaders: '',
        description: '',
        groupId: '',
        searchMode: '0',
        expectedText: '',
        alertMessage: '',
        alertDelayMinutes: 0,
        alertResendCycles: 0,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => {
        const {name, value} = e.target;
        setForm(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const payload = {
                name: form.name,
                type: form.type === 'PING' ? 0 as const : 1 as const,
                target: form.target,
                intervalInMinutes: Number(form.intervalInMinutes),
                tiemoutInMilliseconds: Number(form.tiemoutInMilliseconds),
                alertEmails: form.alertEmails
                    .split(',')
                    .map(email => email.trim())
                    .filter(Boolean),
                requestHeaders: form.requestHeaders
                    .split(',')
                    .map(header => header.trim())
                    .filter(Boolean),
                description: form.description,
                groupId: form.groupId || null,
                searchMode: Number(form.searchMode) as 0 | 1,
                expectedText: form.expectedText || null,
                alertMessage: form.alertMessage || null,
                alertDelayMinutes: Number(form.alertDelayMinutes),
                alertResendCycles: Number(form.alertResendCycles),
            };

            if (monitorId) {
                const res = await fetch(`/api/monitor/${monitorId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) throw new Error('Error updating monitor');
                router.push(`/monitors/${monitorId}`);
            }
            else {
                const newId = await createMonitor(payload);
                router.push(`/monitors/${newId}`);
            }
        } catch (err) {
            console.error('Error creating monitor:', err);
            alert('The monitor could not be created. Check the console..');
        }
    };

    useEffect(() => {
        if (!monitorId) return;
        fetch(`/api/monitor/${monitorId}`)
            .then(res => res.json())
            .then(data => {
                setForm({
                    type: data.type === 0 ? 'PING' : 'HTTPS',
                    name: data.name ?? '',
                    target: data.target ?? '',
                    intervalInMinutes: data.intervalInMinutes ?? 1,
                    tiemoutInMilliseconds: data.tiemoutInMilliseconds ?? 1000,
                    alertEmails: Array.isArray(data.alertEmails) ? data.alertEmails.join(', ') : '',
                    requestHeaders: Array.isArray(data.requestHeaders) ? data.requestHeaders.join(', ') : '',
                    description: data.description ?? '',
                    groupId: data.groupId ?? '',
                    searchMode: typeof data.searchMode === 'number' ? String(data.searchMode) : '0',
                    expectedText: data.expectedText ?? '',
                    alertMessage: data.alertMessage ?? '',
                    alertDelayMinutes: data.alertDelayMinutes ?? 0,
                    alertResendCycles: data.alertResendCycles ?? 0,
                });
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monitorId]);

    return (
        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-w-5xl mx-auto"
        >
            <div>
                <label className="block mb-1">Name</label>
                <input
                    type="text"
                    name="name"
                    onChange={handleChange}
                    value={form.name}
                    className="w-full border rounded p-2"
                    required
                />
            </div>

            <div>
                <label className="block mb-1">Group</label>
                <select
                    name="groupId"
                    onChange={handleChange}
                    value={form.groupId}
                    className="w-full border rounded p-2 text-gray-500"
                >
                    <option value="">No group</option>
                    {groupsData?.data?.map((group: GroupDto) => (
                        <option key={group.id} value={group.id}>
                            {group.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block mb-1">Monitor type</label>
                <select
                    name="type"
                    onChange={handleChange}
                    value={form.type}
                    className="w-full border rounded p-2 text-gray-500"
                >
                    <option value="HTTPS">HTTP(s)</option>
                    <option value="PING">Ping</option>
                </select>
            </div>

            <div>
                <label className="block mb-1">Target URL / IP</label>
                <input
                    type="text"
                    name="target"
                    onChange={handleChange}
                    value={form.target}
                    className="w-full border rounded p-2"
                    required
                />
            </div>

            <div>
                <label className="block mb-1">Interval (minutes)</label>
                <input
                    type="number"
                    name="intervalInMinutes"
                    onChange={handleChange}
                    value={form.intervalInMinutes}
                    className="w-full border rounded p-2"
                    min={1}
                />
            </div>

            <div>
                <label className="block mb-1">Timeout (milliseconds)</label>
                <input
                    type="number"
                    name="tiemoutInMilliseconds"
                    onChange={handleChange}
                    value={form.tiemoutInMilliseconds}
                    className="w-full border rounded p-2"
                    min={100}
                />
            </div>

            <div className="md:col-span-2">
                <label className="block mb-1">Request headers (comma-separated)</label>
                <input
                    type="text"
                    name="requestHeaders"
                    onChange={handleChange}
                    value={form.requestHeaders}
                    className="w-full border rounded p-2"
                    placeholder="Header1: value1, Header2: value2"
                />
            </div>

            <div>
                <label className="block mb-1">Search mode</label>
                <select
                    name="searchMode"
                    onChange={handleChange}
                    value={form.searchMode}
                    className="w-full border rounded p-2 text-gray-500"
                >
                    <option value="0">Includes</option>
                    <option value="1">Excludes</option>
                </select>
            </div>

            <div>
                <label className="block mb-1">Expected text</label>
                <input
                    type="text"
                    name="expectedText"
                    onChange={handleChange}
                    value={form.expectedText}
                    className="w-full border rounded p-2"
                />
            </div>

        
            <div className="md:col-span-2">
                <label className="block mb-1">Alert emails (comma-separated)</label>
                <input
                    type="text"
                    name="alertEmails"
                    onChange={handleChange}
                    value={form.alertEmails}
                    className="w-full border rounded p-2"
                    placeholder="user@example.com, admin@example.com"
                />
            </div>          

            <div className="md:col-span-2">
                <label className="block mb-1">Alert message</label>
                <textarea
                    name="alertMessage"
                    onChange={handleChange}
                    value={form.alertMessage}
                    className="w-full border rounded p-2"
                    rows={3}
                />
            </div>

            <div>
                <label className="block mb-1">Alert delay (minutes)</label>
                <input
                    type="number"
                    name="alertDelayMinutes"
                    onChange={handleChange}
                    value={form.alertDelayMinutes}
                    className="w-full border rounded p-2"
                    min={0}
                />
            </div>

            <div>
                <label className="block mb-1">Alert resend cycles</label>
                <input
                    type="number"
                    name="alertResendCycles"
                    onChange={handleChange}
                    value={form.alertResendCycles}
                    className="w-full border rounded p-2"
                    min={0}
                />
            </div>

            <div className="md:col-span-2">
                <label className="block mb-1">Description</label>
                <textarea
                    name="description"
                    onChange={handleChange}
                    value={form.description}
                    className="w-full border rounded p-2"
                    rows={3}
                />
            </div>

            <div className="md:col-span-2">
                <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full md:w-auto"
                >
                    Save
                </button>
            </div>
        </form>
    );  
};
