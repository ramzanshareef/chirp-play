import { VideoComp } from "@/components/Video";
import { getAllVideos } from "@root/actions/video";

export default async function Home() {
    const videosData = await getAllVideos();
    return (
        <>
            <div>
                <div className="flex flex-wrap gap-4">
                    {videosData?.videos?.map((video) => (
                        <VideoComp video={video} key={video._id} />
                    ))}
                    {videosData?.videos?.length === 0 && (
                        <>
                            <div className="flex flex-col items-center justify-center w-full h-screen text-gray-500 text-center">
                                <span className="text-6xl">😢</span>
                                <p>No videos found. <br /> Please check back later.</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}