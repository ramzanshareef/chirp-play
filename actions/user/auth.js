"use server";

import { getSession } from "@root/utils/session";
import User from "@root/models/User";
import connectDB from "@root/actions/db/connectDB";
import { revalidatePath } from "next/cache";
import Otp from "@root/models/Otp";

const bcryptjs = require("bcryptjs");

export async function userSignup(currentState, formData) {
    let name = formData.get("name");
    let email = formData.get("email");
    let password = formData.get("password");
    let username = formData.get("username");
    let otp = formData.get("otp");
    if (name === "" || email === "" || password === "" || username === "" || otp === "") {
        return { status: 400, message: "All fields are required" };
    }
    let allowedEmailDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
    let emailDomain = email.split("@")[1];
    if (!allowedEmailDomains.includes(emailDomain)) {
        return { status: 400, message: "Only Gmail, Yahoo, Hotmail and Outlook domains are allowed" };
    }
    else {
        try {
            await connectDB();
            let user = await User.aggregate([
                { $match: { $or: [{ email: email }, { username: username }] } }
            ]);
            if (user.length > 0) {
                return { status: 400, message: "User already exists" };
            }
            let otpDoc = await Otp.findOne({ email: email });
            if (!otpDoc) {
                return { status: 400, message: "Invalid OTP" };
            }
            if (otpDoc.otp !== parseInt(otp)) {
                return { status: 400, message: "Invalid OTP" };
            }
            else {
                let salt = bcryptjs.genSaltSync(10);
                password = bcryptjs.hashSync(password, salt);
                let newUser = new User({
                    name: name,
                    email: email,
                    password: password,
                    username: username
                });
                await newUser.save();
                await Otp.deleteOne({ email: email });
                return { status: 200, message: "Signup Successfull, Please Login 😊" };
            }
        }
        catch (err) {
            return { status: 500, message: "Internal Server Error " + err.message };
        }
    }
}

export async function userLogin(currentState, formData) {
    let emailOrUsername = formData.get("emailOrUsername");
    let password = formData.get("password");
    if (emailOrUsername === "" || password === "") {
        return { status: 400, message: "All fields are required" };
    }
    else {
        try {
            await connectDB();
            let user = await User.aggregate([
                { $match: { $or: [{ email: emailOrUsername }, { username: emailOrUsername }] } }
            ]);
            if (user.length > 0) {
                let isMatch = await bcryptjs.compare(password, user[0].password);
                if (isMatch) {
                    const session = await getSession();
                    session.isAuth = true;
                    session.user = {
                        _id: user[0]._id,
                        name: user[0].name,
                        email: user[0].email
                    };
                    await session.save();
                    return { status: 200, message: "Login successful" };
                }
                else {
                    return { status: 400, message: "Invalid Credentials" };
                }
            }
            else {
                return { status: 400, message: "Invalid Credentials" };
            }
        }
        catch (err) {
            return { status: 500, message: "Internal Server Error " + err.message };
        }
    }
}

export async function userLogout() {
    try {
        (await getSession()).destroy();
        revalidatePath("/");
        return { status: 200, message: "Logged out" };
    }
    catch (err) {
        return { status: 500, message: "Internal Server Error " };
    }
}