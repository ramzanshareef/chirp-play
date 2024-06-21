import Upload from "./Upload";
import { VideoCard } from "@/app/dashboard/VideoCard";
import { getUserData } from "@root/actions/user/data";
import { getUserVideos, totalStatsofUser } from "@root/actions/user/video";
import { Suspense } from "react";
import { FaRegEye, FaHeart } from "react-icons/fa";
import { RiUserFollowFill } from "react-icons/ri";

export default async function DashboardPage() {
    return (
        <div className="w-full sm:w-11/12 mx-auto p-4 my-2 flex flex-col gap-y-3 sm:gap-y-6">
            <div
                className="flex w-full justify-between items-center max-sm:flex-col max-sm:gap-y-4"
            >
                <Suspense fallback={<UserWithSuspenseFallback />}>
                    <UserWithSuspense />
                </Suspense>
                <Upload />
            </div>
            <div className="flex flex-col gap-y-2 sm:flex-row sm:gap-x-2 sm:gap-y-0">
                <Suspense fallback={<StatsWithSuspenseFallback />}>
                    <StatsWithSuspense />
                </Suspense>
            </div>
            <div>
                <h3 className="mb-4">Your Videos</h3>
                <div className="flex flex-col gap-y-4">
                    <Suspense fallback={<DashboardVideosWithSuspenseFallback />}>
                        <DashboardVideosWithSuspense />
                    </Suspense>
                </div>
            </div>
        </div>
    );

}

export const metadata = {
    title: "Dashboard | ChirpPlay",
    description: "Dashboard page to manage videos",
};

async function UserWithSuspense() {
    let userData = await getUserData();
    return (<div>
        <h2>Welcome back, {userData.user?.name}</h2>
        <p>Track, manage and forecast your vidoes</p>
    </div>);
}

function UserWithSuspenseFallback() {
    return (<div>
        <h2>Welcome back,
            <span className="animate-pulse bg-gray-300 rounded-md h-6 w-32 inline-block"></span>
        </h2>
        <p>Track, manage and forecast your vidoes</p>
    </div>);
}

async function DashboardVideosWithSuspense() {
    let videosData = await getUserVideos();
    return (
        <div className="flex flex-col gap-y-4">
            {videosData?.videos?.map((video, key) => (
                <VideoCard key={key} video={video} />
            ))}
        </div>
    );
}

function DashboardVideosWithSuspenseFallback() {
    return (
        <div className="flex flex-col gap-y-4">
            {[...Array(5)].map((_, index) => (
                <div key={index} className="flex flex-col md:flex-row w-full animate-pulse">
                    <div className="w-full md:w-1/3 bg-gray-300 h-48 rounded-lg"></div>
                    <div className="w-full md:w-2/3 flex flex-col space-y-2 py-3 sm:py-0 px-0 sm:px-3 justify-between">
                        <div className="flex flex-col gap-y-3">
                            <div className="h-6 bg-gray-300 rounded-md w-40"></div>
                            <div className="h-4 bg-gray-300 rounded-md w-64"></div>
                            <div className="flex justify-between item-center">
                                <div className="h-4 bg-gray-300 rounded-md w-12"></div>
                                <div className="h-4 bg-gray-300 rounded-md w-12"></div>
                                <div className="h-4 bg-gray-300 rounded-md w-12"></div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="h-10 bg-gray-300 rounded-md w-10"></div>
                            <div className="h-10 bg-gray-300 rounded-md w-10"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

async function StatsWithSuspense() {
    let data = await totalStatsofUser();
    return (
        <>
            <div
                className="flex justify-evenly items-center text-center bg-white p-4 rounded-lg shadow-lg w-full sm:w-1/3 border-2"
            >
                <div className="w-fit bg-indigo-500 p-2 rounded-full text-center">
                    <FaRegEye className="text-white text-xl" />
                </div>
                <p className="flex flex-col items-center text-center">
                    Total Views: <br />
                    <span className="text-2xl font-bold">
                        {data?.totalViews?.toLocaleString("en-IN")}
                    </span>
                </p>
            </div>
            <div
                className="flex justify-evenly items-center text-center bg-white p-4 rounded-lg shadow-lg w-full sm:w-1/3 border-2"
            >
                <div className="w-fit bg-indigo-500 p-2 rounded-full text-center">
                    <FaHeart className="text-white text-xl" />
                </div>
                <p className="flex flex-col items-center text-center">
                    Total Likes: <br />
                    <span className="text-2xl font-bold">
                        {data?.totalLikes?.toLocaleString("en-IN")}
                    </span>
                </p>
            </div>
            <div
                className="flex justify-evenly items-center text-center bg-white p-4 rounded-lg shadow-lg w-full sm:w-1/3 border-2"
            >
                <div className="w-fit bg-indigo-500 p-2 rounded-full text-center">
                    <RiUserFollowFill className="text-white text-xl" />
                </div>
                <p className="flex flex-col items-center text-center">
                    Total Subscribers: <br />
                    <span className="text-2xl font-bold">
                        {data?.totalSubscribers?.toLocaleString("en-IN")}
                    </span>
                </p>
            </div>
        </>
    );
}

function StatsWithSuspenseFallback() {
    return (
        <>
            <div
                className="flex justify-center items-center gap-x-4 bg-white p-4 rounded-lg shadow-lg w-full sm:w-1/3 border-2"
            >
                <div className="w-fit bg-indigo-500 p-2 rounded-full">
                    <FaRegEye className="text-white text-xl" />
                </div>
                <p>
                    Total Views: <br />
                    <span className="animate-pulse bg-gray-300 rounded-md h-6 w-32 inline-block"></span>
                </p>
            </div>
            <div
                className="flex justify-center items-center gap-x-4 bg-white p-4 rounded-lg shadow-lg w-full sm:w-1/3 border-2"
            >
                <div className="w-fit bg-indigo-500 p-2 rounded-full">
                    <FaHeart className="text-white text-xl" />
                </div>
                <p>
                    Total Likes: <br />
                    <span className="animate-pulse bg-gray-300 rounded-md h-6 w-32 inline-block"></span>
                </p>
            </div>
            <div
                className="flex justify-center items-center gap-x-4 bg-white p-4 rounded-lg shadow-lg w-full sm:w-1/3 border-2"
            >
                <div className="w-fit bg-indigo-500 p-2 rounded-full">
                    <RiUserFollowFill className="text-white text-xl" />
                </div>
                <p>
                    Total Subscribers: <br />
                    <span className="animate-pulse bg-gray-300 rounded-md h-6 w-32 inline-block"></span>
                </p>
            </div>
        </>
    );
}