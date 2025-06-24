import { useQuery } from "@tanstack/react-query";
import { getGroups, GroupDto, Paginated } from '@/api/groups';

export function useGroups(
    pageNumber: number,
    pageSize = 10,) {
  return useQuery<Paginated<GroupDto>, Error>({
        queryKey: ['groups', pageNumber, pageSize],
        queryFn: () => getGroups(pageNumber, pageSize),
        placeholderData: previousData => previousData,
    });
}