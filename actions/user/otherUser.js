"use server";

import User from "@root/models/User";
import connectDB from "../db/connectDB";
import mongoose from "mongoose";
import { getUserData } from "./data";

export async function getAUserData(userID) {
    try {
        await connectDB();
        const loggedUserData = await getUserData();
        let isAuth = false;
        let isCurrentUser = false;
        if (loggedUserData?.user?._id) isAuth = true;
        if (loggedUserData?.user?._id === userID) isCurrentUser = true;
        const userDetails = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userID)
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
                                as: "videoLikes"
                            }
                        },
                        {
                            $sort: {
                                createdAt: -1
                            }
                        },
                        {
                            $project: {
                                title: 1,
                                // description: 1,
                                thumbnail: 1,
                                // videoFile: 1,
                                views: 1,
                                createdAt: 1,
                                duration: 1,
                                // likes: { $size: "$videoLikes" }
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "chirps",
                    localField: "_id",
                    foreignField: "owner",
                    as: "chirps",
                    pipeline: [
                        {
                            $lookup: {
                                from: "likes",
                                localField: "_id",
                                foreignField: "contentID",
                                as: "chirpLikes",
                            }
                        },
                        {
                            $addFields: {
                                isLikedByLoggedUser: {
                                    $cond: {
                                        if: {
                                            $in: [
                                                new mongoose.Types.ObjectId(loggedUserData?.user?._id),
                                                "$chirpLikes.likedBy"]
                                        },
                                        then: true,
                                        else: false
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                totalLikes: {
                                    $size: {
                                        $ifNull: ["$chirpLikes", []]
                                    }
                                }
                            }
                        },
                        {
                            $sort: { createdAt: -1 }
                        },
                        {
                            $project: {
                                content: 1,
                                createdAt: 1,
                                totalLikes: 1,
                                isLikedByLoggedUser: 1
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "subscriber",
                    as: "subscribedByUser",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "channel",
                                foreignField: "_id",
                                as: "channelDetails",
                            }
                        },
                        {
                            $lookup: {
                                from: "subscriptions",
                                localField: "channel",
                                foreignField: "channel",
                                as: "channelSubscribers"
                            }
                        },
                        {
                            $addFields: {
                                "_id": {
                                    $arrayElemAt: ["$channelDetails._id", 0]
                                },
                                "name": {
                                    $arrayElemAt: ["$channelDetails.name", 0]
                                },
                                "username": {
                                    $arrayElemAt: ["$channelDetails.username", 0]
                                },
                                "avatar": {
                                    $arrayElemAt: ["$channelDetails.avatar", 0]
                                },
                                "totalSubscribers": { $size: "$channelSubscribers" }
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                username: 1,
                                avatar: 1,
                                totalSubscribers: 1
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "channel",
                    as: "subscribersToUser",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "subscriber",
                                foreignField: "_id",
                                as: "subscriberDetails",
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                subscriber: 1,
                                subscriberDetails: {
                                    name: 1,
                                    username: 1,
                                    avatar: 1
                                }
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    isSubscribed: {
                        $cond: {
                            if: {
                                $in: [
                                    new mongoose.Types.ObjectId(loggedUserData?.user?._id),
                                    "$subscribersToUser.subscriber"
                                ]
                            },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $unwind: {
                    path: "$subscribersToUser",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "subscribersToUser.subscriber",
                    foreignField: "channel",
                    as: "subscribersToUsersSubscribers",
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    username: 1,
                    avatar: 1,
                    coverImage: 1,
                    createdAt: 1,
                    isSubscribed: 1,
                    videos: 1,
                    chirps: 1,
                    subscribers: 1,
                    subscribersToUser: 1,
                    subscribersToUsersSubscribers: 1,
                    subscribedByUser: 1
                }
            }
        ]);
        return {
            status: 200,
            user: JSON.parse(JSON.stringify(userDetails)),
            isAuth: isAuth,
            isCurrentUser: isCurrentUser
        };
    }
    catch (error) {
        return { status: 500, message: error.message };
    }
}