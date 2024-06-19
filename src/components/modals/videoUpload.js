"use client";

import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useState, useActionState, useEffect } from "react";
import { SubmitButton } from "../buttons/SubmitButton";
import { CldImage, CldUploadWidget, CldVideoPlayer } from "next-cloudinary";
import { toast } from "react-toastify";
import "next-cloudinary/dist/cld-video-player.css";
import { cancelledModalVideoDelete, videoUpload } from "@root/actions/user/video";

export const VideoUploadModal = ({ isOpen, onClose }) => {
    const [openCancelModal, setOpenCancelModal] = useState(false);
    const [currModal, setCurrModal] = useState(1);
    const [videoURL, setVideoURL] = useState("");
    const [thumbnailURL, setThumbnailURL] = useState("");
    const [videoLength, setVideoLength] = useState(0);
    const modalsMap = {
        1: <Modal1
            videoURL={videoURL}
            setVideoURL={setVideoURL}
            videoLength={videoLength}
            setVideoLength={setVideoLength}
        />,
        2: <Modal2
            thumbnailURL={thumbnailURL}
            setThumbnailURL={setThumbnailURL}
            videoURL={videoURL}
            setVideoURL={setVideoURL}
            videoLength={videoLength}
            setVideoLength={setVideoLength}
            onClose={() => {
                onClose();
                setCurrModal(1);
            }}
        />,
    };

    return (
        <>
            {(isOpen === true)
                ?
                <>
                    <div className="fixed z-50 inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                        <div className="w-4/5 lg:w-2/5 mx-auto p-6 bg-white shadow-md rounded-xl overflow-y-auto max-h-screen">
                            <h2 className="text-2xl font-semibold mb-4">
                                <IoIosCloseCircleOutline
                                    onClick={() => setOpenCancelModal(true)}
                                    className="cursor-pointer float-right"
                                />
                            </h2>
                            <div>
                                {modalsMap[currModal]}
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-x-1">
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600 max-smw-full w-fit"
                                    onClick={() => setOpenCancelModal(true)}
                                >Cancel</button>
                                {currModal === 2 ? <></> :
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600 max-smw-full w-fit disabled:cursor-not-allowed disabled:bg-green-300 disabled:opacity-50 disabled:hover:bg-green-300"
                                        disabled={videoURL === ""}
                                        onClick={() => {
                                            if (videoURL === "") {
                                                toast.error("Please upload a video file");
                                                return;
                                            }
                                            setCurrModal(currModal + 1);
                                        }}
                                    >Next</button>
                                }
                            </div>
                        </div>
                    </div>

                    <CancelConfirmationModal
                        isOpen={openCancelModal}
                        onClose={() => {
                            onClose();
                            setCurrModal(1);
                            setOpenCancelModal(false);
                        }}
                        onCloseWithoutSaving={() => setOpenCancelModal(false)}
                        videoURL={videoURL}
                        thumbnailURL={thumbnailURL}
                        setVideoURL={setVideoURL}
                        setThumbnailURL={setThumbnailURL}
                    />
                </>
                :
                <></>
            }
        </>
    );
};

function Modal1({ videoURL, setVideoURL, videoLength, setVideoLength }) {
    return (
        <>
            <h2 className="text-2xl font-semibold mb-4">Upload your Video</h2>
            <p className="mb-4">Please upload a video file</p>

            <div className="w-full">
                <CldUploadWidget signatureEndpoint="/api/sign-cloudinary-params"
                    options={{
                        "sources": ["local"],
                        "multiple": false,
                        "maxFiles": 1,
                        "buttonCaption": "Upload Video",
                        "resourceType": "video",
                        "folder": "chirp-play",
                        "clientAllowedFormats": "mp4",
                    }}
                    onError={(error) => {
                        toast.error(error.message);
                    }}
                    onSuccess={(response) => {
                        setVideoURL(response.info.secure_url);
                        setVideoLength(response.info.duration);
                    }}
                    
                >
                    {({ open }) => {
                        return (
                            <>
                                {videoURL ?
                                    <div className="flex flex-col items-center justify-center my-4">
                                        <CldVideoPlayer
                                            width="400"
                                            height="400"
                                            src={videoURL}
                                            className="rounded-md w-60 h-40"
                                            logo={false}
                                            alt="Description of my image"
                                        />
                                        <p>
                                            Video uploaded successfully, Please continue to the next step
                                        </p>
                                    </div>
                                    :
                                    <button onClick={() => open()}
                                        className="border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700 w-full h-fit px-4 py-2 rounded-md flex flex-col items-center cursor-pointer"
                                    ><p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">
                                            MP4 files only, other formats will be accepted soon
                                        </p>
                                        <p
                                            className="bg-gray-500 p-4 rounded-full text-white"
                                        ><IoCloudUploadOutline className="inline-block text-2xl" /> </p>
                                        <span className="text-indigo-600">Click to Upload</span> or drag and drop files here
                                    </button>
                                }
                            </>
                        );
                    }}
                </CldUploadWidget>
            </div>
        </>
    );
};

