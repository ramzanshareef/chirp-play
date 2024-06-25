/* eslint-disable no-unused-vars */
"use server";

import Video from "@root/models/Video";
import connectDB from "../db/connectDB";
import { getUserData } from "./data";
import { v2 as Cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import Like from "@root/models/Like";
import Comment from "@root/models/Comment";
import User from "@root/models/User";

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
    if (videoFile.length === 0 || title.length === 0 || description.length === 0) {
        return { status: 400, message: "All fields are required" };
    }
    else {
        try {
            await connectDB();
            let userData = await getUserData();
            if (userData.status !== 200) {
                return { status: 401, message: "Unauthorized" };
            }
            if (thumbnail.length === 0) {
                await Video.create({
                    owner: userData.user._id,
                    videoFile: videoFile,
                    title: title,
                    duration: videoLength,
                    description: description,
                });
            }
            else {
                await Video.create({
                    owner: userData.user._id,
                    videoFile: videoFile,
                    title: title,
                    description: description,
                    duration: videoLength,
                    thumbnail: thumbnail,
                });
            }
            revalidatePath("/dashboard");
            revalidatePath("/user/" + userData.user._id);
            revalidatePath("/user/" + userData.user._id + "?tab=videos");
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

export async function deleteVideo(videoID) {
    try {
        await connectDB();
        let userData = await getUserData();
        let videoToDelete = await Video.findById(videoID);
        if (!videoToDelete) {
            return { status: 404, message: "Video not found" };
        }
        Cloudinary.api.delete_resources(["chirp-play/" + videoToDelete.videoFile.split("/").pop().split(".")[0]], { resource_type: "video" }, (error) => {
            if (error) {
                return { status: 500, message: "Internal Server Error " + error.message };
            }
        });
        if (videoToDelete.thumbnail !== "https://res.cloudinary.com/cloudformedia/image/upload/v1719156912/chirp-play/demo-thumbnail-for-videos.png") {
            Cloudinary.api.delete_resources(["chirp-play/" + videoToDelete.thumbnail.split("/").pop().split(".")[0]], { resource_type: "image" }, (error) => {
                if (error) {
                    return { status: 500, message: "Internal Server Error " + error.message };
                }
            });
        }
        await User.updateMany({}, {
            $pull: {
                watchHistory: videoID
            }
        });

        await Video.findByIdAndDelete(videoID);
        await Like.deleteMany({
            "contentID": videoID,
            "onModel": "Video"
        });
        await Comment.deleteMany({
            "video": videoID
        });
        revalidatePath("/dashboard");
        revalidatePath("/user/" + userData?.user?._id);
        revalidatePath("/user/" + userData?.user?._id + "?tab=videos");
        return { status: 200, message: "Video Deleted Successfully" };
    }
    catch (err) {
        return { status: 500, message: "Internal Server Error " + err.message };
    }
}