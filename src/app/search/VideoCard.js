"use client";

import { formatTime } from "@root/utils/time";
import moment from "moment";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import Link from "next/link";

export const VideoCard = ({ video }) => {
    return (
        <div className="flex flex-col justify-center mb-4 border-b pb-2">
            <div className="flex flex-col md:flex-row w-full overflow-hidden">
                <Link className="relative w-full md:w-1/3 bg-white grid place-items-center"
                    href={`/video/${video._id}`}
                >
                    <CldImage
                        src={video.thumbnail}
                        alt={video.title}
                        width="1920"
                        height="1080"
                        className="rounded-lg cursor-pointer w-full h-60 object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-white text-black bg-opacity-75 text-xs px-2 py-1 rounded">
                        {formatTime(video.duration)}
                    </div>
                </Link>
                <div className="w-full md:w-2/3 flex flex-col gap-y-2 sm:gap-y-4 py-3 sm:py-0 px-0 sm:px-3">
                    <div className="flex flex-col gap-y-0">
                        <h3 className="text-gray-800 text-xl">
                            {video.title}
                        </h3>
                        <p className="text-gray-500 text-xs hidden sm:block">
                            {video.views} views • {moment(video.createdAt).fromNow()}
                        </p>
                    </div>
                    <Link className="flex items-center"
                        href={`/user/${video.owner._id}`}
                    >
                        <Image
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-4"
                            src={video.owner.avatar}
                            alt={video.owner.name}
                            width={40}
                            height={40}
                        />
                        <span className="text-gray-600 text-xs max-sm:flex max-sm:flex-row">{video.owner.name}
                            <p className="text-gray-500 text-xs sm:hidden">
                                &nbsp;• {video.views} views • {moment(video.createdAt).fromNow()}
                            </p>
                        </span>
                    </Link>
                    <span className="text-gray-700 text-sm hidden sm:block">{video.description}</span>
                </div>
            </div>
        </div>
    );
};
