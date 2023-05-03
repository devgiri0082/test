import type { NextPage } from "next";
import Card from "../components/Cards";

import useContributors from "../hooks/useContributors";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from 'react-toastify';
import { useEffect, useState } from "react";
import { userAgent } from "next/server";
import LoadingSpinner from "../components/Loading";

const Home: NextPage = () => {
    const { isLoading, error, contributors, fetchNextPage, hasMore } = useContributors();

    if (error) {
        toast.error(`Error: ${error.message}`);
    }

    return (
        <InfiniteScroll
            dataLength={contributors.length}
            next={fetchNextPage}
            hasMore={hasMore}
            loader={<LoadingSpinner />}
            endMessage={<p>this is the end</p>}

        >

            <div className="min-h-screen min-w-screen bg-gray-100 px-8 pt-8 text-lg font-bold">
                <div>
                    <div>Top Contributors</div>
                </div>
                <hr className="my-6 border-t border-gray-400" />
                <div className="grid place-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {
                        contributors && contributors.map((contributor) => {
                            return (
                                <Card key={contributor.login} user={{ name: contributor.login, image: contributor.avatar_url, repoLink: contributor.repos_url, username: contributor.login, contributions: contributor.contributions }} />
                            )
                        })
                    }
                </div>

            </div>
        </InfiniteScroll>
    );
};

export default Home;