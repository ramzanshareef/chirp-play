import { VideoComp } from "@/components/video/Video";
import { getAllVideos } from "@root/actions/video";

export default async function Home() {
    const videosData = await getAllVideos();
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {videosData?.videos?.map((video) => (
                    <VideoComp video={video} key={video._id} />
                ))}
            </div>
            {videosData?.videos?.length === 0 && (
                <>
                    <div className="flex flex-col items-center justify-center w-full h-screen text-gray-500 text-center">
                        <span className="text-6xl">😢</span>
                        <p>No videos found. <br /> Please check back later.</p>
                    </div>
                </>
            )}
        </>
    );
}