"use client";

import { CldImage, CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { formatTime } from "@root/utils/time";

export const VideoComp = ({ video }) => {
    return (
        <>
            <Link className="max-w-sm rounded overflow-hidden shadow-lg hover:cursor-pointer"
                href={`/video/${video._id}`}
            >
                <div className="relative">
                    <CldImage
                        className="w-full h-48 object-cover"
                        src={video.thumbnail}
                        alt={video.title}
                        key={video._id}
                        id={video._id}
                        width={1920}
                        height={1080}
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        {formatTime(video.duration)}
                    </div>
                </div>
                <div className="flex items-start p-4">
                    <Image
                        className="w-10 h-10 rounded-full mr-4"
                        src={video.owner.avatar}
                        alt={video.owner.name}
                        width={40}
                        height={40}
                    />
                    <div className="flex-1">
                        <div className="font-bold text-sm mb-1">{video.title}</div>
                        <div className="text-gray-600 text-xs">{video.owner.name}</div>
                        <div className="text-gray-600 text-xs">{video.views} views • {moment(video.createdAt).fromNow()}</div>
                    </div>
                </div>
            </Link>
        </>
    );
};

export const VideoPlayer = ({ video }) => {
    return (
        <>
            <CldVideoPlayer
                src={video.videoFile}
                className="rounded-lg p-6"
                controls
                poster={video.thumbnail}
                id={video._id}
                width={1920}
                height={1080}
                logo={{
                    "imageUrl": "/logo.png",
                    "onClickUrl": "/"
                }}
                bigPlayButton={true}
                playbackRates={[0.5, 1, 1.5, 2]}
                pictureInPictureToggle
                aiHighlightsGraph={true}
                playedEventPercents={[25, 50, 75, 100]}
                showJumpControls={true}
            />
        </>
    );
};