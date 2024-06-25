"use client";

import { likeHandler } from "@root/actions/like";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { toast } from "react-toastify";

export const LikeButton = ({ videoID, totalLikes, isLikedByCurrUser }) => {
    return (
        <>
            <button
                className="items-center gap-x-2 flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                disabled:cursor-not-allowed disabled:shadow-none disabled:bg-indigo-400 disabled:hover:bg-indigo-400 disabled:focus-visible:outline-indigo-400 disabled:focus-visible:outline-offset-0 disabled:focus-visible:outline-2 ml-auto mr-2"
                onClick={async (e) => {
                    e.preventDefault();
                    let res = await likeHandler(videoID, "Video");
                    if (res.status !== 200) {
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