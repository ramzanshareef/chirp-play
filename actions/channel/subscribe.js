"use server";

import connectDB from "@root/actions/db/connectDB";
import Subscription from "@root/models/Subscription";
import mongoose from "mongoose";
import { getUserData } from "@root/actions/user/data";
import { revalidatePath } from "next/cache";

export async function subscribeHandlerToChannel(channelID, videoID) {
    try {
        await connectDB();
        let userData = await getUserData();
        if (userData.status !== 200) {
            return { status: 401, message: "Please login to Subscribe" };
        }
        if (userData.user._id.toString() === channelID) {
            return { status: 400, message: "You can't subscribe to your own channel 😅" };
        }
        let subscription = await Subscription.findOne({
            channel: channelID,
            subscriber: userData.user._id,
        });
        if (subscription) {
            await Subscription.deleteOne({
                channel: channelID,
                subscriber: userData.user._id,
            });
            revalidatePath("/dashboard");
            revalidatePath(`/video/${videoID}`);
            return { status: 200, message: "Unsubscribed successfully 😞" };
        }
        await Subscription.create({
            channel: channelID,
            subscriber: userData.user._id,
        });
        revalidatePath("/dashboard");
        revalidatePath(`/video/${videoID}`);
        return { status: 200, message: "Subscribed successfully 🙂" };
    }
    catch (err) {
        return { status: 500, message: "Internal Server Error " + err.message };
    }
}

export async function subscriptionStatus(channelID) {
    try {
        await connectDB();
        let userData = await getUserData();
        if (userData.status !== 200) {
            return { status: 401, message: "Unauthorized" };
        }
        let subscription = await Subscription.findOne({
            channel: channelID,
            subscriber: userData.user._id,
        });
        return { status: 200, isSubscribed: subscription ? true : false };
    }
    catch (err) {
        return { status: 500, message: "Internal Server Error " + err.message };
    }
}