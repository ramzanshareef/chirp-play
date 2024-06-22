"use server";

import User from "@root/models/User";
import connectDB from "../db/connectDB";
import mongoose from "mongoose";
import { getSubscribers } from "../channel/subscribe";
import Video from "@root/models/Video";
import Chirp from "@root/models/Chirp";
import Like from "@root/models/Like";

export async function getAUserData(userID) {
    try {
        await connectDB();
        const user = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userID),
                },
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    username: 1,
                    avatar: 1,
                    coverImage: 1,
                    createdAt: 1,
                },
            },
        ]);
        const userSubscribers = await getSubscribers(userID);
        const videos = await Video.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userID),
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
                    videoFile: 1,
                    views: 1,
                    createdAt: 1,
                    duration: 1,
                    likes: { $size: "$likes" },
                },
            },
        ]);
        const chirps = await Chirp.find({ owner: userID }).sort({ createdAt: -1 });
        const chirpLikes = await Like.find({ contentID: { $in: chirps.map((chirp) => chirp._id) } });
        return {
            status: 200,
            user: JSON.parse(JSON.stringify(user[0])),
            subscribers: JSON.parse(JSON.stringify(userSubscribers?.totalSubscribers)),
            videos: JSON.parse(JSON.stringify(videos)),
            chirps: JSON.parse(JSON.stringify(chirps)),
            chirpLikes: JSON.parse(JSON.stringify(chirpLikes)),
        };
    }
    catch (error) {
        return { status: 500, message: error.message };
    }
}