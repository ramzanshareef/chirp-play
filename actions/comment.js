"use server";

import Comment from "@root/models/Comment";
import connectDB from "./db/connectDB";
import { getUserData } from "./user/data";
import { revalidatePath } from "next/cache";

export async function addComment(currentState, formData) {
    try {
        await connectDB();
        let videoID = formData.get("videoID");
        let content = formData.get("comment");
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