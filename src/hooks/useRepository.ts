import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as z from 'zod';

const repositorySchema = z.object({
    id: z.number(),
    name: z.string(),
    full_name: z.string(),
    description: z.string().nullable(),
    forks: z.number(),
    stargazers_count: z.number(),
    updated_at: z.string(),
});

export type Repository = z.infer<typeof repositorySchema>

const repositoriesSchema = z.array(repositorySchema)

type RepositoryData = z.infer<typeof repositoriesSchema>;

function useRepositoryList(username: string) {
    const [page, setPage] = useState(1);
    const [repositories, setRepositories] = useState<RepositoryData>([]);
    const [hasMore, setHasMore] = useState(true);
    const [errorCount, setErrorCount] = useState(0);

    const { isLoading, error } = useQuery<RepositoryData, Error>(
        ['repositoryList', page],
        async () => {
            const response = await fetch(
                `https://api.github.com/users/${username}/repos?page=${page}&per_page=25&sort=updated`,
            );

            if (response.status === 404) {
                throw new Error('User not found');
            }

            if (!response.ok) {
                throw new Error('Failed to fetch repositories');
            }

            const data = (await response.json()) as RepositoryData;
            console.log(data);
            repositoriesSchema.parse(data);
            return data;
        },
        {
            onSuccess: (data) => {
                if (data.length === 0) {
                    setHasMore(false);
                } else {
                    setRepositories((prevRepositories) => [
                        ...prevRepositories,
                        ...data,
                    ]);
                }
            },
            onError: (error) => {
                setErrorCount((prevCount) => prevCount + 1);
            },
        },
    );

    function fetchNextPage() {
        setPage((prevPage) => prevPage + 1);
    }

    return { isLoading, error, repositories, fetchNextPage, hasMore };
}


export default useRepositoryList;