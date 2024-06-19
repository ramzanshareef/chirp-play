import React from "react";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegBell } from "react-icons/fa6";
import { MdPlaylistAdd } from "react-icons/md";

const loading = () => {
    return (
        <>
            <div className="flex flex-col md:flex-row">
                <div className="flex flex-col w-full md:w-[70%] p-4">
                    {/* video player */}
                    <div className="animate-pulse bg-gray-200 h-96 w-full rounded-lg"></div>

                    {/* video details */}
                    <div className="flex flex-col my-4 bg-gray-100 p-4 rounded-lg gap-y-4">
                        <div className="flex flex-col gap-0">
                            <h4>
                                <div>
                                    <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded-lg mb-2"></div>
                                    <div className="animate-pulse bg-gray-200 h-4 w-1/4 rounded-lg"></div>
                                </div>
                            </h4>
                            <p className="text-gray-600 text-xs">
                                <div className="animate-pulse bg-gray-200 h-4 w-1/4 rounded-lg"></div>
                            </p>
                        </div>
                        <div className="flex flex-col-reverse gap-y-3 sm:flex-row sm:justify-between sm:items-center">
                            <div className="flex flex-row">
                                <div className="animate-pulse bg-gray-200 h-10 w-10 rounded-full"></div>
                                <div className="ml-4">
                                    <div className="font-bold">
                                        <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded-lg"></div>
                                    </div>
                                    <div className="text-gray-600 text-xs">
                                        <div className="animate-pulse bg-gray-200 h-4 w-1/4 rounded-lg"></div>
                                    </div>
                                </div>
                                <button
                                    className="bg-indigo-400 hover:bg-indigo-500 sm:ml-4 p-2 flex items-center gap-x-2 ml-auto"
                                >
                                    <FaRegBell size={20} />
                                    <span className="hidden sm:block">
                                        Subscribe
                                    </span>
                                </button>
                            </div>
                            <div className="flex">
                                <button
                                    className="bg-indigo-400 hover:bg-indigo-500 mr-2 p-2 flex items-center gap-x-2"
                                >
                                    <AiOutlineLike size={20} /> 
                                </button>
                                <button
                                    className="bg-indigo-400 hover:bg-indigo-500 p-2"
                                >
                                    <MdPlaylistAdd size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="text-gray-600 text-sm">
                            <div className="animate-pulse bg-gray-200 h-4 w-full rounded-lg mb-2"></div>
                        </div>
                    </div>
                    
                    {/* comments */}
                    <div className="flex flex-col gap-y-4 p-4">
                        <div className="flex flex-row gap-x-4">
                            <div className="animate-pulse bg-gray-200 h-10 w-10 rounded-full"></div>
                            <div className="flex flex-col w-full">
                                <textarea
                                    className="w-full p-2 border border-gray-200 rounded-lg
                                            disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600"
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-[30%]">
                    {/* suggested videos */}
                    <div className="flex flex-col gap-y-4 p-4">
                        <div className="flex flex-col gap-y-4">
                            <div className="animate-pulse bg-gray-200 h-48 w-full rounded-lg"></div>
                            <div className="animate-pulse bg-gray-200 h-48 w-full rounded-lg"></div>
                            <div className="animate-pulse bg-gray-200 h-48 w-full rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default loading;