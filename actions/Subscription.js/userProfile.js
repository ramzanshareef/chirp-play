"use server";

import Subscription from "@root/models/Subscription";
import connectDB from "../db/connectDB";
import { getUserData } from "../user/data";
import { revalidatePath } from "next/cache";

export async function subscribeHandlerToUser(userID, pathToRevalidate) {
    try {
        await connectDB();
        let userData = await getUserData();
        if (userData.status !== 200) {
            return { status: 401, message: "Please login to Subscribe" };
        }
        if (userData.user._id.toString() === userID) {
            return { status: 400, message: "You can't subscribe to your own channel 😅" };
        }
        let subscription = await Subscription.findOne({
            channel: userID,
            subscriber: userData.user._id,
        });
        if (subscription) {
            await Subscription.deleteOne({
                channel: userID,
                subscriber: userData.user._id,
            });
            revalidatePath("/dashboard");
            revalidatePath(`/user/${userID}`);
            revalidatePath(pathToRevalidate);
            return { status: 200, message: "Unsubscribed Successfully 😞" };
        }
        await Subscription.create({
            channel: userID,
            subscriber: userData.user._id,
        });
        revalidatePath("/dashboard");
        revalidatePath(`/user/${userID}`);
        revalidatePath(pathToRevalidate);
        return { status: 200, message: "Subscribed Successfully 😊" };
    }
    catch (err) {
        return { status: 500, message: "Internal server error " + err.message };
    }
}