function Modal2({ thumbnailURL, setThumbnailURL, videoURL, setVideoURL, videoLength, setVideoLength, onClose }) {
    const [state, submitAction] = useActionState(videoUpload, null);

    useEffect(() => {
        if (state?.status === 200) {
            toast.success(state?.message, {
                onClose: () => {
                    document.getElementById("videoUploadForm").reset();
                    setThumbnailURL("");
                    setVideoURL("");
                    setVideoLength(0);
                    onClose();
                },
            });
        }
        else if (state?.status !== 200) {
            toast.error(state?.message);
        }
    }, [setThumbnailURL, setVideoURL, state, onClose, setVideoLength]);

    return (
        <>
            <div>
                <h2 className="text-2xl font-semibold mb-4">Upload Details</h2>
                <p className="mb-4">Kindly fill the following details</p>
                <div className="w-full">
                    <CldUploadWidget signatureEndpoint="/api/sign-cloudinary-params"
                        options={{
                            "sources": ["local"],
                            "multiple": false,
                            "maxFiles": 1,
                            "buttonCaption": "Upload Thumbnail",
                            "text": "Upload Thumbnail",
                            "resourceType": "image",
                            "folder": "chirp-play",
                            "clientAllowedFormats": "svg,png,jpg",
                        }}
                        onError={(error) => {
                            toast.error(error.message);
                        }}
                        onSuccess={(response) => {
                            setThumbnailURL(response.info.secure_url);

                        }}
                    >
                        {({ open }) => {
                            return (
                                <>
                                    {thumbnailURL ?
                                        <div className="flex flex-col items-center justify-center my-4">
                                            <CldImage
                                                width="400"
                                                height="400"
                                                src={thumbnailURL}
                                                sizes="100vw"
                                                className="rounded-md w-full h-40"
                                                alt="Description of my image"
                                            />
                                            <p>
                                                Thumbnail uploaded successfully, Please continue filling the form
                                            </p>
                                        </div> :
                                        <button onClick={open}
                                            className="border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700 w-full h-fit px-4 py-2 rounded-md flex flex-col items-center cursor-pointer"
                                        ><p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">
                                                SVG, PNG, JPG or GIF
                                            </p>
                                            <p
                                                className="bg-gray-500 p-4 rounded-full text-white"
                                            ><IoCloudUploadOutline className="inline-block text-2xl" /> </p>
                                            <span className="text-indigo-600">Click to Upload</span> or drag and drop files here
                                        </button>
                                    }
                                </>
                            );
                        }}
                    </CldUploadWidget>
                    <form action={submitAction} id="videoUploadForm">
                        <div className="mt-4">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title*</label>
                            <input type="text" name="title" required id="title" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 peer placeholder-transparent" />
                        </div>
                        <div className="my-4">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description*</label>
                            <textarea name="description" id="description" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 peer placeholder-transparent" />
                        </div>
                        <input type="text" name="videoURL" id="videoURL" value={videoURL} required hidden />
                        <input type="text" name="thumbnailURL" id="thumbnailURL" value={thumbnailURL} required hidden />
                        <input type="text" name="videoLength" id="videoLength" value={videoLength} required hidden />
                        <SubmitButton title="Publish Video" size="fit" />
                    </form>
                </div>
            </div>

        </>
    );
};

function CancelConfirmationModal({ isOpen, onClose, onCloseWithoutSaving, videoURL, thumbnailURL, setVideoURL, setThumbnailURL }) {
    const [buttonDisabled, setButtonDisabled] = useState(false);
    return (
        <>
            {(isOpen === true)
                ?
                <div className="fixed z-50 inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center text-balance">
                    <div className="w-4/5 lg:w-2/5 mx-auto p-6 bg-white shadow-md rounded-md overflow-y-auto max-h-screen">
                        <p>
                            Are you sure you want to remove discard this video? You will lose all the progress made so far.
                        </p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    onCloseWithoutSaving();
                                }}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-100 text-gray-800 rounded-md mr-4"
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md disabled:cursor-not-allowed disabled:bg-red-300 disabled:opacity-50 disabled:hover:bg-red-300"
                                disabled={buttonDisabled}
                                onClick={async (e) => {
                                    e.preventDefault();
                                    setButtonDisabled(!buttonDisabled);
                                    let res = await cancelledModalVideoDelete(thumbnailURL, videoURL);
                                    if (res.status === 200) {
                                        toast.success(res.message, {
                                            onClose: () => {
                                                setVideoURL("");
                                                setThumbnailURL("");
                                                onClose();
                                            },
                                            onClick: () => {
                                                setVideoURL("");
                                                setThumbnailURL("");
                                                onClose();
                                            }
                                        });
                                    }
                                    else {
                                        toast.error(res.message, {
                                            onClose: () => {
                                                setVideoURL("");
                                                setThumbnailURL("");
                                                onClose();
                                            },
                                            onClick: () => {
                                                setVideoURL("");
                                                setThumbnailURL("");
                                                onClose();
                                            }
                                        });
                                    }
                                }}
                            >
                                {buttonDisabled ? <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div> : <>Yes</>}
                            </button>
                        </div>
                    </div>
                </div>
                :
                <></>
            }
        </>
    );
};