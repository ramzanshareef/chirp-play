import connectDB from "@root/actions/db/connectDB";
// import { getUserData } from "@root/actions/user/data";
import Video from "@root/models/Video";
import mongoose from "mongoose";

export async function GET() {
    try {
        await connectDB();
        // const loggedUserData = await getUserData();
        // const currUser = await loggedUserData?.user?.id; // Get current user id
        // using a static user id for testing
        const currUser = new mongoose.Types.ObjectId("6673931a872ab72a664f724a");
        const data = await Video.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId("667268bbc765fa4a4732ac90")
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                    pipeline: [
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
                                    $size: {
                                        $ifNull: ["$subscribers", []]
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                isSub: {
                                    $in: [currUser, "$subscribers.subscriber"]
                                }
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    isSub: {
                        $arrayElemAt: ["$owner.isSub", 0]
                    },
                }
            },
            {
                $addFields: {
                    owner: {
                        $arrayElemAt: ["$owner", 0]
                    }
                }
            },
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
                    totalLikes: {
                        $size: {
                            $ifNull: ["$likes", []]
                        }
                    }
                }
            },
            {
                $addFields: {
                    isLikedByCurrUser: {
                        $in: [currUser, "$likes.likedBy"]
                    }
                }
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "video",
                    as: "comments",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "owner",
                                pipeline: [
                                    {
                                        $project: {
                                            _id: 1,
                                            name: 1,
                                            username: 1,
                                            avatar: 1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $addFields: {
                                isCurrUserOwnerOfComment: {
                                    $in: [currUser, "$owner._id"]
                                }
                            }
                        },
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
                                totalLikes: {
                                    $size: {
                                        $ifNull: ["$likes", []]
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                isLikedByCurrUser: {
                                    $in: [currUser, "$likes.likedBy"]
                                }
                            }
                        },
                        {
                            $project: {
                                owner: {
                                    $arrayElemAt: ["$owner", 0]
                                },
                                content: 1,
                                createdAt: 1,
                                isCurrUserOwnerOfComment: 1,
                                totalLikes: 1,
                                isLikedByCurrUser: 1
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    description: 1,
                    views: 1,
                    duration: 1,
                    createdAt: 1,
                    owner: {
                        _id: 1,
                        name: 1,
                        avatar: 1,
                        totalSubscribers: 1
                    },
                    isSub: 1,
                    totalLikes: 1,
                    isLikedByCurrUser: 1,
                    comments: 1
                }
            }
        ]);
        return Response.json({
            status: 200,
            data: data
        });
    }
    catch (err) {
        return Response.json({
            status: 500,
            message: "Internal Server Error " + err.message
        });
    }
}