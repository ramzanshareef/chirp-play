/* eslint-disable no-unused-vars */
"use server";

import Video from "@root/models/Video.model";
import connectDB from "../db/connectDB";
import { getUserData } from "./data";
import { v2 as Cloudinary } from "cloudinary";

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
                description
            });
            return { status: 200, message: "Video uploaded successfully" };
        }
        catch (err) {
            return { status: 500, message: "Internal server error" + err.message };
        }
    }
}

export async function cancelledModalVideoDelete(thumbnailURL, videoURL) {
    try {
        if ((videoURL && videoURL.length > 0) && (!thumbnailURL)) {
            return new Promise((resolve, reject) => {
                Cloudinary.api.delete_resources(["chirp-play/" + videoURL.split("/").pop().split(".")[0]], { resource_type: "video" }, (error, result) => {
                    if (error) {
                        reject({ status: 500, message: "Internal server error" });
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
                        reject({ status: 500, message: "Internal server error" });
                    }
                    else {
                        Cloudinary.api.delete_resources(["chirp-play/" + videoURL.split("/").pop().split(".")[0]], { resource_type: "video" }, (error, result) => {
                            if (error) {
                                reject({ status: 500, message: "Internal server error" });
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
        return { status: 500, message: "Internal server error" + err.message };
    }
}