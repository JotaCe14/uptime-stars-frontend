export interface CreateMonitorPayload {
    id?: string | null;
    name: string;
    type: 0 | 1;
    target: string;
    intervalInMinutes: number;
    tiemoutInMilliseconds: number;
    alertEmails: string[];
    groupId?: string | null;
    requestHeaders?: string[];
    searchMode: 0 | 1;
    expectedText: string | null;
    alertMessage: string | null;
    alertDelayMinutes: number;
    alertResendCycles: number;
}

export interface MonitorEvent {
    id: string;
    timestampUtc: string;
    isUp: boolean;
    message: string;
    latencyMilliseconds: number;
    falsePositive: boolean;
    category: string;
    note: string;
    ticketId: string;
    maintenanceType: string;
}

export interface MonitorDto {
    id: string;
    name: string;
    description: string;
    target: string;
    createdAtUtc: string;
    isActive: boolean;
    isUp?: boolean | null;
    groupId?: string | null;
    uptime24hPercentage: string;
    uptime30dPercentage: string;
}

export interface Paginated<T> {
    data: T[];
    pageNumber: number;
    pageSize: number;
    totalItemCount: number;
    pageCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export async function getMonitors(
    pageNumber = 1,
    pageSize = 10,
    lastEventsLimit = 1,
): Promise<Paginated<MonitorDto>> {
    const url = `/api/monitor?pageSize=${pageSize}&pageNumber=${pageNumber}&lastEventsLimit=${lastEventsLimit}`;
    const res = await fetch(url);
    console.log(res);
    if (!res.ok) {
        throw new Error(`Error to fetch monitors: ${res.statusText}`);
    }

    return res.json();
}

export async function createMonitor(payload: CreateMonitorPayload): Promise<string> {
    const res = await fetch('/api/monitor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error(`Error to create monitor: ${res.statusText}`);
    }

    return await res.json();
}

export async function enableMonitor(monitorId: string): Promise<void> {
    const res = await fetch(`/api/monitor/enable/${monitorId}`, {
        method: 'POST',
    });
    if (!res.ok) {
        throw new Error(`Error enabling monitor: ${res.statusText}`);
    }
}

export async function disableMonitor(monitorId: string): Promise<void> {
    const res = await fetch(`/api/monitor/disable/${monitorId}`, {
        method: 'POST',
    });
    if (!res.ok) {
        throw new Error(`Error disabling monitor: ${res.statusText}`);
    }
}

export async function deleteMonitor(monitorId: string): Promise<void> {
    const res = await fetch(`/api/monitor/${monitorId}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        throw new Error(`Error deleting monitor: ${res.statusText}`);
    }
}