"use client";

import React from "react";
import { VideoUploadModal } from "@/components/modals/videoUpload";
import { FaPlus } from "react-icons/fa";

const Upload = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <>
            <button
                className="bg-indigo-600 hover:bg-indigo-500 text-white w-fit h-fit px-4 py-2 rounded-md flex items-center"
                onClick={() => setIsOpen(true)}
            >
                <FaPlus className="inline-block text-base" />
                <span className="inline-block ml-2">Upload Video</span>
            </button>
            <VideoUploadModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
};

export default Upload;