import Upload from "@/components/dashboard/Upload";
import { VideoCard } from "@/components/dashboard/VideoCard";
import { getUserData } from "@root/actions/user/data";
import { getUserVideos } from "@root/actions/user/video";
import { FaRegEye, FaHeart } from "react-icons/fa";
import { RiUserFollowFill } from "react-icons/ri";

export default async function DashboardPage() {
    const userData = await getUserData();
    const videosData = await getUserVideos();
    let vale = 54657875;
    return (
        <div className="w-full sm:w-11/12 mx-auto p-4 my-2 flex flex-col gap-y-3 sm:gap-y-6">
            <div
                className="flex w-full justify-between items-center max-sm:flex-col max-sm:gap-y-4"
            >
                <div>
                    <h2>Welcome back, {userData.user?.name}</h2>
                    <p>Track, manage and forecast your vidoes</p>
                </div>
                <Upload />
            </div>
            <div className="flex flex-col gap-y-2 sm:flex-row sm:gap-x-2 sm:gap-y-0">
                <div
                    className="flex justify-center items-center gap-x-4 bg-white p-4 rounded-lg shadow-lg w-full sm:w-1/3 border-2"
                >
                    <div className="w-fit bg-indigo-500 p-2 rounded-full">
                        <FaRegEye className="text-white text-xl" />
                    </div>
                    <p>
                        Total Views: <br />
                        <span className="text-2xl font-bold">
                            {vale.toLocaleString()}
                        </span>
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
                        <span className="text-2xl font-bold">
                            {vale.toLocaleString()}
                        </span>
                    </p>
                </div>
                <div
                    className="flex justify-center items-center gap-x-4 bg-white p-4 rounded-lg shadow-lg w-full sm:w-1/3 border-2"
                >
                    <div className="w-fit bg-indigo-500 p-2 rounded-full">
                        <RiUserFollowFill className="text-white text-xl" />
                    </div>
                    <p>
                        Total Followers: <br />
                        <span className="text-2xl font-bold">
                            {vale.toLocaleString("en-IN")}
                        </span>
                    </p>
                </div>
            </div>
            <div>
                <h3 className="mb-4">Your Videos</h3>
                <div className="flex flex-col gap-y-4">
                    {videosData?.videos?.map((video, key) => (
                        <VideoCard key={key} video={video} />
                    ))}
                </div>
            </div>
        </div>
    );
}