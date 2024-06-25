"use server";

import connectDB from "@root/actions/db/connectDB";
import mongoose from "mongoose";
import Video from "@root/models/Video";
import User from "@root/models/User";
import { revalidatePath } from "next/cache";
import { getUserData } from "./user/data";

export const getAllVideos = async () => {
    try {
        await connectDB();
        const videos = await Video.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner"
                }
            },
            {
                $unwind: "$owner"
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    duration: 1,
                    views: 1,
                    createdAt: 1,
                    thumbnail: 1,
                    owner: {
                        _id: 1,
                        name: 1,
                        avatar: 1
                    }
                }
            }
        ]);
        return {
            status: 200,
            videos: JSON.parse(JSON.stringify(
                [...videos, ...videos, ...videos, ...videos, ...videos, ...videos, ...videos, ...videos, ...videos, ...videos] // to simulate more videos
            ))
        };
    }
    catch (error) {
        return { status: 500, message: error.message };
    }
};

export const getVideoData = async (videoId) => {
    try {
        await connectDB();
        const currUser = (await getUserData()).user?._id;
        const videoData = await Video.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(videoId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                    pipeline: [
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
                                    $size: {
                                        $ifNull: ["$subscribers", []]
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                isSub: {
                                    $in: [new mongoose.Types.ObjectId(currUser), "$subscribers.subscriber"]
                                }
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    isSub: {
                        $arrayElemAt: ["$owner.isSub", 0]
                    },
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
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "contentID",
                    as: "likes",
                }
            },
            {
                $addFields: {
                    totalLikes: {
                        $size: {
                            $ifNull: ["$likes", []]
                        }
                    }
                }
            },
            {
                $addFields: {
                    isLikedByCurrUser: {
                        $in: [new mongoose.Types.ObjectId(currUser), "$likes.likedBy"]
                    }
                }
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "video",
                    as: "comments",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "owner",
                                pipeline: [
                                    {
                                        $project: {
                                            _id: 1,
                                            name: 1,
                                            username: 1,
                                            avatar: 1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $addFields: {
                                isCurrUserOwnerOfComment: {
                                    $in: [new mongoose.Types.ObjectId(currUser), "$owner._id"]
                                }
                            }
                        },
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
                                totalLikes: {
                                    $size: {
                                        $ifNull: ["$likes", []]
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                isLikedByCurrUser: {
                                    $in: [new mongoose.Types.ObjectId(currUser), "$likes.likedBy"]
                                }
                            }
                        },
                        {
                            $sort: { createdAt: -1 }
                        },
                        {
                            $project: {
                                owner: {
                                    $arrayElemAt: ["$owner", 0]
                                },
                                content: 1,
                                createdAt: 1,
                                isCurrUserOwnerOfComment: 1,
                                totalLikes: 1,
                                isLikedByCurrUser: 1
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    thumbnail: 1,
                    videoFile: 1,
                    views: 1,
                    duration: 1,
                    createdAt: 1,
                    owner: {
                        _id: 1,
                        name: 1,
                        avatar: 1,
                        totalSubscribers: 1
                    },
                    isSub: 1,
                    totalLikes: 1,
                    isLikedByCurrUser: 1,
                    comments: 1
                }
            }
        ]);
        return {
            status: 200,
            video: JSON.parse(JSON.stringify(videoData)),
        };
    }
    catch (error) {
        return { status: 500, message: error.message };
    }
};

export const increaseVideoView = async (videoId) => {
    try {
        await connectDB();
        await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
        let userData = await getUserData();
        if (userData.status === 200) {
            await User.findByIdAndUpdate(userData.user._id, { $addToSet: { watchHistory: videoId } });
        }
        revalidatePath(`/video/${videoId}`);
        revalidatePath("/dashboard");
        return { status: 200 };
    }
    catch (error) {
        return { status: 500, message: error.message };
    }
};

export const suggestedVideos = async (videoId) => {
    try {
        await connectDB();
        const videos = await Video.find({ _id: { $ne: videoId } }).limit(10).populate("owner", "name username avatar coverImage");
        return {
            status: 200,
            videos: JSON.parse(JSON.stringify([...videos]))
        };
    }
    catch (error) {
        return { status: 500, message: error.message };
    }
};

export const searchVideos = async (query) => {
    try {
        await connectDB();
        const videos = await Video.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
                {
                    owner: {
                        $in: await User.find({
                            $or: [
                                { name: { $regex: query, $options: "i" } },
                                { username: { $regex: query, $options: "i" } }
                            ]
                        }).distinct("_id")
                    }
                }
            ]
        }).populate("owner", "name username avatar");
        revalidatePath(`/search?q=${query}`);
        return {
            status: 200,
            videos: JSON.parse(JSON.stringify(videos))
        };
    }
    catch (error) {
        return { status: 500, message: error.message };
    }
};