"use server";

import connectDB from "@root/actions/db/connectDB";
import Subscription from "@root/models/Subscription";
import User from "@root/models/User";
import { getSession } from "@root/utils/session";
import mongoose from "mongoose";

export const getDashboardData = async () => {
    try {
        await connectDB();
        let session = await getSession();
        if (session && session.isAuth === true) {
            const userData = await User.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId("666e7ba16198230b2980d9b4")
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

export const getUsersSubsribedData = async () => {
    try {
        await connectDB();
        let session = await getSession();
        if (session && session.isAuth === true) {
            let userData = await getUserData();
            if (userData.status === 200) {
                let subscribedUsers = await Subscription.aggregate([
                    {
                        $match: {
                            subscriber: new mongoose.Types.ObjectId(userData.user._id)
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "channel",
                            foreignField: "_id",
                            as: "channel",
                        }
                    },
                    { $unwind: "$channel" },
                    { $project: { "channel.password": 0, "channel.__v": 0, "channel.watchHistory": 0, "channel.coverImage": 0, "channel.email": 0, "channel.updatedAt": 0 } },
                ]);
                return {
                    status: 200,
                    message: "Subscribed users data fetched",
                    subscribedUsers: JSON.parse(JSON.stringify(subscribedUsers))
                };
            }
            else {
                return { status: 401, message: "Unauthorized" };
            }
        }
        else {
            return { status: 401, message: "Unauthorized" };
        }
    }
    catch (err) {
        return { status: 500, message: "Internal Server Error " + err.message };
    }
};