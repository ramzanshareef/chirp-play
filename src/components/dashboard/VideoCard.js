"use client";

import moment from "moment";
import { CldImage } from "next-cloudinary";
import { FcCalendar } from "react-icons/fc";
import { FaRegEdit } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { useState } from "react";

export const VideoCard = ({ key, video }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="flex flex-col justify-center">
                <div className="flex flex-col md:flex-row w-full">
                    <div className="w-full md:w-1/3 bg-white grid place-items-center">
                        <CldImage
                            src={video.thumbnail}
                            alt={video.title}
                            key={key}
                            id={key}
                            width="1920"
                            height="1080"
                            className="rounded-lg cursor-pointer"
                            onClick={() => {
                                setShowModal(true);
                            }}
                        />
                    </div>
                    <div className="w-full md:w-2/3 flex flex-col space-y-2 py-3 sm:py-0 px-0 sm:px-3  justify-between">
                        <div className="flex flex-col gap-y-3">
                            <h3 className="font-black text-gray-800 md:text-3xl text-xl">
                                {video.title}
                            </h3>
                            <p className="md:text-lg text-gray-500 text-base">
                                {video.description}
                            </p>
                            <div className="flex justify-between item-center">
                                <div className="flex justify-center items-center gap-x-1">
                                    <svg className="h-5 w-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path clipRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" fillRule="evenodd">
                                        </path>
                                    </svg>
                                    <p>
                                        1.2k Likes
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <FaRegEye className="text-gray-500 text-xl" />
                                    <p className="text-gray-600 font-bold text-sm ml-1">
                                        {parseInt(video.views).toLocaleString("en-IN")}
                                    </p>
                                </div>
                                <p className="text-gray-500 font-medium hidden md:flex items-center justify-center gap-x-1">
                                    <FcCalendar className="h-5 w-5 text-gray-500 inline-block" />
                                    {moment(video.createdAt).format("Do MMM 'YY")}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 pl-3 rounded">
                                <FaRegEdit className="text-white text-xl" />
                            </button>
                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold p-2 rounded">
                                <MdDelete className="text-white text-xl" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed top-0 left-0 z-max w-screen min-h-screen bg-black/80 flex justify-center items-center">
                    <button className="fixed z-90 top-20 right-8 text-white dark:text-slate-200 text-5xl font-bold" onClick={() => setShowModal(false)} >
                        &times;
                    </button>
                    <div>
                        <video src={video.videoFile}
                            controls
                            className="z-max"
                            width="800"
                            height="600"
                        ></video>
                    </div>
                </div>
            )}
        </>
    );
};