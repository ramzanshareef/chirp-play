import Loader from "@/components/loader";
import { VideoCard } from "@/components/video/VideoCard";
import { getUserWatchHistory } from "@root/actions/user/data";
import { isAuthenticated } from "@root/utils/session";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function HistoryPage() {
    let isAuth = await isAuthenticated();
    if (!isAuth) redirect("/");
    const watchHistoryData = await getUserWatchHistory();
    return <Suspense fallback={<Loader />}>
        <h1>History</h1>
        <p>Here are the videos that you have watched</p>
        <div className="flex flex-col -space-y-2 mt-2">
            {watchHistoryData?.watchHistory?.map((video, key) => (
                <VideoCard key={key} video={video} />
            ))}
            {watchHistoryData?.watchHistory?.length === 0 && (
                <div className="flex flex-col items-center justify-center w-full h-screen text-gray-500 text-center">
                    <span className="text-6xl">😢</span>
                    <h3 className="text-black">No videos available</h3>
                    <p>
                        You have not watched any videos yet. Go to the <Link href="/" className="text-indigo-900 underline">Videos</Link> Page to watch some videos.
                    </p>
                </div>
            )}
        </div>
    </Suspense>;
}

export const metadata = {
    title: "My Watch History",
    description: "Watched videos history",
};