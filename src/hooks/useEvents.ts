import { useQuery } from "@tanstack/react-query";
import { getImportantEvents } from '@/api/events';

export function useEvents(
    pageNumber = 1,
    pageSize = 100,
    monitorId?: string | null) {
  return useQuery({
    queryKey: ["events", pageNumber, pageSize],
    queryFn: async () => getImportantEvents(pageNumber, pageSize, monitorId),
    placeholderData: previousData => previousData,
  });
}