/* eslint-disable no-unused-vars */
/* eslint-disable indent */
"use client";

import { SubmitButton } from "@/components/buttons/SubmitButton";
import { subscribeHandlerToUser } from "@root/actions/Subscription.js/userProfile";
import { formatTime } from "@root/utils/time";
import moment from "moment";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useActionState, useOptimistic, useState } from "react";
import { FiTwitter } from "react-icons/fi";
import { FaUserPlus, FaUserCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { IoMdHeartEmpty } from "react-icons/io";
import { FcLike } from "react-icons/fc";
import { addChirp, likeChirp } from "@root/actions/chirp";
import VideoUpload from "@/app/dashboard/Upload";
import { IoPlayOutline } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";

export const SubscribeButton = ({ userID, isSubscribed, isAuth, isCurrentUser }) => {
    return <>
        <button className={` flex items-center gap-2 rounded-md py-2 px-4 text-white 
        ${isCurrentUser && "hidden"}  
        ${isAuth && isSubscribed ? "bg-indigo-600 hover:bg-indigo-700" : "hover:bg-red-700 bg-red-600"} `}
            onClick={async (e) => {
                e.preventDefault();
                if (!isAuth) {
                    toast.error("Please Login to Subscribe");
                    return;
                }
                let res = await subscribeHandlerToUser(userID);
                if (res.status === 200) {
                    toast.success(res.message);
                }
                else {
                    toast.error(res.message);
                }
            }}
        >
            {isSubscribed ? <FaUserCheck size={20} /> : <FaUserPlus size={20} />}
            <span className="hidden sm:block">
                {isSubscribed ? "Subscribed" : "Subscribe"}
            </span>
        </button>
    </>;
};

export const ContentBox = ({ userDetails, isAuth, activeTab, isCurrentUser }) => {
    const router = useRouter();

    const renderContent = () => {
        switch (activeTab) {
            case "videos":
                return <VideoContent
                    videos={userDetails?.user[0]?.videos}
                    isCurrentUser={isCurrentUser}
                />;
            case "chirps":
                return <ChirpsContent
                    userDetails={userDetails}
                    isCurrentUser={isCurrentUser}
                />;
            case "subscribed":
                return <SubrscribedContent
                    userDetails={userDetails}
                />;
            case "playlist":
                return <div>Playlist Content</div>;
            default:
                return null;
        }
    };

    const renderTabs = ["videos", "chirps"];
    if (isCurrentUser) {
        renderTabs.push(...["subscribed", "playlist", "settings"]);
    }

    return <>
        <div className="mt-4">
            <div className="flex max-w-full overflow-x-scroll scrollbar-hide">
                {renderTabs.map((tab, index) => {
                    return <button
                        key={index}
                        className={`py-2 px-4 overflow-x-scroll scrollbar-hide text-wrap ${activeTab === tab ? "border-b-4 border-b-indigo-600 text-indigo-600 bg-gray-200 rounded-t-lg" : "text-gray-600 hover:border-b-4 hover:border-b-indigo-600 hover:text-indigo-600 hover:bg-gray-200 hover:rounded-t-lg"}`}
                        onClick={(e) => {
                            e.preventDefault();
                            router.push(`/user/${userDetails?.user[0]?._id}?tab=${tab}`);
                        }}
                        style={{
                            width: `${100 / renderTabs.length}%`
                        }}
                    >
                        {tab[0].toUpperCase() + tab.slice(1)}
                    </button>;
                })}
            </div>
            <div className="mt-4">
                {renderContent()}
            </div>
        </div >
    </>;
};

const VideoContent = ({ videos, isCurrentUser }) => {
    return <div
        className="flex flex-col gap-y-1 sm:gap-y-4"
    >
        <div
            className={` flex-row gap-x-4
                ${isCurrentUser ? "flex" : "hidden"}
            `}
        >
            <VideoUpload />
        </div>
        <div className="flex flex-wrap">
            {videos?.map((video, index) => {
                return <div className="w-full sm:w-1/4 overflow-hidden sm:pr-2 mb-4 sm:mb-2"
                    href={`/video/${video._id}`}
                    key={index}
                >
                    <div className="relative">
                        <Link href={`/video/${video._id}`}>
                            <CldImage
                                className="w-full h-48 object-cover hover:cursor-pointer rounded-2xl"
                                src={video.thumbnail}
                                alt={video.title}
                                key={video._id}
                                id={video._id}
                                width={1920}
                                height={1080}
                            />
                            <div className="absolute bottom-2 right-2 bg-white text-black bg-opacity-75 text-xs px-2 py-1 rounded">
                                {formatTime(video.duration)}
                            </div>
                        </Link>
                    </div>
                    <div className="flex items-start py-4">
                        <div className="flex-1">
                            <div className="font-bold mb-1">{video.title.length > 80 ? video.title.slice(0, 80) + "..." : video.title}</div>
                            <div className="text-gray-600 text-xs">{video.views} views • {moment(video.createdAt).fromNow()}</div>
                        </div>
                    </div>
                </div>;
            })}
            {videos?.length === 0
                &&
                <div className="w-fit mx-auto text-center flex flex-col items-center justify-center text-gray-600">
                    <IoPlayOutline size={40} />
                    <span>
                        No Videos Found 😫
                    </span>
                </div>}
        </div>
    </div>;
};

const ChirpsContent = ({ userDetails, isCurrentUser }) => {
    const [state, formAction] = useActionState(addChirp, null);

    const [optimisticChirps, setOptimisticChirps] = useOptimistic(userDetails?.user[0]?.chirps,
        (newChirp) => [newChirp, ...chirps]
    );

    useEffect(() => {
        if (state?.status === 200) {
            toast.success(state.message);
            document.getElementById("chirpsForm").reset();
        }
        else if (state?.status === 500) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <>
            <div className={` flex-row gap-x-4 
                ${isCurrentUser ? "flex" : "hidden"}
            `} >
                <Image
                    src={userDetails?.user[0]?.avatar}
                    alt={userDetails?.user[0]?.name}
                    className="w-10 h-10 rounded-full"
                    width={40}
                    height={40}
                />
                <form action={formAction} className="w-full" id="chirpsForm">
                    <div className="flex items-center border-b border-indigo-500 pb-2 gap-x-2">
                        <textarea
                            type="text"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 peer placeholder-transparent"
                            required
                            placeholder="What's on your mind?"
                            minLength={5}
                            maxLength={140}
                            name="chirpContent"
                            id="chirpContent"
                        />
                        <SubmitButton
                            size="fit"
                            title={
                                <FiTwitter size={20} />
                            }
                            className="h-full bg-indigo-600 text-white hover:bg-indigo-700"
                        />
                    </div>
                </form>
            </div>

            <div
                className="flex flex-col gap-y-4 mt-4"
            >
                {optimisticChirps?.map((chirp) => (
                    <div key={chirp._id} className="flex flex-row gap-x-4 border-b border-gray-200 pb-4">
                        <Image
                            src={userDetails?.user[0].avatar}
                            alt={userDetails?.user[0].name}
                            className="w-10 h-10 rounded-full"
                            width={40}
                            height={40}
                        />
                        <div className="flex flex-col w-full">
                            <div className="w-full flex flex-row justify-between">
                                <div className="flex items-center">
                                    <span className="font-semibold w-fit">{userDetails?.user[0].name}</span>
                                    <div className="text-gray-600 text-xs ml-2">
                                        {moment(chirp.createdAt).fromNow()}
                                    </div>
                                </div>

                                {/*  TODO: Edit and Delete functionality */}
                                {/* <div className={`items-center gap-x-2  ${username === comment.owner.username ? "flex" : "hidden"} `}>
                                    <MdDelete
                                        size={20}
                                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                    />
                                    <TbEdit
                                        size={20}
                                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                    />
                                </div> */}
                            </div>
                            <p>
                                {chirp.content}
                            </p>
                            <div className="flex items-center gap-x-2 text-gray-500 text-xs">
                                {chirp.isLikedByLoggedUser
                                    ? <FcLike size={20} className="cursor-pointer"
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            let res = await likeChirp(chirp._id);
                                            if (res.status === 200) {
                                                toast(res.message);
                                            }
                                            else {
                                                toast.error(res.message);
                                            }
                                        }}
                                    /> :
                                    <IoMdHeartEmpty size={20} className="cursor-pointer"
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            let res = await likeChirp(chirp._id);
                                            if (res.status === 200) {
                                                toast.success(res.message);
                                            }
                                            else {
                                                toast.error(res.message);
                                            }
                                        }}
                                    />}
                                <span>
                                    {chirp.totalLikes} likes
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                {optimisticChirps?.length === 0 &&
                    <div className="w-fit mx-auto text-center flex flex-col items-center justify-center text-gray-600">
                        <FiTwitter size={35} />
                        <span>
                            No Chirps Found 😫
                        </span>
                    </div>}
            </div>
        </>
    );
};

const SubrscribedContent = ({ userDetails }) => {
    const [searchQuery, setSearchQuery] = useState("");
    if (!userDetails.isCurrentUser) return null;

    const filteredSubscriptions = userDetails?.user[0]?.subscribedByUser?.filter(sub => {
        return sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || sub.username.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const FilteredResults = () => {
        if (filteredSubscriptions.length === 0) {
            return (
                <div className="w-fit mx-auto text-center flex flex-col items-center justify-center text-gray-600">
                    <FaUsers size={40} />
                    <span>
                        No results found for {searchQuery}
                    </span>
                </div>
            );
        }

        return filteredSubscriptions.map((sub, index) => (
            <div className="w-full overflow-hidden sm:pr-2 mb-4 sm:mb-2 flex flex-row gap-x-2" key={index}>
                <Link href={`/user/${sub._id}`}>
                    <Image
                        src={sub.avatar}
                        alt={sub.name}
                        className="w-10 h-10 rounded-full"
                        width={40}
                        height={40}
                    />
                </Link>
                <div className="flex flex-col">
                    <div className="flex items-center">
                        <div className="flex flex-row justify-center items-center gap-x-2">
                            <div className="font-bold">{sub.name}</div>
                            <div className="text-gray-600 text-xs">@{sub.username}</div>
                        </div>
                    </div>
                    <div className="text-gray-600 text-xs">
                        {sub.totalSubscribers} subscribers
                    </div>
                </div>
                <div className="ml-auto">
                    <button
                        className="flex items-center gap-2 rounded-md py-2 px-4 text-white hover:bg-red-700 bg-red-600"
                        onClick={async (e) => {
                            e.preventDefault();
                            let res = await subscribeHandlerToUser(sub._id);
                            if (res.status === 200) {
                                toast.success(res.message);
                            } else {
                                toast.error(res.message);
                            }
                        }}
                    >
                        <FaUserCheck size={20} />
                        <span className="hidden sm:block">UnSubscribe</span>
                    </button>
                </div>
            </div>
        ));
    };

    return (
        <>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by name or username"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 peer placeholder-transparent"
                />
            </div>
            <div className="flex flex-wrap gap-4">
                {filteredSubscriptions.length > 0 ? (
                    <FilteredResults />
                ) : (
                    <div className="w-fit mx-auto text-center flex flex-col items-center justify-center text-gray-600">
                        <FaUsers size={40} />
                        <span>No Subscriptions Found 😫</span>
                    </div>
                )}
            </div>
        </>
    );
};