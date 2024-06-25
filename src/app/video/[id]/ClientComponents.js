"use client";

import { subscribeHandlerToChannel, subscriptionStatus } from "@root/actions/channel/subscribe";
import { likeHandler } from "@root/actions/like";
import { useEffect, useState } from "react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegBell, FaBell } from "react-icons/fa6";
import { toast } from "react-toastify";

export const SubscribeButton = ({ channelID, videoID }) => {
    const [subscriberStatus, setSubscriberStatus] = useState(false);

    useEffect(() => {
        (async () => {
            let res = await subscriptionStatus(channelID);
            if (res.status === 200) {
                setSubscriberStatus(res.isSubscribed);
            }
        })();
    }, [channelID]);

    return (
        <>
            <button
                className="sm:ml-4 items-center gap-x-2 ml-auto flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                disabled:cursor-not-allowed disabled:shadow-none disabled:bg-indigo-400 disabled:hover:bg-indigo-400 disabled:focus-visible:outline-indigo-400 disabled:focus-visible:outline-offset-0 disabled:focus-visible:outline-2"
                onClick={async (e) => {
                    e.preventDefault();
                    let res = await subscribeHandlerToChannel(channelID, videoID);
                    if (res.status === 200) {
                        toast.success(res.message, {
                            onClick: setSubscriberStatus(!subscriberStatus),
                            onClose: setSubscriberStatus(!subscriberStatus),
                        });
                    }
                    else {
                        toast.error(res.message);
                    }
                }}
            >
                {subscriberStatus === false ?
                    <>
                        <FaRegBell size={20} />
                        <span className="hidden sm:block">
                            Subscribe
                        </span>
                    </>
                    :
                    <>
                        <FaBell size={20} />
                        <span className="hidden sm:block">
                            Subscribed
                        </span>
                    </>
                }
            </button>
        </>
    );
};

export const LikeButton = ({ videoID, totalLikes, isLikedByCurrUser }) => {
    return (
        <>
            <button
                className="items-center gap-x-2 flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                disabled:cursor-not-allowed disabled:shadow-none disabled:bg-indigo-400 disabled:hover:bg-indigo-400 disabled:focus-visible:outline-indigo-400 disabled:focus-visible:outline-offset-0 disabled:focus-visible:outline-2 ml-auto mr-2"
                onClick={async (e) => {
                    e.preventDefault();
                    let res = await likeHandler(videoID, "Video");
                    if (res.status === 200) {
                        toast.success(res.message);
                    }
                    else {
                        toast.error(res.message);
                    }
                }}
            >
                {isLikedByCurrUser === false ?
                    <>
                        <AiOutlineLike size={20} className="inline-block mx-1" />
                        {totalLikes}
                    </>
                    :
                    <>
                        <AiFillLike size={20} className="inline-block mx-1" />
                        {totalLikes}
                    </>
                }
            </button>
        </>
    );
};