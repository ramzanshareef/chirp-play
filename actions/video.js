"use server";

import connectDB from "@root/actions/db/connectDB";
import Comment from "@root/models/Comment";
import Video from "@root/models/Video";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export const getAllVideoes = async () => {
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