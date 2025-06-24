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
    monitorId: string;
    monitorName: string;
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

export async function getImportantEvents(
    pageNumber = 1,
    pageSize = 100,
    monitorId?: string | null,
): Promise<Paginated<MonitorEvent>> {
    let url = `/api/event?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    url += monitorId ? `&monitorId=${monitorId}` : '';
    const res = await fetch(url);
    console.log(res);
    if (!res.ok) {
        throw new Error(`Error to fetch important events: ${res.statusText}`);
    }

    return res.json();
}