"use client";

import { CldImage, CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { formatTime } from "@root/utils/time";
import { increaseVideoView } from "@root/actions/video";
import { useEffect, useRef, useState } from "react";

export const VideoComp = ({ video }) => {
    return (
        <>
            <div className="rounded overflow-hidden shadow-lg"
                href={`/video/${video._id}`}
            >
                <div className="relative">
                    <Link href={`/video/${video._id}`}>
                        <CldImage
                            className="w-full h-48 object-cover hover:cursor-pointer"
                            src={video.thumbnail}
                            alt={video.title}
                            key={video._id}
                            id={video._id}
                            width={1920}
                            height={1080}
                        />
                    </Link>
                    <div className="absolute bottom-2 right-2 bg-white text-black bg-opacity-75 text-xs px-2 py-1 rounded">
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
                        <Link className="text-gray-600 text-xs hover:text-indigo-400 hover:cursor-pointer -mt-1"
                            href={`/user/${video.owner._id}`}>{video.owner.name}</Link>
                        <div className="text-gray-600 text-xs">{video.views} views • {moment(video.createdAt).fromNow()}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const VideoPlayer = ({ video }) => {
    const videoRef = useRef(null);
    const [viewedSegments, setViewedSegments] = useState(new Set());
    const [viewCounted, setViewCounted] = useState(false);

    const hasWatched40Percent = (segments, duration) => {
        const uniqueSegments = Array.from(segments).sort((a, b) => a - b);
        const requiredWatchTime = duration * 0.4;
        let totalWatchedTime = 0;
        let lastTime = null;

        for (let time of uniqueSegments) {
            if (lastTime !== null && time - lastTime > 1) {
                totalWatchedTime = 0;
            }
            totalWatchedTime += 1;
            lastTime = time;
            if (totalWatchedTime >= requiredWatchTime) {
                return true;
            }
        }
        return false;
    };

    useEffect(() => {
        const video = videoRef.current;
        const handleTimeUpdate = () => {
            const currentTime = Math.floor(video.currentTime);
            const duration = video.duration;
            setViewedSegments((prevSegments) => new Set([...prevSegments, currentTime]));
            if (!viewCounted && hasWatched40Percent(viewedSegments, duration)) {
                setViewCounted(true);
            }
        };
        video.addEventListener("timeupdate", handleTimeUpdate);
        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
        };
    }, [viewedSegments, viewCounted]);

    useEffect(() => {
        if (viewCounted) {
            (async () => {
                await increaseVideoView(video._id);
            })();
        }
    }, [viewCounted, video._id]);

    return (
        <>
            <CldVideoPlayer
                src={video.videoFile}
                className="rounded-lg p-6"
                controls
                poster={video.thumbnail}
                id={"video-" + video._id}
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
                videoRef={videoRef}
            />
        </>
    );
};