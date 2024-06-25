import { Suspense } from "react";
import LoginForm from "./LoginForm";
import Loader from "@/components/loader";

export default async function LoginPage({ searchParams }) {
    return <>
        <Suspense fallback={<Loader />} >
            <LoginForm
                searchParams={searchParams}
            />
        </Suspense>
    </>;
}

export const metadata = {
    title: "Login",
    description: "Login to your account",
};