import { searchVideos } from "@root/actions/video";
import { Suspense } from "react";
import { VideoCard } from "./VideoCard";

export default async function SearchPage({ searchParams }) {
    const searchedData = await searchVideos(searchParams.q);
    return (
        <Suspense>
            <div className="flex flex-col -space-y-2">
                {searchedData?.videos?.map((video, key) => (
                    <VideoCard key={key} video={video} />
                ))}
                {searchedData?.videos?.length === 0 && (
                    <div className="flex flex-col items-center justify-center w-full h-screen text-gray-500 text-center">
                        <span className="text-6xl">😢</span>
                        <h3 className="text-black">No videos available</h3>
                        <p>There are no videos here available for your search query. <br /> Please try to search for something else.</p>
                    </div>
                )}
            </div>
        </Suspense>
    );
}