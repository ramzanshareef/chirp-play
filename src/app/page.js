import { VideoComp } from "@/components/Video";
import { getAllVideoes } from "@root/actions/video";

export default async function Home() {
    const videosData = await getAllVideoes();
    return (
        <>
            <div>
                <div className="flex flex-wrap gap-4 p-4">
                    {videosData?.videos?.map((video) => (
                        <VideoComp video={video} key={video._id} />
                    ))}
                </div>
            </div>
        </>
    );
}