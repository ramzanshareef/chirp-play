"use client";

import { likeHandler } from "@root/actions/like";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { useActionState, useEffect, useTransition, useOptimistic } from "react";
import { toast } from "react-toastify";

export const LikeButton = ({ videoID, totalLikes, isLikedByCurrUser, isAuth }) => {
    // eslint-disable-next-line no-unused-vars
    const [pending, startTransition] = useTransition();
    const [result, action] = useActionState(likeHandler, null);
    const [optimisticLikes, setOptimisticLikes] = useOptimistic(totalLikes);
    const [optimisticIsLiked, setOptimisticIsLiked] = useOptimistic(isLikedByCurrUser);

    useEffect(() => {
        if (result?.status !== 200) {
            toast.error(result?.message);
        }
    }, [result]);

    const handleLike = async () => {
        startTransition(async () => {
            if (isAuth) {
                setOptimisticIsLiked(!optimisticIsLiked);
                setOptimisticLikes(optimisticIsLiked ? optimisticLikes - 1 : optimisticLikes + 1);
            }
            await action({
                contentID: videoID,
                contentType: "Video",
            });
        });
    };

    return (
        <>
            <button
                className="items-center gap-x-2 flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                disabled:cursor-not-allowed disabled:shadow-none disabled:bg-indigo-400 disabled:hover:bg-indigo-400 disabled:focus-visible:outline-indigo-400 disabled:focus-visible:outline-offset-0 disabled:focus-visible:outline-2 ml-auto mr-2"
                onClick={handleLike}
            >
                {optimisticIsLiked === false ?
                    <>
                        <AiOutlineLike size={20} className="inline-block mx-1" />
                        {optimisticLikes}
                    </>
                    :
                    <>
                        <AiFillLike size={20} className="inline-block mx-1" />
                        {optimisticLikes}
                    </>
                }
            </button>
        </>
    );
};
