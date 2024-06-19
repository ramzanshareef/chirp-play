"use server";

import connectDB from "@root/actions/db/connectDB";
import Video from "@root/models/Video.model";
import { unstable_noStore } from "next/cache";

export const getAllVideoes = async () => {
    try {
        await connectDB();
        const videos = await Video.find({}).populate("owner", "name username avatar coverImage");
        return {
            status: 200,
            videos: JSON.parse(JSON.stringify([...videos]))
        };
    }
    catch (error) {
        return { status: 500, message: error.message };
    }
};

export const getVideo = async (videoId) => {
    unstable_noStore();
    try {
        await connectDB();
        const video = await Video.findById(videoId).populate("owner", "name username avatar coverImage");
        return {
            status: 200,
            video: JSON.parse(JSON.stringify(video))
        };
    }
    catch (error) {
        return { status: 500, message: error.message };
    }
};

export const increaseVideoView = async (videoId) => {
    // have to add a check to prevent multiple views from the same user
    try {
        await connectDB();
        await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
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