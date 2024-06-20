/* eslint-disable no-unused-vars */
"use server";

import Video from "@root/models/Video";
import connectDB from "../db/connectDB";
import { getUserData } from "./data";
import { v2 as Cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import Subscription from "@root/models/Subscription";

Cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function videoUpload(currentState, formData) {
    let videoFile = formData.get("videoURL");
    let thumbnail = formData.get("thumbnailURL");
    let title = formData.get("title");
    let description = formData.get("description");
    let videoLength = formData.get("videoLength");
    if (videoFile.length === 0 || title.length === 0 || description.length === 0 || thumbnail.length === 0) {
        return { status: 400, message: "All fields are required" };
    }
    else {
        try {
            await connectDB();
            let userData = await getUserData();
            if (userData.status !== 200) {
                return { status: 401, message: "Unauthorized" };
            }
            await Video.create({
                owner: userData.user._id,
                videoFile,
                thumbnail,
                title,
                description,
                duration: parseInt(videoLength)
            });
            revalidatePath("/dashboard");
            return { status: 200, message: "Video uploaded successfully" };
        }
        catch (err) {
            return { status: 500, message: "Internal Server Error " + err.message };
        }
    }
}

export async function cancelledModalVideoDelete(thumbnailURL, videoURL) {
    try {
        if ((videoURL && videoURL.length > 0) && (!thumbnailURL)) {
            return new Promise((resolve, reject) => {
                Cloudinary.api.delete_resources(["chirp-play/" + videoURL.split("/").pop().split(".")[0]], { resource_type: "video" }, (error, result) => {
                    if (error) {
                        reject({ status: 500, message: "Internal Server Error " });
                    }
                    else {
                        resolve({ status: 200, message: "Video deleted successfully" });
                    }
                });
            });
        }
        else if ((videoURL && videoURL.length > 0) && (thumbnailURL && thumbnailURL.length > 0)) {
            return new Promise((resolve, reject) => {
                Cloudinary.api.delete_resources(["chirp-play/" + thumbnailURL.split("/").pop().split(".")[0]], { resource_type: "image" }, (error, result) => {
                    if (error) {
                        reject({ status: 500, message: "Internal Server Error " });
                    }
                    else {
                        Cloudinary.api.delete_resources(["chirp-play/" + videoURL.split("/").pop().split(".")[0]], { resource_type: "video" }, (error, result) => {
                            if (error) {
                                reject({ status: 500, message: "Internal Server Error " });
                            }
                            else {
                                resolve({ status: 200, message: "Image and video deleted successfully" });
                            }
                        });
                    }
                });
            });
        }
        else {
            return { status: 200, message: "Deleted Successfully!" };
        }
    }
    catch (err) {
        return { status: 500, message: "Internal Server Error " + err.message };
    }
}

export async function getUserVideos() {
    try {
        await connectDB();
        let userData = await getUserData();
        if (userData.status !== 200) {
            return { status: 401, message: "Unauthorized" };
        }
        let videos = await Video.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userData.user._id),
                },
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "contentID",
                    as: "likes",
                },
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    thumbnail: 1,
                    views: 1,
                    createdAt: 1,
                    duration: 1,
                    likes: { $size: "$likes" },
                },
            },
        ]);
        return {
            status: 200,
            videos: JSON.parse(JSON.stringify(videos))
        };
    }
    catch (err) {
        return { status: 500, message: "Internal Server Error " + err.message };
    }
}

export async function totalStatsofUser() {
    try {
        await connectDB();
        let userData = await getUserData();
        if (userData.status !== 200) {
            return { status: 401, message: "Unauthorized" };
        }
        const totalViews = await Video.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userData.user._id),
                },
            },
            {
                $group: {
                    _id: "$owner",
                    totalViews: { $sum: "$views" },
                },
            },
        ]);
        const totalLikes = await Video.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userData.user._id),
                },
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "contentID",
                    as: "likes",
                },
            },
            {
                $project: {
                    likes: { $size: "$likes" },
                },
            },
            {
                $group: {
                    _id: "$owner",
                    totalLikes: { $sum: "$likes" },
                },
            },
        ]);
        const totalSubscribers = await Subscription.aggregate([
            {
                $match: {
                    channel: new mongoose.Types.ObjectId(userData.user._id),
                },
            },
            {
                $group: {
                    _id: "$channel",
                    totalSubscribers: { $sum: 1 },
                },
            },
        ]);
        return {
            status: 200,
            totalViews: totalViews[0]?.totalViews || 0,
            totalLikes: totalLikes[0]?.totalLikes || 0,
            totalSubscribers: totalSubscribers[0]?.totalSubscribers || 0,
        };
    }
    catch (err) {
        return { status: 500, message: "Internal Server Error " + err.message };
    }
}