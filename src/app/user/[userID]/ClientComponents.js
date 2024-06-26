/* eslint-disable no-unused-vars */
/* eslint-disable indent */
"use client";

import { SubmitButton } from "@/components/buttons/SubmitButton";
import { subscribeHandlerToUser } from "@root/actions/Subscription.js/userProfile";
import { formatTime } from "@root/utils/time";
import moment from "moment";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useActionState, useOptimistic, useState, useTransition } from "react";
import { FiTwitter } from "react-icons/fi";
import { FaCamera, FaUserCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import { redirect, useRouter } from "next/navigation";
import { IoIosCloseCircleOutline, IoMdHeartEmpty } from "react-icons/io";
import { FcLike } from "react-icons/fc";
import { addChirp, deleteChirp, editChirp, likeChirpHandler } from "@root/actions/chirp";
import VideoUpload from "@/app/dashboard/Upload";
import { IoCloudUploadOutline, IoPlayOutline } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { BiSolidVideos } from "react-icons/bi";
import { SlSocialTwitter } from "react-icons/sl";
import { CgPlayList } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { MdDelete, MdOutlineInsertComment } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { deleteAvatarCoverModalClosed, editUserAvatar, editUserCover } from "@root/actions/user/data";
import UnderDevelopment from "@/components/UnderDevelopment";
import { SimpleLoader } from "@/components/loader";

export const AvatarAndCover = ({ userDetails }) => {
    const [showEditAvatarModal, setShowEditAvatarModal] = useState(false);
    const [showEditCoverModal, setShowEditCoverModal] = useState(false);

    return <>
        <div
            className="relative h-40 w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${userDetails?.user[0]?.coverImage})` }}
        >
            <div className="absolute bottom-0 left-4 transform translate-y-1/2">
                <Image
                    src={userDetails?.user[0]?.avatar}
                    alt={`${userDetails?.user[0]?.name}'s avatar`}
                    className="h-24 w-24 rounded-full border-4 border-white"
                    width={96}
                    height={96}
                />
                {userDetails.isCurrentUser &&
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-1">
                        <FaCamera className="text-lg text-gray-600 hover:text-gray-500 hover:cursor-pointer"
                            onClick={() => setShowEditAvatarModal(true)}
                        />
                    </div>
                }
            </div>
            {userDetails.isCurrentUser &&
                <div className="absolute bottom-0 right-0 bg-white rounded-tl-2xl p-1.5">
                    <FaCamera className="text-xl text-gray-600 hover:text-gray-500 hover:cursor-pointer"
                        onClick={() => setShowEditCoverModal(true)}
                    />
                </div>
            }
            <EditAvatarModal
                isOpen={showEditAvatarModal}
                onClose={() => setShowEditAvatarModal(false)}
            />
            <EditCoverModal
                isOpen={showEditCoverModal}
                onClose={() => setShowEditCoverModal(false)}
            />
        </div>
    </>;
};

export const EditAvatarModal = ({ isOpen, onClose }) => {
    const [avatarURL, setAvatarURL] = useState(null);
    const [state, formAction] = useActionState(editUserAvatar, null);

    useEffect(() => {
        if (state?.status === 200) {
            setAvatarURL("");
            onClose();
        }
        else if (state?.status !== 200 && state?.message) {
            toast.error(state.message, {
                onClick: () => {
                    setAvatarURL("");
                    onClose();
                },
                onClose: () => {
                    setAvatarURL("");
                    onClose();
                }
            });
        }
    }, [state, onClose]);

    return (
        <>
            {(isOpen === true)
                ?
                <div className="fixed z-50 inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <div className="w-4/5 lg:w-2/5 mx-auto p-6 bg-white shadow-md rounded-xl overflow-y-auto max-h-screen">
                        <h2 className="text-2xl font-semibold mb-4">
                            Upload your New Avatar
                            <IoIosCloseCircleOutline
                                onClick={async (e) => {
                                    e.preventDefault();
                                    let res = await deleteAvatarCoverModalClosed(avatarURL);
                                    if (res.status === 200) {
                                        toast.success(res.message, {
                                            onClick: () => {
                                                setAvatarURL("");
                                                onClose();
                                            },
                                            onClose: () => {
                                                setAvatarURL("");
                                                onClose();
                                            }
                                        });
                                    }
                                    else {
                                        toast.error(res.message, {
                                            onClick: () => {
                                                setAvatarURL("");
                                                onClose();
                                            },
                                            onClose: () => {
                                                setAvatarURL("");
                                                onClose();
                                            }
                                        });
                                    }
                                }}
                                className="cursor-pointer float-right"
                            />
                        </h2>
                        <div>
                            <CldUploadWidget signatureEndpoint="/api/sign-cloudinary-params"
                                options={{
                                    "sources": ["local"],
                                    "multiple": false,
                                    "maxFiles": 1,
                                    "buttonCaption": "Upload Avatar",
                                    "text": "Upload Avatar",
                                    "resourceType": "image",
                                    "folder": "chirp-play",
                                    "clientAllowedFormats": "svg,png,jpg",
                                    "maxFileSize": 10000000, // 10MB
                                }}
                                onError={(error) => {
                                    toast.error(error.message);
                                }}
                                onSuccess={(response) => {
                                    setAvatarURL(response.info.secure_url);
                                }}
                            >
                                {({ open }) => {
                                    return (
                                        <>
                                            {avatarURL ?
                                                <div className="flex flex-col items-center justify-center my-4">
                                                    <CldImage
                                                        width="400"
                                                        height="400"
                                                        src={avatarURL}
                                                        sizes="100vw"
                                                        className="rounded-md w-full h-40 sm:h-60"
                                                        alt="Description of my image"
                                                    />
                                                    <p>
                                                        Please Save to Update Changes
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
                            <form action={formAction} method="POST">
                                <input type="hidden" name="avatarURL" value={avatarURL} />
                                <div className="flex justify-between items-center mt-2">
                                    <SubmitButton
                                        title="Save"
                                        size="fit"
                                        className="font-normal"
                                    />
                                    <div
                                        className="flex justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600
                disabled:cursor-not-allowed disabled:shadow-none disabled:bg-red-400 disabled:hover:bg-red-400 disabled:focus-visible:outline-red-400 disabled:focus-visible:outline-offset-0 disabled:focus-visible:outline-2 hover:cursor-pointer"
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            let res = await deleteAvatarCoverModalClosed(avatarURL);
                                            if (res.status === 200) {
                                                toast.success(res.message, {
                                                    onClick: () => {
                                                        setAvatarURL("");
                                                        onClose();
                                                    },
                                                    onClose: () => {
                                                        setAvatarURL("");
                                                        onClose();
                                                    }
                                                });
                                            }
                                            else {
                                                toast.error(res.message, {
                                                    onClick: () => {
                                                        setAvatarURL("");
                                                        onClose();
                                                    },
                                                    onClose: () => {
                                                        setAvatarURL("");
                                                        onClose();
                                                    }
                                                });
                                            }
                                        }}
                                    >
                                        Cancel
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                :
                <></>
            }
        </>
    );
};

export const EditCoverModal = ({ isOpen, onClose }) => {
    const [coverURL, setCoverURL] = useState(null);
    const [state, formAction] = useActionState(editUserCover, null);

    useEffect(() => {
        if (state?.status === 200) {
            setCoverURL("");
            onClose();
        }
        else if (state?.status !== 200 && state?.message) {
            toast.error(state.message, {
                onClick: () => {
                    setCoverURL("");
                    onClose();
                },
                onClose: () => {
                    setCoverURL("");
                    onClose();
                }
            });
        }
    }, [state, onClose]);

    return (
        <>
            {(isOpen === true)
                ?
                <div className="fixed z-50 inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <div className="w-4/5 lg:w-2/5 mx-auto p-6 bg-white shadow-md rounded-xl overflow-y-auto max-h-screen">
                        <h2 className="text-2xl font-semibold mb-4">
                            Upload your New Cover Image
                            <IoIosCloseCircleOutline
                                onClick={async (e) => {
                                    e.preventDefault();
                                    let res = await deleteAvatarCoverModalClosed(coverURL);
                                    if (res.status === 200) {
                                        toast.success(res.message, {
                                            onClick: () => {
                                                setCoverURL("");
                                                onClose();
                                            },
                                            onClose: () => {
                                                setCoverURL("");
                                                onClose();
                                            }
                                        });
                                    }
                                    else {
                                        toast.error(res.message, {
                                            onClick: () => {
                                                setCoverURL("");
                                                onClose();
                                            },
                                            onClose: () => {
                                                setCoverURL("");
                                                onClose();
                                            }
                                        });
                                    }
                                }}
                                className="cursor-pointer float-right"
                            />
                        </h2>
                        <div>
                            <CldUploadWidget signatureEndpoint="/api/sign-cloudinary-params"
                                options={{
                                    "sources": ["local"],
                                    "multiple": false,
                                    "maxFiles": 1,
                                    "buttonCaption": "Upload Cover",
                                    "text": "Upload Cover",
                                    "resourceType": "image",
                                    "folder": "chirp-play",
                                    "clientAllowedFormats": "svg,png,jpg",
                                    "maxFileSize": 10000000, // 10MB
                                }}
                                onError={(error) => {
                                    toast.error(error.message);
                                }}
                                onSuccess={(response) => {
                                    setCoverURL(response.info.secure_url);
                                }}
                            >
                                {({ open }) => {
                                    return (
                                        <>
                                            {coverURL ?
                                                <div className="flex flex-col items-center justify-center my-4">
                                                    <CldImage
                                                        width="400"
                                                        height="400"
                                                        src={coverURL}
                                                        sizes="100vw"
                                                        className="rounded-md w-full h-40 sm:h-60"
                                                        alt="Description of my image"
                                                    />
                                                    <p>
                                                        Please Save to Update Changes
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
                            <form action={formAction} method="POST">
                                <input type="hidden" name="coverImageURL" value={coverURL} />
                                <div className="flex items-center justify-between mt-2">
                                    <SubmitButton
                                        title="Save"
                                        size="fit"
                                    />
                                    <div
                                        className="flex justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600
                disabled:cursor-not-allowed disabled:shadow-none disabled:bg-red-400 disabled:hover:bg-red-400 disabled:focus-visible:outline-red-400 disabled:focus-visible:outline-offset-0 disabled:focus-visible:outline-2 hover:cursor-pointer"
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            let res = await deleteAvatarCoverModalClosed(coverURL);
                                            if (res.status === 200) {
                                                toast.success(res.message, {
                                                    onClick: () => {
                                                        setCoverURL("");
                                                        onClose();
                                                    },
                                                    onClose: () => {
                                                        setCoverURL("");
                                                        onClose();
                                                    }
                                                });
                                            }
                                            else {
                                                toast.error(res.message, {
                                                    onClick: () => {
                                                        setCoverURL("");
                                                        onClose();
                                                    },
                                                    onClose: () => {
                                                        setCoverURL("");
                                                        onClose();
                                                    }
                                                });
                                            }
                                        }}
                                    >
                                        Cancel
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                :
                <></>
            }
        </>
    );
};

export const ContentBox = ({ userDetails, isAuth, activeTab, isCurrentUser }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const renderContent = () => {
        switch (activeTab) {
            case "videos":
                return <VideoContent
                    videos={userDetails?.user[0]?.videos}
                    isCurrentUser={isCurrentUser}
                />;
            case "chirps":
                return <ChirpsContent
                    userDetails={userDetails}
                    isCurrentUser={isCurrentUser}
                />;
            case "subscribed":
                return <SubrscribedContent
                    userDetails={userDetails}
                />;
            case "playlist":
                return <> {UnderDevelopment()} </>;
            default:
                return <>{UnderDevelopment()}</>;
        }
    };

    const renderTabs = ["videos", "chirps"];
    if (isCurrentUser) {
        renderTabs.push(...["subscribed", "playlist", "settings"]);
    }

    const renderTabsIcons = {
        videos: <BiSolidVideos size={20} />,
        chirps: <SlSocialTwitter size={20} />,
        subscribed: <FaUserCheck size={20} />,
        playlist: <CgPlayList size={20} />,
        settings: <IoSettingsOutline size={20} />
    };

    return <>
        <div className="mt-4">
            <div className="flex max-w-full overflow-x-scroll scrollbar-hide">
                {renderTabs.map((tab, index) => {
                    return <button
                        key={index}
                        className={`py-2 px-4 flex items-center justify-center overflow-x-scroll scrollbar-hide text-wrap ${activeTab === tab ? "border-b-4 border-b-indigo-600 text-indigo-600 bg-gray-200 rounded-t-lg" : "text-gray-600 hover:border-b-4 hover:border-b-indigo-600 hover:text-indigo-600 hover:bg-gray-200 hover:rounded-t-lg"}`}
                        onClick={(e) => {
                            e.preventDefault();
                            startTransition(() => {
                                router.push(`/user/${userDetails?.user[0]?._id}?tab=${tab}`);
                            });
                        }}
                        style={{
                            width: `${100 / renderTabs.length}%`
                        }}
                    >
                        <span className="max-sm:hidden">{tab[0].toUpperCase() + tab.slice(1)}</span>
                        <span className="hidden max-sm:block">{renderTabsIcons[tab]}</span>
                    </button>;
                })}
            </div>
            <div className="mt-4">
                {isPending ? <SimpleLoader /> : renderContent()}
            </div>
        </div >
    </>;
};

const VideoContent = ({ videos, isCurrentUser }) => {
    return <div
        className="flex flex-col gap-y-1 sm:gap-y-4"
    >
        <div
            className={` flex-row gap-x-4
                ${isCurrentUser ? "flex" : "hidden"}
            `}
        >
            <VideoUpload />
        </div>
        <div className="flex flex-wrap">
            {videos?.map((video, index) => {
                return <div className="w-full sm:w-1/4 overflow-hidden sm:pr-2 mb-4 sm:mb-2"
                    href={`/video/${video._id}`}
                    key={index}
                >
                    <div className="relative">
                        <Link href={`/video/${video._id}`}>
                            <CldImage
                                className="w-full h-48 object-cover hover:cursor-pointer rounded-2xl"
                                src={video.thumbnail}
                                alt={video.title}
                                key={video._id}
                                id={video._id}
                                width={1920}
                                height={1080}
                            />
                            <div className="absolute bottom-2 right-2 bg-white text-black bg-opacity-75 text-xs px-2 py-1 rounded">
                                {formatTime(video.duration)}
                            </div>
                        </Link>
                    </div>
                    <div className="flex items-start py-4">
                        <div className="flex-1">
                            <div className="font-bold mb-1">{video.title.length > 80 ? video.title.slice(0, 80) + "..." : video.title}</div>
                            <div className="text-gray-600 text-xs">{video.views} views • {moment(video.createdAt).fromNow()}</div>
                        </div>
                    </div>
                </div>;
            })}
            {videos?.length === 0
                &&
                <div className="w-fit mx-auto text-center flex flex-col items-center justify-center text-gray-600">
                    <IoPlayOutline size={40} />
                    <span>
                        No Videos Found 😫
                    </span>
                </div>}
        </div>
    </div>;
};

const ChirpsContent = ({ userDetails, isCurrentUser }) => {
    const [state, formAction] = useActionState(addChirp, null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [chirpToDelete, setChirpToDelete] = useState({});
    const [showEditModal, setShowEditModal] = useState(false);
    const [commentToEdit, setCommentToEdit] = useState({});

    const [optimisticChirps, setOptimisticChirps] = useOptimistic(userDetails?.user[0]?.chirps,
        (newChirp) => [newChirp, ...chirps]
    );

    useEffect(() => {
        if (state?.status !== 200 && state?.message) {
            toast.error(state?.message);
        }
    }, [state]);

    return (
        <>
            <div className={` flex-row gap-x-4 
                ${isCurrentUser ? "flex" : "hidden"}
            `} >
                <Image
                    src={userDetails?.user[0]?.avatar}
                    alt={userDetails?.user[0]?.name}
                    className="w-10 h-10 rounded-full"
                    width={40}
                    height={40}
                />
                <form action={formAction} className="w-full" id="chirpsForm">
                    <div className="flex items-center border-b border-indigo-500 pb-2 gap-x-2">
                        <textarea
                            type="text"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 peer placeholder-transparent"
                            required
                            placeholder="What's on your mind?"
                            minLength={5}
                            maxLength={140}
                            name="chirpContent"
                            id="chirpContent"
                        />
                        <SubmitButton
                            size="fit"
                            title={
                                <FiTwitter size={20} />
                            }
                            className="h-full bg-indigo-600 text-white hover:bg-indigo-700"
                        />
                    </div>
                </form>
            </div>

            <div className="flex flex-col gap-y-4 mt-4">
                {optimisticChirps?.map((chirp) => (
                    <div key={chirp._id} className="flex flex-row gap-x-4 border-b border-gray-200 pb-4">
                        <Image
                            src={userDetails?.user[0].avatar}
                            alt={userDetails?.user[0].name}
                            className="w-10 h-10 rounded-full"
                            width={40}
                            height={40}
                        />
                        <div className="flex flex-col w-full">
                            <div className="w-full flex flex-row justify-between">
                                <div className="flex items-center">
                                    <span className="font-semibold w-fit">{userDetails?.user[0].name}</span>
                                    <div className="text-gray-600 text-xs ml-2">
                                        {moment(chirp.createdAt).fromNow()}
                                    </div>
                                </div>
                                {isCurrentUser &&
                                    <div className="flex items-center gap-x-2">
                                        <MdDelete
                                            size={20}
                                            className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setChirpToDelete(chirp);
                                                setShowDeleteModal(true);
                                            }}
                                        />
                                        <TbEdit
                                            size={20}
                                            className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCommentToEdit(chirp);
                                                setShowEditModal(true);
                                            }}
                                        />
                                    </div>
                                }

                            </div>
                            <p>
                                {chirp.content}
                            </p>
                            <div className="flex items-center gap-x-2 text-gray-500 text-xs">
                                {chirp.isLikedByLoggedUser
                                    ? <FcLike size={20} className="cursor-pointer"
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            let res = await likeChirpHandler(chirp._id);
                                            if (res.status !== 200) {
                                                toast.error(res.message);
                                            }
                                        }}
                                    /> :
                                    <IoMdHeartEmpty size={20} className="cursor-pointer"
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            let res = await likeChirpHandler(chirp._id);
                                            if (res.status !== 200) {
                                                toast.error(res.message);
                                            }
                                        }}
                                    />}
                                <span>
                                    {chirp.totalLikes} likes
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                {optimisticChirps?.length === 0 &&
                    <div className="w-fit mx-auto text-center flex flex-col items-center justify-center text-gray-600">
                        <FiTwitter size={35} />
                        <span>
                            No Chirps Found 😫
                        </span>
                    </div>}
            </div>
            <DeleteChirpConfimationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                chirpToDelete={chirpToDelete}
            />
            <EditChirpModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                chirpToEdit={commentToEdit}
            />
        </>
    );
};

const DeleteChirpConfimationModal = ({ isOpen, onClose, chirpToDelete }) => {
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
                                Are you sure you want to delete the chirp &quot;<b>{chirpToDelete.content}</b>&quot;?
                                <span>
                                    This action cannot be undone, and this will <span className="text-red-600">permenantly</span> delete the chirp.
                                </span>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <button className="bg-red-500 hover:bg-red-700 text-white p-2 rounded"
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        let deleteResponse = await deleteChirp(chirpToDelete._id);
                                        if (deleteResponse.status === 200) {
                                            onClose();
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

const EditChirpModal = ({ isOpen, onClose, chirpToEdit }) => {
    const [state, formAction] = useActionState(editChirp, null);

    useEffect(() => {
        if (state?.status === 200) {
            onClose();
        }
        else if (state?.status !== 200 && state?.message) {
            toast.error(state.message);
        }
    }, [state, onClose]);

    return (
        <>
            {(isOpen === true)
                ?
                <>
                    <div className="fixed z-50 inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                        <div className="w-4/5 lg:w-2/5 mx-auto p-6 bg-white shadow-md rounded-xl overflow-y-auto max-h-screen">
                            <h2 className="text-2xl font-semibold mb-4">
                                Edit Chirp
                                <IoIosCloseCircleOutline
                                    onClick={onClose}
                                    className="cursor-pointer float-right"
                                />
                            </h2>
                            <div>
                                <form action={formAction} className="w-full">
                                    <textarea
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 peer placeholder-transparent"
                                        placeholder="Edit your Chirp..."
                                        name="chirpContent"
                                        required
                                        minLength={5}
                                        defaultValue={chirpToEdit.content}
                                    />
                                    <input type="hidden" name="chirpID" value={chirpToEdit._id} />
                                    <SubmitButton
                                        title={
                                            <>
                                                <MdOutlineInsertComment size={20} className="mr-2 sm:hidden" />
                                                <span className="max-sm:hidden">Save</span>
                                            </>
                                        }
                                        size="fit"
                                        className="ml-auto mt-2"
                                    />
                                </form>
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

const SubrscribedContent = ({ userDetails }) => {
    const [searchQuery, setSearchQuery] = useState("");
    if (!userDetails.isCurrentUser) redirect("/");

    const [pending, startTransition] = useTransition();
    const [result, action] = useActionState(subscribeHandlerToUser, null);

    const filteredSubscriptions = userDetails?.user[0]?.subscribedByUser?.filter(sub => {
        return sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || sub.username.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const FilteredResults = () => {
        if (filteredSubscriptions.length === 0) {
            return (
                <div className="w-fit mx-auto text-center flex flex-col items-center justify-center text-gray-600">
                    <FaUsers size={40} />
                    <span>
                        No results found for {searchQuery}
                    </span>
                </div>
            );
        }

        return filteredSubscriptions.map((sub, index) => (
            <div className="w-full overflow-hidden sm:pr-2 mb-4 sm:mb-2 flex flex-row gap-x-2" key={index}>
                <Link href={`/user/${sub._id}`}>
                    <Image
                        src={sub.avatar}
                        alt={sub.name}
                        className="w-10 h-10 rounded-full"
                        width={40}
                        height={40}
                    />
                </Link>
                <div className="flex flex-col">
                    <div className="flex items-center">
                        <div className="flex flex-row justify-center items-center gap-x-2">
                            <div className="font-bold">{sub.name}</div>
                            <div className="text-gray-600 text-xs">@{sub.username}</div>
                        </div>
                    </div>
                    <div className="text-gray-600 text-xs">
                        {sub.totalSubscribers} subscribers
                    </div>
                </div>
                <div className="ml-auto">
                    <button
                        className="flex items-center gap-2 rounded-md py-2 px-4 text-white hover:bg-red-700 bg-red-600"
                        onClick={async () => {
                            startTransition(async () => {
                                let pathToRevalidate = `/user/${userDetails?.user[0]?._id}?tab=subscribed`;
                                await action({
                                    userID: sub._id,
                                    pathToRevalidate: pathToRevalidate,
                                });
                            });
                        }}
                    >
                        <FaUserCheck size={20} />
                        <span className="hidden sm:block">UnSubscribe</span>
                    </button>
                </div>
            </div>
        ));
    };

    return (
        <>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by name or username"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 peer placeholder-transparent"
                />
            </div>
            <div className="flex flex-wrap gap-4">
                {filteredSubscriptions.length > 0 ? (
                    <FilteredResults />
                ) : (
                    <div className="w-fit mx-auto text-center flex flex-col items-center justify-center text-gray-600">
                        <FaUsers size={40} />
                        <span>No Subscriptions Found 😫</span>
                    </div>
                )}
            </div>
        </>
    );
};