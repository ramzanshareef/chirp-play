import { NextResponse } from "next/server";
import { getSession } from "@root/utils/session";

export async function middleware(request) {
    const path = request.nextUrl.pathname;
    const authRoutes = ["/login", "/signup"];
    const protectedRoutes = ["/dashboard"];

    let isAuth = await checkAuth();

    if (protectedRoutes.includes(path)) {
        if (!isAuth) {
            return NextResponse.redirect(new URL(`/login?redirctTo=${path}`, request.nextUrl.origin).toString());
        }
        return NextResponse.next();
    }

    if (authRoutes.includes(path)) {
        if (isAuth) {
            return NextResponse.redirect(new URL("/", request.nextUrl.origin).toString());
        }
        return NextResponse.next();
    }
    return NextResponse.next();

}

const checkAuth = async () => {
    const session = await getSession();
    if (!session || session.isAuth === undefined) {
        return false;
    }
    return true;
};