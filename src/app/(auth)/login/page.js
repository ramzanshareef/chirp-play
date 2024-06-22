import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default async function LoginPage({ searchParams }) {
    return <>
        <Suspense>
            <LoginForm 
                searchParams={searchParams}
            />
        </Suspense>
    </>;
}

export const metadata = {
    title: "Chirp Play - Login",
    description: "Login to your account",
};