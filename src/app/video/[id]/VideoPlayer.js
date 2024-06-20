import { VideoPlayer } from "@/components/Video";
import { getVideo } from "@root/actions/video";

export const VideoPlayerComponent = async ({ videoID }) => {
    const { video } = await getVideo(videoID);
    return (
        <>
            <VideoPlayer video={video} />
        </>
    );
};