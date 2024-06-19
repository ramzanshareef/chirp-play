"use server";

import connectDB from "@root/actions/db/connectDB";
import User from "@root/models/User";
import { getSession } from "@root/utils/session";

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
        return { status: 500, message: "Internal server error" + err.message };
    }
};