import connectDB from "@root/actions/db/connectDB";
import Like from "@root/models/Like";
import User from "@root/models/User";
import Video from "@root/models/Video";
import mongoose from "mongoose";

export async function GET() {
    try {
        await connectDB();
        let currUser = "6673931a872ab72a664f724a";
        const data = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(currUser)
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "watchHistory",
                    foreignField: "_id",
                    as: "watchHistory",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "owner"
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
                            $project: {
                                title: 1,
                                description: 1,
                                thumbnail: 1,
                                views: 1,
                                duration: 1,
                                createdAt: 1,
                                owner: {
                                    name: 1,
                                    avatar: 1
                                }
                            
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    watchHistory: 1
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