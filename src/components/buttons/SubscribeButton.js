/* eslint-disable no-unused-vars */
/* eslint-disable indent */

"use client";

import { subscribeHandlerToUser } from "@root/actions/Subscription.js/userProfile";
import { FaRegBell } from "react-icons/fa";
import { FaBell } from "react-icons/fa6";
import { toast } from "react-toastify";

export const SubscribeButton = ({ userID, isSubscribed, isAuth, isCurrentUser, pathToRevalidate }) => {
    return <>
        {!isCurrentUser &&
            <button className={` flex items-center gap-2 rounded-md py-2 px-4 text-white 
        bg-indigo-600 hover:bg-indigo-700 
            ${(isAuth && isSubscribed) ? "bg-indigo-600 hover:bg-indigo-700" : "hover:bg-red-700 bg-red-600"} `}
                onClick={
                    async (e) => {
                        e.preventDefault();
                        if (!isAuth) {
                            toast.error("Please Login to Subscribe");
                            return;
                        }
                        let res = await subscribeHandlerToUser(userID, pathToRevalidate);
                        if (res.status !== 200) {
                            toast.error(res.message);
                        }
                    }}
            >
                {isSubscribed ? <FaBell size={20} /> : <FaRegBell size={20} />}
                <span className="hidden sm:block">
                    {isSubscribed ? "Subscribed" : "Subscribe"}
                </span>
            </button>
        }
    </>;
};