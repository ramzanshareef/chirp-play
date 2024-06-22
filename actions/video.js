"use server";

import connectDB from "@root/actions/db/connectDB";
import mongoose from "mongoose";
import Comment from "@root/models/Comment";
import Video from "@root/models/Video";
import User from "@root/models/User";
import { revalidatePath } from "next/cache";
import { getUserData } from "./user/data";

export const getAllVideos = async () => {
    try {
        await connectDB();
        const videos = await Video.find({}).populate("owner", "name username avatar coverImage");
        return {
            status: 200,
            videos: JSON.parse(JSON.stringify(videos))
        };
    }
    catch (error) {
        return { status: 500, message: error.message };
    }
};

export const getVideo = async (videoId) => {
    try {
        await connectDB();
        const video = await Video.findById(videoId).populate("owner", "name username avatar coverImage");
        const comments = await Comment.aggregate([
            {
                $match: { video: new mongoose.Types.ObjectId(videoId) }
            },
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
                    content: 1,
                    createdAt: 1,
                    owner: {
                        name: 1,
                        username: 1,
                        avatar: 1
                    }
                }
            }
        ]);
        return {
            status: 200,
            video: JSON.parse(JSON.stringify(video)),
            comments: JSON.parse(JSON.stringify(comments))
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