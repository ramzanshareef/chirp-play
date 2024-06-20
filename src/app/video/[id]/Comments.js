"use client";

import { SubmitButton } from "@/components/buttons/SubmitButton";
import { addComment } from "@root/actions/comment";
import moment from "moment";
import Image from "next/image";
import { useState, useEffect, useActionState } from "react";
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import Link from "next/link";

export const Comments = ({ comments, username }) => {
    const [showComments, setShowComments] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };

        // Set initial value
        handleResize();

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Cleanup on unmount
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return (
        <>
            <h4>
                {comments.length} Comments
            </h4>
            {isMobile && (
                <button
                    className="bg-indigo-400 hover:bg-indigo-500 text-white p-2 mt-4 rounded-md w-fit"
                    onClick={() => setShowComments(!showComments)}
                >
                    {showComments ? "Hide" : "Show"} Comments
                </button>
            )}
            {(showComments || !isMobile) && comments.map(comment => (
                <div key={comment._id} className="flex flex-row gap-x-4 border-b border-gray-200 pb-4">
                    <Image
                        src={comment.owner.avatar}
                        alt={comment.owner.name}
                        className="w-10 h-10 rounded-full"
                        width={40}
                        height={40}
                    />
                    <div className="flex flex-col w-full">
                        <div className="w-full flex flex-row justify-between">
                            <div className="flex items-center">
                                <span className="font-bold">{comment.owner.name}</span>
                                <div className="text-gray-600 text-xs ml-2">{moment(comment.createdAt).fromNow()}</div>
                            </div>
                            <div className={`items-center gap-x-2  ${username === comment.owner.username ? "flex" : "hidden"} `}>
                                <MdDelete
                                    size={20}
                                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                />
                                <TbEdit
                                    size={20}
                                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                />
                            </div>
                        </div>
                        <Link
                            href={`/user/${comment.owner.username}`}
                            className="text-gray-600 hover:text-gray-800 text-sm -mt-1 mb-1">@{comment.owner.username}</Link>
                        <div>{comment.content}</div>
                    </div>
                </div>
            ))}
        </>
    );
};

export const CommentsForm = ({ videoID }) => {
    const [state, formAction] = useActionState(addComment, null);

    useEffect(() => {
        if (state?.status === 200) {
            toast.success(state.message, {
                onClick: () => document.getElementById("commentForm").reset(),
                onClose: () => document.getElementById("commentForm").reset()
            });
        }
        else if (state?.status !== 200 && state?.message) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <>
            <form action={formAction} className="w-full" id="commentForm">
                <div className="flex flex-col w-full">
                    <textarea
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 peer placeholder-transparent"
                        placeholder="Add a public comment..."
                        name="comment"
                        required
                        minLength={5}
                    />
                    <input type="hidden" name="videoID" value={videoID} />
                    <SubmitButton
                        title="Comment"
                        size="fit"
                        className="ml-auto mt-2"
                    />
                </div>
            </form>
        </>);
};