"use client";

import { subscribeHandlerToChannel, subscriptionStatus } from "@root/actions/channel/subscribe";
import { likeHandler, likeStatus } from "@root/actions/like";
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
                className="sm:ml-4 p-2 px-4 flex items-center gap-x-2 ml-auto bg-indigo-400 hover:bg-indigo-500 text-white rounded-3xl"
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

export const LikeButton = ({ videoID, totalLikes }) => {
    const [likerStatus, setLikerStatus] = useState(false);

    useEffect(() => {
        (async () => {
            let res = await likeStatus(videoID);
            if (res.status === 200) {
                setLikerStatus(res.isLiked);
            }
        })();
    }, [videoID]);

    return (
        <>
            <button
                className="sm:ml-4 p-2 flex items-center gap-x-2 ml-auto bg-indigo-400 hover:bg-indigo-500 rounded mr-2"
                onClick={async (e) => {
                    e.preventDefault();
                    let res = await likeHandler(videoID, "Video");
                    if (res.status === 200) {
                        toast.success(res.message, {
                            onClick: setLikerStatus(!likerStatus),
                            onClose: setLikerStatus(!likerStatus),
                        });
                    }
                    else {
                        toast.error(res.message, {
                            onClick: setLikerStatus(!likerStatus),
                            onClose: setLikerStatus(!likerStatus),
                        });
                    }
                }}
            >
                {likerStatus === false ?
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