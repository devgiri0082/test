import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as z from 'zod';

const contributorSchema = z.object({
    login: z.string(),
    id: z.number(),
    node_id: z.string(),
    avatar_url: z.string().url(),
    gravatar_id: z.string(),
    url: z.string().url(),
    html_url: z.string().url(),
    followers_url: z.string().url(),
    following_url: z.string().url(),
    gists_url: z.string().url(),
    starred_url: z.string().url(),
    subscriptions_url: z.string().url(),
    organizations_url: z.string().url(),
    repos_url: z.string().url(),
    events_url: z.string().url(),
    received_events_url: z.string().url(),
    type: z.string(),
    site_admin: z.boolean(),
    contributions: z.number(),
});

export type Contributor = z.infer<typeof contributorSchema>

const contributorsSchema = z.array(contributorSchema)

type ContributorData = z.infer<typeof contributorsSchema>;

function useContributors() {
    const [page, setPage] = useState(1);
    const [contributors, setContributors] = useState<ContributorData>([]);
    const [hasMore, setHasMore] = useState(true);
    const [errorCount, setErrorCount] = useState(0);

    const { isLoading, error } = useQuery<ContributorData, Error>(
        ['repoData', page],
        async () => {
            const response = await fetch(
                `https://api.github.com/repos/angular/angular/contributors?page=${page}&per_page=25&sort=contributions`,
            );
            if (response.status === 403) {
                console.log
                throw new Error('Rate limit exceeded');
            }

            if (response.status === 404) {
                throw new Error('Repository not found');
            }

            if (!response.ok) {
                throw new Error('Failed to fetch contributors');
            }

            const data = (await response.json()) as ContributorData;
            contributorsSchema.parse(data);
            return data;
        },
        {
            onSuccess: (data) => {
                if (data.length === 0) {
                    setHasMore(false);
                } else {
                    setContributors((prevContributors) => [
                        ...prevContributors,
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

    return { isLoading, error, contributors, fetchNextPage, hasMore };
}

export default useContributors;