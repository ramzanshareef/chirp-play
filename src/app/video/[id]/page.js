/* eslint-disable no-unused-vars */
import { VideoComp } from "@/components/Video";
import { getUserData } from "@root/actions/user/data";
import { getVideo, suggestedVideos } from "@root/actions/video";
import moment from "moment";
import Image from "next/image";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegBell } from "react-icons/fa";
import { MdPlaylistAdd, MdPlaylistAddCheck } from "react-icons/md";
import { Comments, CommentsForm } from "./Comments";
import { Suspense } from "react";
import { VideoPlayerComponent } from "./VideoPlayer";
import { LikeButton, SubscribeButton } from "./ClientComponents";
import { getSubscribers } from "@root/actions/channel/subscribe";
import { getLikes } from "@root/actions/like";
import Link from "next/link";

export default async function VideoPage({ params }) {
    const userDetails = await getUserData();
    const { video, comments } = await getVideo(params.id);
    const { totalSubscribers } = await getSubscribers(video.owner._id);
    const { totalLikes } = await getLikes(video._id);
    const suggestedVideosData = await suggestedVideos(params.id);
    return (
        <>
            <div className="flex flex-col md:flex-row">
                <div className="flex flex-col w-full md:w-[70%] p-4">

                    {/* video player */}
                    <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 w-full rounded-lg"></div>}>
                        <VideoPlayerComponent videoID={params?.id} />
                    </Suspense>

                    {/* video details */}
                    <div className="flex flex-col my-4 bg-gray-100 p-4 rounded-lg gap-y-4">
                        <div className="flex flex-col gap-0">
                            <h4>{video.title}</h4>
                            <p className="text-gray-600 text-xs">{video.views} views • {moment(video.createdAt).fromNow()}</p>
                        </div>
                        <div className="flex flex-col-reverse gap-y-3 sm:flex-row sm:justify-between sm:items-center">
                            <div className="flex flex-row">
                                <Image
                                    src={video.owner.avatar}
                                    alt={video.owner.name}
                                    className="w-10 h-10 rounded-full"
                                    width={40}
                                    height={40}
                                />
                                <div className="ml-4">
                                    <Link
                                        href={`/user/${video.owner._id}`}
                                        className="font-bold">{video.owner.name}</Link>
                                    <div className="text-gray-600 text-xs">{totalSubscribers + " "}subscribers
                                    </div>
                                </div>
                                <SubscribeButton
                                    channelID={video.owner._id}
                                    videoID={video._id}
                                />
                            </div>
                            <div className="flex">
                                <LikeButton
                                    videoID={video._id}
                                    totalLikes={totalLikes}
                                />
                                <button
                                    className="items-center gap-x-2 flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                disabled:cursor-not-allowed disabled:shadow-none disabled:bg-indigo-400 disabled:hover:bg-indigo-400 disabled:focus-visible:outline-indigo-400 disabled:focus-visible:outline-offset-0 disabled:focus-visible:outline-2"
                                >
                                    <MdPlaylistAdd size={20} />
                                    {/* <MdPlaylistAddCheck size={20} /> */}
                                </button>
                            </div>
                        </div>
                        <div className="text-gray-600 text-sm">{video.description}</div>
                    </div>

                    {/* comments */}
                    <div className="flex flex-col gap-y-4 p-4">

                        {/* comment form */}
                        {userDetails?.status === 200 ?
                            (<div className="flex flex-row gap-x-4">
                                <Image
                                    src={userDetails?.user?.avatar}
                                    alt={userDetails?.user?.name}
                                    className="w-10 h-10 rounded-full"
                                    width={40}
                                    height={40}
                                />
                                <CommentsForm
                                    videoID={video._id}
                                />
                            </div>) : (
                                <div className="flex flex-row gap-x-4">
                                    <Image
                                        src="https://res.cloudinary.com/cloudformedia/image/upload/chirp-play/avatar-default.jpg"
                                        alt="User Avatar"
                                        className="w-10 h-10 rounded-full"
                                        width={40}
                                        height={40}
                                    />
                                    <div className="flex flex-col w-full">
                                        <textarea
                                            className="w-full p-2 border border-gray-200 rounded-lg
                                            disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600"
                                            placeholder="Sign in to comment"
                                            disabled
                                        />
                                    </div>
                                </div>
                            )}

                        {/* Existing Comments */}
                        <Comments
                            comments={comments}
                            username={userDetails?.user?.username}
                        />
                    </div>
                </div>

                <div className="w-full md:w-[30%]">

                    {/* suggested videos */}
                    <div className="flex flex-col gap-y-4 p-4">
                        {suggestedVideosData?.videos?.map(video => (
                            <VideoComp video={video} key={video._id} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}