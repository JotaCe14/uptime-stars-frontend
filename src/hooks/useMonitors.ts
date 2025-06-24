import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getMonitors, 
    MonitorDto, 
    Paginated,
    enableMonitor as enableMonitorApi,
    disableMonitor as disableMonitorApi,
    deleteMonitor as deleteMonitorApi } from '@/api/monitors';

export function useMonitors(
    pageNumber: number,
    pageSize = 10,
    lastEventsLimit = 3
) {
    const queryClient = useQueryClient();

    // Mutations
    const enableMonitor = useMutation({
        mutationFn: (monitorId: string) => enableMonitorApi(monitorId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['monitors'] });
        },
    });

    const disableMonitor = useMutation({
        mutationFn: (monitorId: string) => disableMonitorApi(monitorId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['monitors'] });
        },
    });

    const deleteMonitor = useMutation({
        mutationFn: (monitorId: string) => deleteMonitorApi(monitorId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['monitors'] });
        },
    });

    // Query
    const monitorsQuery = useQuery<Paginated<MonitorDto>, Error>({
        queryKey: ['monitors', pageNumber, pageSize, lastEventsLimit],
        queryFn: () => getMonitors(pageNumber, pageSize, lastEventsLimit),
        placeholderData: previousData => previousData,
    });

    return {
        ...monitorsQuery,
        enableMonitor: enableMonitor.mutateAsync,
        disableMonitor: disableMonitor.mutateAsync,
        deleteMonitor: deleteMonitor.mutateAsync,
        isActionLoading:
            enableMonitor.isPending ||
            disableMonitor.isPending ||
            deleteMonitor.isPending,
    };
}
