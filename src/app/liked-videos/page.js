import Loader from "@/components/loader";
import { VideoCard } from "@/components/video/VideoCard";
import { getUserLikedVideos } from "@root/actions/user/data";
import { isAuthenticated } from "@root/utils/session";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

export default async function LikedVideosPage() {
    let isAuth = await isAuthenticated();
    if (!isAuth) redirect("/");
    let userLikedVideosData = await getUserLikedVideos();
    return <Suspense fallback={<Loader />}>
        <div>
            <h1>Your Liked Videos</h1>
            <p>Here are the videos you have liked</p>
            <div className="flex flex-col -space-y-2 mt-2">
                {userLikedVideosData?.likedVideos?.map((videoData, key) => (
                    <VideoCard key={key} video={videoData.video} />
                ))}
                {userLikedVideosData?.likedVideos?.length === 0 && (
                    <div className="flex flex-col items-center justify-center w-full h-screen text-gray-500 text-center">
                        <span className="text-6xl">😢</span>
                        <h3 className="text-black">No videos available</h3>
                        <p>
                            You have not liked any videos yet. Go to the <Link href="/" className="text-indigo-900 underline">Videos</Link> Page to like some videos.
                        </p>
                    </div>
                )}
            </div>
        </div>
    </Suspense>;
}

export const metadata = {
    title: "My Liked Videos",
    description: "View your liked videos",
};