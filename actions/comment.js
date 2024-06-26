"use server";

import Comment from "@root/models/Comment";
import connectDB from "./db/connectDB";
import { getUserData } from "./user/data";
import { revalidatePath } from "next/cache";
import Like from "@root/models/Like";

export async function addComment(currentState, data) {
    try {
        await connectDB();
        let { videoID, content } = data;
        let userData = await getUserData();
        if (userData.status !== 200) {
            return { status: 401, message: "Please Login to comment" };
        }
        await Comment.create({
            video: videoID,
            content,
            owner: userData.user._id,
        });
        revalidatePath(`/video/${videoID}`);
        return { status: 200, message: "Comment added successfully" };
    }
    catch (error) {
        return { status: 500, message: error.message };
    }
}

export async function likeCommentHandler(commentID) {
    try {
        await connectDB();
        let userData = await getUserData();
        if (userData.status !== 200) {
            return { status: 401, message: "Please Login to Like a Comment" };
        }
        let comment = await Comment.findById(commentID).populate("owner").select("-password");
        if (!comment) {
            return { status: 404, message: "Comment not found" };
        }
        let exisLike = await Like.findOne({ contentID: commentID, onModel: "Comment", likedBy: userData?.user?._id });
        if (exisLike) {
            await Like.findByIdAndDelete(exisLike._id);
            revalidatePath(`/video/${comment.video}`);
            return { status: 200, message: "Comment Unliked" };
        }
        await Like.create({
            contentID: commentID,
            onModel: "Comment",
            likedBy: userData.user._id,
        });
        revalidatePath(`/video/${comment.video}`);
        return { status: 200, message: "Comment Liked 😊" };
    }
    catch (error) {
        return { status: 500, message: "Internal Server Error " + error.message };
    }
}

export async function deleteComment(commentID) {
    try {
        await connectDB();
        let userData = await getUserData();
        if (userData.status !== 200) {
            return { status: 401, message: "Please Login to delete a Comment" };
        }
        let comment = await Comment.findById(commentID).populate("owner").select("-password");
        if (!comment) {
            return { status: 404, message: "Comment not found" };
        }
        if (comment.owner._id.toString() !== userData.user._id.toString()) {
            return { status: 403, message: "Not Authorized" };
        }
        await Comment.findByIdAndDelete(commentID);
        await Like.deleteMany({ contentID: commentID, onModel: "Comment" });
        revalidatePath(`/video/${comment.video}`);
        return { status: 200, message: "Comment Deleted Successfully" };
    }
    catch (error) {
        return { status: 500, message: "Internal Server Error " + error.message };
    }
}

export async function editComment(currentState, formData) {
    try {
        await connectDB();
        let userData = await getUserData();
        if (userData.status !== 200) {
            return { status: 401, message: "Please Login to edit a Comment" };
        }
        let commentID = formData.get("commentID");
        let comment = await Comment.findById(commentID).populate("owner").select("-password");
        if (!comment) {
            return { status: 404, message: "Comment not found" };
        }
        if (comment.owner._id.toString() !== userData.user._id.toString()) {
            return { status: 403, message: "Not Authorized" };
        }
        let content = formData.get("comment");
        await Comment.findByIdAndUpdate(commentID, { content });
        revalidatePath(`/video/${comment.video}`);
        return { status: 200, message: "Comment Edited Successfully" };
    }
    catch (error) {
        return { status: 500, message: "Internal Server Error " + error.message };
    }
}