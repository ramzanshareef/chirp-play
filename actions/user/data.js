"use server";

import connectDB from "@root/actions/db/connectDB";
import Like from "@root/models/Like";
import User from "@root/models/User";
import { getSession } from "@root/utils/session";
import mongoose from "mongoose";
import { v2 as Cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

Cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const getDashboardData = async () => {
    try {
        await connectDB();
        let session = await getSession();
        if (session && session.isAuth === true) {
            const userData = await User.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(session.user._id)
                    }
                },
                {
                    $lookup: {
                        from: "videos",
                        localField: "_id",
                        foreignField: "owner",
                        as: "videos",
                        pipeline: [
                            {
                                $lookup: {
                                    from: "likes",
                                    localField: "_id",
                                    foreignField: "contentID",
                                    as: "likes",
                                }
                            },
                            {
                                $addFields: {
                                    likes: { $size: "$likes" }
                                }
                            },
                            {
                                $project: {
                                    thumbnail: 1,
                                    title: 1,
                                    description: 1,
                                    duration: 1,
                                    views: 1,
                                    createdAt: 1,
                                    likes: 1
                                }
                            }
                        ]
                    }
                },
                {
                    $addFields: {
                        totalViews: {
                            $sum: "$videos.views"
                        }
                    }
                },
                {
                    $addFields: {
                        totalLikes: {
                            $sum: "$videos.likes"
                        }
                    }
                },
                {
                    $lookup: {
                        from: "subscriptions",
                        localField: "_id",
                        foreignField: "channel",
                        as: "subscribers",
                    }
                },
                {
                    $addFields: {
                        totalSubscribers: {
                            $size: "$subscribers"
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        name: 1,
                        videos: 1,
                        totalViews: 1,
                        totalLikes: 1,
                        totalSubscribers: 1
                    }
                }
            ]);
            return {
                status: 200,
                userData: JSON.parse(JSON.stringify(userData[0])),
            };
        }
        else {
            return { status: 401, message: "Unauthorized" };
        }
    }
    catch (err) {
        return { status: 500, message: "Internal Server Error " + err.message };
    }
};

export const getUserData = async () => {
    try {
        await connectDB();
        let session = await getSession();
        if (session && session.isAuth === true) {
            let user = await User.findOne({ email: session.user.email }).select("-password -__v").lean();
            return {
                status: 200,
                message: "User data fetched",
                user: JSON.parse(JSON.stringify(user))
            };
        }
        else {
            return { status: 401, message: "Unauthorized" };
        }
    }
    catch (err) {
        return { status: 500, message: "Internal Server Error " + err.message };
    }
};

export const getUserLikedVideos = async () => {
    try {
        await connectDB();
        let userData = await getUserData();
        if (userData.status !== 200) return { status: userData.status, message: userData.message };
        let likedVideosData = await Like.aggregate([
            {
                $match: {
                    likedBy: new mongoose.Types.ObjectId(userData.user._id),
                    onModel: "Video"
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "contentID",
                    foreignField: "_id",
                    as: "video",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "owner"
                            }
                        },
                        {
                            $addFields: {
                                owner: { $arrayElemAt: ["$owner", 0] }
                            }
                        },
                        {
                            $project: {
                                title: 1,
                                description: 1,
                                thumbnail: 1,
                                videoFile: 1,
                                duration: 1,
                                views: 1,
                                createdAt: 1,
                                owner: {
                                    _id: 1,
                                    name: 1,
                                    avatar: 1
                                }
                            }
                        },
                    ]
                },
            },
            {
                $addFields: {
                    video: { $arrayElemAt: ["$video", 0] }
                }
            },
            {
                $project: {
                    _id: 0,
                    video: 1
                }
            }
        ]);
        return {
            status: 200,
            message: "Liked videos fetched",
            likedVideos: JSON.parse(JSON.stringify(likedVideosData))
        };
    }
    catch (err) {
        return { status: 500, message: "Internal Server Error " + err.message };
    }
};

export const getUserWatchHistory = async () => {
    try {
        await connectDB();
        let userData = await getUserData();
        if (userData.status !== 200) return { status: userData.status, message: userData.message };
        let watchHistoryData = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userData.user._id)
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "watchHistory",
                    foreignField: "_id",
                    as: "watchHistory",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "owner"
                            }
                        },
                        {
                            $addFields: {
                                owner: {
                                    $arrayElemAt: ["$owner", 0]
                                }
                            }
                        },
                        {
                            $project: {
                                title: 1,
                                description: 1,
                                thumbnail: 1,
                                views: 1,
                                duration: 1,
                                createdAt: 1,
                                owner: {
                                    _id: 1,
                                    name: 1,
                                    avatar: 1
                                }
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    watchHistory: 1
                }
            }
        ]);
        return {
            status: 200,
            message: "Watch history fetched",
            watchHistory: JSON.parse(JSON.stringify(watchHistoryData[0].watchHistory))
        };
    }
    catch (err) {
        return { status: 500, message: "Internal Server Error " + err.message };
    }
};

export const editUserAvatar = async (currentState, formData) => {
    try {
        let userData = await getUserData();
        if (userData.status !== 200) return { status: userData.status, message: userData.message };
        let newAvatarURL = formData.get("avatarURL");
        if (newAvatarURL === null || newAvatarURL.trim() === "") return { status: 400, message: "Bad Request" };
        await connectDB();
        if (userData.user.avatar !== "https://res.cloudinary.com/cloudformedia/image/upload/chirp-play/avatar-default.jpg") {
            Cloudinary.api.delete_resources(["chirp-play/" + userData.user.avatar.split("/").pop().split(".")[0]], { resource_type: "image" }, (error) => {
                if (error) return { status: 500, message: "Internal Server Error" };
            });
        }
        await User.updateOne({ email: userData.user.email }, { avatar: newAvatarURL });
        revalidatePath(`/user/${userData.user._id}`);
        return { status: 200, message: "Avatar updated Successfully 😊" };
    }
    catch (err) {
        return { status: 500, message: "Internal Server Error " + err.message };
    }
};

export const editUserCover = async (currentState, formData) => {
    try {
        let userData = await getUserData();
        if (userData.status !== 200) return { status: userData.status, message: userData.message };
        let newCoverImageURL = formData.get("coverImageURL");
        if (newCoverImageURL === null || newCoverImageURL.trim() === "") return { status: 400, message: "Bad Request" };
        await connectDB();
        if (userData.user.coverImage !== "https://res.cloudinary.com/cloudformedia/image/upload/chirp-play/coverimage-default.png") {
            Cloudinary.api.delete_resources(["chirp-play/" + userData.user.coverImage.split("/").pop().split(".")[0]], { resource_type: "image" }, (error) => {
                if (error) return { status: 500, message: "Internal Server Error" };
            });
        }
        await User.updateOne({ email: userData.user.email }, { coverImage: newCoverImageURL });
        revalidatePath(`/user/${userData.user._id}`);
        return { status: 200, message: "Cover Image updated Successfully 😊" };
    }
    catch (err) {
        return { status: 500, message: "Internal Server Error " + err.message };
    }
};

export const deleteAvatarCoverModalClosed = async (coverURL) => {
    try {
        if (coverURL) {
            Cloudinary.api.delete_resources(["chirp-play/" + coverURL.split("/").pop().split(".")[0]], { resource_type: "image" }, (error) => {
                if (error) return { status: 500, message: "Internal Server Error" };
            });
        }
        return { status: 200, message: "Cancelled Successfully" };
    }
    catch (error) {
        return { status: 500, message: "Internal Server Error " + error.message };
    }
};