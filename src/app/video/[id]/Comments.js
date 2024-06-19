"use client";

import moment from "moment";
import Image from "next/image";
import { useState, useEffect } from "react";

const Comments = () => {
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
                {demoComments.length} Comments
            </h4>
            {isMobile && (
                <button
                    className="bg-indigo-400 hover:bg-indigo-500 text-white p-2 mt-4 rounded-md w-fit"
                    onClick={() => setShowComments(!showComments)}
                >
                    {showComments ? "Hide" : "Show"} Comments
                </button>
            )}
            {(showComments || !isMobile) && demoComments.map(comment => (
                <div key={comment._id} className="flex flex-row gap-x-4 border-b border-gray-200 pb-4">
                    <Image
                        src={comment.user.avatar}
                        alt={comment.user.name}
                        className="w-10 h-10 rounded-full"
                        width={40}
                        height={40}
                    />
                    <div className="flex flex-col">
                        <span className="flex items-center">
                            <span className="font-bold">{comment.user.name}</span>
                            <div className="text-gray-600 text-xs ml-2">{moment(comment.createdAt).fromNow()}</div>
                        </span>
                        <div className="text-gray-600 text-sm -mt-1 mb-1">@{comment.user.username}</div>
                        <div>{comment.comment}</div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default Comments;

const demoComments = [
    {
        _id: "1",
        user: {
            name: "John Doe",
            username: "johndoe",
            avatar: "https://res.cloudinary.com/cloudformedia/image/upload/chirp-play/avatar-default.jpg"
        },
        comment: "This is a great video",
        createdAt: new Date()
    },
    {
        _id: "2",
        user: {
            name: "Jane Doe",
            username: "janedoe",
            avatar: "https://res.cloudinary.com/cloudformedia/image/upload/chirp-play/avatar-default.jpg"
        },
        comment: "I love this video",
        createdAt: new Date()
    },
    {
        _id: "3",
        user: {
            name: "John Kaplira",
            username: "johnkaplira",
            avatar: "https://res.cloudinary.com/cloudformedia/image/upload/chirp-play/avatar-default.jpg"
        },
        comment: "This is a great video",
        createdAt: new Date()
    },
];