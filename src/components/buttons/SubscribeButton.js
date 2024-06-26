/* eslint-disable no-unused-vars */
/* eslint-disable indent */

"use client";

import { subscribeHandlerToUser } from "@root/actions/Subscription.js/userProfile";
import { FaRegBell } from "react-icons/fa";
import { FaBell } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useActionState, useEffect, useTransition, useOptimistic } from "react";

export const SubscribeButton = ({ userID, isSubscribed, isAuth, isCurrentUser, pathToRevalidate }) => {
    const [pending, startTransition] = useTransition();
    const [result, action] = useActionState(subscribeHandlerToUser, null);
    const [optimisticIsSubscribed, setOptimisticIsSubscribed] = useOptimistic(isSubscribed);

    useEffect(() => {
        if (result?.status !== 200) {
            toast.error(result?.message);
        }
    }, [result]);
    
    return <>
        {!isCurrentUser &&
            <button className={` flex items-center gap-2 rounded-md py-2 px-4 text-white 
        bg-indigo-600 hover:bg-indigo-700 
            ${(isAuth && optimisticIsSubscribed) ? "bg-indigo-600 hover:bg-indigo-700" : "hover:bg-red-700 bg-red-600"} `}
                onClick={
                    async () => {
                        startTransition(async () => {
                            if (isAuth) {
                                setOptimisticIsSubscribed(!optimisticIsSubscribed);
                            }
                            await action({
                                userID: userID,
                                pathToRevalidate: pathToRevalidate,
                            });
                        });
                    }}
            >
                {optimisticIsSubscribed ? <FaBell size={20} /> : <FaRegBell size={20} />}
                <span className="hidden sm:block">
                    {optimisticIsSubscribed ? "Subscribed" : "Subscribe"}
                </span>
            </button>
        }
    </>;
};