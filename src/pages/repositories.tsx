import { NextPage } from "next";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from 'react-toastify';
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/Loading";
import useRepositoryList from "../hooks/useRepository";

const RepositoryListPage: NextPage = () => {
    const router = useRouter();
    const { username } = router.query;
    const { isLoading, error, repositories, fetchNextPage, hasMore } = useRepositoryList(username as string);

    if (error) {
        toast.error(`Error: ${error.message}`);
    }

    return (
        <InfiniteScroll
            dataLength={repositories.length}
            next={fetchNextPage}
            hasMore={hasMore}
            loader={<LoadingSpinner />}
            endMessage={<p>This is the end</p>}
        >
            <div className="min-h-screen min-w-screen bg-gray-100 px-8 pt-8 text-lg font-bold">
                <div>
                    <div>{`${username as string}'s Repositories`}</div>
                </div>
                <hr className="my-6 flex flex-col border-t border-gray-400" />
                <div className="flex flex-col gap-4">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        repositories.map((repository) => (
                            <div
                                key={repository.id}
                                className="flex flex-row items-center"
                            >
                                <h3 className="text-lg flex-1 font-bold">{repository.name}</h3>
                                <div className="text-sm flex-1  text-gray-500">{repository.forks > 0 ? "This Repo is forked" : "This Repo is not forked"}</div>
                                <div className="text-sm flex-1  text-gray-500">
                                    {`${repository.stargazers_count} Stars`}
                                </div>
                                <div className="text-sm text-gray-500">{new Date(repository.updated_at).toLocaleString()}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </InfiniteScroll>
    );
};

export default RepositoryListPage;