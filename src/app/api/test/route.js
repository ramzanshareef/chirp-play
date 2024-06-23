import connectDB from "@root/actions/db/connectDB";
import { getUserData } from "@root/actions/user/data";
import User from "@root/models/User";
import mongoose from "mongoose";

export async function GET() {
    try {
        await connectDB();
        const loggedUserData = await getUserData();
        const userDetails = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId("6673931a872ab72a664f724a")
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
                                _id: 0,
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
                    // pipeline: [
                    //     {
                    //         $lookup: {
                    //             from: "users",
                    //             localField: "subscriber",
                    //             foreignField: "_id",
                    //             as: "subscriberDetails",
                    //         }
                    //     },
                    //     {
                    //         $project: {
                    //             _id: 0,
                    //             subscriber: 1,
                    //             subscriberDetails: {
                    //                 name: 1,
                    //                 username: 1,
                    //                 avatar: 1
                    //             }
                    //         }
                    //     }
                    // ]
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
        return Response.json({
            status: 200,
            data: userDetails
        });
    }
    catch (err) {
        return Response.json({
            status: 500,
            message: "Internal Server Error " + err.message
        });
    }
}