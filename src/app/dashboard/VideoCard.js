"use client";

import moment from "moment";
import { CldImage } from "next-cloudinary";
import { FcCalendar } from "react-icons/fc";
import { FaRegEdit } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { formatTime } from "@root/utils/time";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useState } from "react";
import Link from "next/link";
import { deleteVideo } from "@root/actions/user/video";
import { toast } from "react-toastify";

export const VideoCard = ({ key, video }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [videoToDelete, setVideoToDelete] = useState({});

    return (
        <>
            <div className="flex flex-col justify-center">
                <div className="flex flex-col md:flex-row w-full">
                    <div className="relative w-full md:w-1/3 bg-white grid place-items-center">
                        <Link href={`/video/${video._id}`}>
                            <CldImage
                                src={video.thumbnail}
                                alt={video.title}
                                key={key}
                                id={key}
                                width="1920"
                                height="1080"
                                className="rounded-lg cursor-pointer w-full h-full"
                            />
                            <div className="absolute bottom-2 right-2 bg-white text-black bg-opacity-75 text-xs px-2 py-1 rounded">
                                {formatTime(video.duration)}
                            </div>
                        </Link>
                    </div>
                    <div className="w-full md:w-2/3 flex flex-col space-y-2 py-3 sm:py-0 px-0 sm:px-3  justify-between">
                        <div className="flex flex-col gap-y-1">
                            <h3 className="text-xl font-semibold">
                                {video.title}
                            </h3>
                            <p className="md:text-lg text-gray-500 text-sm">
                                {video.description.slice(0, 180) + (video.description.length > 180 ? "..." : "")}
                            </p>
                            <div className="flex justify-between item-center">
                                <div className="flex justify-center items-center gap-x-1">
                                    <svg className="h-5 w-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path clipRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" fillRule="evenodd">
                                        </path>
                                    </svg>
                                    <p>
                                        {video.likes?.toLocaleString("en-IN")} Likes
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
                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold p-2 rounded"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setVideoToDelete(video);
                                    setShowDeleteModal(true);
                                }}
                            >
                                <MdDelete className="text-white text-xl" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteVideoConfimationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                videoToDelete={videoToDelete}
            />
        </>
    );
};

export const DeleteVideoConfimationModal = ({ isOpen, onClose, videoToDelete }) => {
    return (
        <>
            {(isOpen === true)
                ?
                <>
                    <div className="fixed z-50 inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                        <div className="w-4/5 lg:w-2/5 mx-auto p-6 bg-white shadow-md rounded-xl overflow-y-auto max-h-screen">
                            <h2 className="text-2xl font-semibold mb-4">
                                <IoIosCloseCircleOutline
                                    onClick={onClose}
                                    className="cursor-pointer float-right"
                                />
                            </h2>
                            <div>
                                Are you sure you want to delete the video titled <span className="font-semibold">{videoToDelete.title}</span> ? <br />
                                <span>
                                    This action cannot be undone, and this will <span className="text-red-600">permenantly</span> delete the video.
                                </span>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <button className="bg-red-500 hover:bg-red-700 text-white p-2 rounded"
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        let deleteResponse = await deleteVideo(videoToDelete._id);
                                        if (deleteResponse.status === 200) {
                                            toast.success(deleteResponse.message, {
                                                onClick: () => onClose(),
                                                onClose: () => onClose(),
                                            });
                                        }
                                        else {
                                            toast.error(deleteResponse.message, {
                                                onClick: () => onClose(),
                                                onClose: () => onClose(),
                                            });
                                        }
                                    }}
                                >
                                    Yes
                                </button>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onClose();
                                    }}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                </>
                :
                <></>
            }
        </>
    );
};