
export interface GroupDto {
    id: string;
    name: string;
    description: string;
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

export async function getGroups(
    pageNumber = 1,
    pageSize = 10
): Promise<Paginated<GroupDto>> {
    const url = `/api/group?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    const res = await fetch(url);
    console.log(res);
    if (!res.ok) {
        throw new Error(`Error to fetch groups: ${res.statusText}`);
    }

    return res.json();
}