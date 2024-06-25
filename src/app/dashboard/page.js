import VideoUploadButton from "./Upload";
import { VideoCard } from "@/app/dashboard/VideoCard";
import { getDashboardData } from "@root/actions/user/data";
import { FaRegEye, FaHeart } from "react-icons/fa";
import { RiUserFollowFill } from "react-icons/ri";

export default async function DashboardPage() {
    const { userData } = await getDashboardData();
    return (
        <div className="w-full sm:w-11/12 mx-auto p-4 my-2 flex flex-col gap-y-3 sm:gap-y-6">
            <div
                className="flex w-full justify-between items-center max-sm:flex-col max-sm:gap-y-4"
            >
                <div>
                    <h2>Welcome back, {userData?.name}</h2>
                    <p>Track, manage and forecast your vidoes</p>
                </div>
                <VideoUploadButton />
            </div>
            <div className="flex flex-col gap-y-2 sm:flex-row sm:gap-x-2 sm:gap-y-0">
                <div className="flex justify-evenly items-center text-center bg-white p-4 rounded-lg shadow-lg w-full sm:w-1/3 border-2">
                    <div className="w-fit bg-indigo-500 p-2 rounded-full text-center">
                        <FaRegEye className="text-white text-xl" />
                    </div>
                    <p className="flex flex-col items-center text-center">
                        Total Views: <br />
                        <span className="text-2xl font-bold">
                            {userData?.totalViews?.toLocaleString("en-IN")}
                        </span>
                    </p>
                </div>
                <div className="flex justify-evenly items-center text-center bg-white p-4 rounded-lg shadow-lg w-full sm:w-1/3 border-2">
                    <div className="w-fit bg-indigo-500 p-2 rounded-full text-center">
                        <FaHeart className="text-white text-xl" />
                    </div>
                    <p className="flex flex-col items-center text-center">
                        Total Likes: <br />
                        <span className="text-2xl font-bold">
                            {userData?.totalLikes?.toLocaleString("en-IN")}
                        </span>
                    </p>
                </div>
                <div className="flex justify-evenly items-center text-center bg-white p-4 rounded-lg shadow-lg w-full sm:w-1/3 border-2">
                    <div className="w-fit bg-indigo-500 p-2 rounded-full text-center">
                        <RiUserFollowFill className="text-white text-xl" />
                    </div>
                    <p className="flex flex-col items-center text-center">
                        Total Subscribers: <br />
                        <span className="text-2xl font-bold">
                            {userData?.totalSubscribers?.toLocaleString("en-IN")}
                        </span>
                    </p>
                </div>
            </div>
            <div>
                <h3 className="mb-4">Your Videos</h3>
                <div className="flex flex-col gap-y-4">
                    <div className="flex flex-col gap-y-4">
                        {userData?.videos?.map((video, key) => (
                            <VideoCard key={key} video={video} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

}

export const metadata = {
    title: "Dashboard",
    description: "Dashboard page to manage videos",
};