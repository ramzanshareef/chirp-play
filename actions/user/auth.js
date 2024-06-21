"use server";

import { getSession } from "@root/utils/session";
import User from "@root/models/User";
import connectDB from "@root/actions/db/connectDB";
import { revalidatePath } from "next/cache";

const bcryptjs = require("bcryptjs");

export async function userSignup(currentState, formData) {
    let name = formData.get("name");
    let email = formData.get("email");
    let password = formData.get("password");
    let username = formData.get("username");
    if (name === "" || email === "" || password === "" || username === "") {
        return { status: 400, message: "All fields are required" };
    }
    else {
        try {
            await connectDB();
            let user = await User.findOne({
                $or: [
                    { email: email },
                    { username: username }
                ]
            });
            if (user) {
                return { status: 400, message: "User already exists" };
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
                return { status: 200, message: "Signup Successfull, Please Login" };
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
            let user = await User.findOne({
                $or: [
                    { email: emailOrUsername },
                    { username: emailOrUsername }
                ]
            });
            if (user) {
                let isMatch = await bcryptjs.compare(password, user.password);
                if (isMatch) {
                    const session = await getSession();
                    session.isAuth = true;
                    session.user = {
                        id: user._id,
                        name: user.name,
                        email: user.email
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