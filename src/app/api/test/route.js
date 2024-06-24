import connectDB from "@root/actions/db/connectDB";
import { getUserData } from "@root/actions/user/data";
import User from "@root/models/User";
import Video from "@root/models/Video";
import mongoose from "mongoose";

export async function GET() {
    try {
        await connectDB();
        const loggedUserData = await getUserData();
        const currUser = new mongoose.Types.ObjectId("667820427d7e8caf5008b7bc");
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
                                from: "users",
                                localField: "channel",
                                foreignField: "_id",
                                as: "channelDetails",
                            }
                        },
                        {
                            $project: {
                                channelDetails: 1
                            }
                        }
                    ]
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
                    isLikedByCurrUser: {
                        $in: [currUser, "$likes.likedBy"]
                    }
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    videoFile: 1,
                    views: 1,
                    createdAt: 1,
                    owner: {
                        _id: 1,
                        name: 1,
                        avatar: 1
                    },
                    isLikedByCurrUser: 1,
                    likes: {
                        $size: "$likes"
                    },
                    channelDetails: 1
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