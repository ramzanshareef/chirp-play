import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export const getSession = async () => {
    const session = await getIronSession(cookies(), {
        password: process.env.SESSION_SECRET,
        cookieName: "user-session",
        cookieOptions: {
            secure: true,
            httpOnly: true,
            sameSite: "strict",
            path: "/",
            expires: 60 * 60 * 24 * 1,
        },
    });
    return session;
};