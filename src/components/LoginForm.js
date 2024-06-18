"use client";

import Link from "next/link";
import { toast } from "react-toastify";
import { SubmitButton } from "@/components/buttons/SubmitButton";
import { userLogin } from "@root/actions/user/auth";
import { useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
    const [state, submitAction] = useActionState(userLogin, null);
    const router = useRouter();

    useEffect(() => {
        if (state?.status !== 200) {
            toast.error(state?.message, {
                onClose: () => {
                    document.getElementById("loginForm").reset();
                },
            });
        }
        else if (state?.status === 200) {
            toast.success(state?.message, {
                onClose: () => {
                    router.push("/dashboard");
                },
            });
        }
    }, [router, state]);

    return (
        <>
            <div className="flex flex-col min-h-full justify-center p-6 lg:px-8">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Login to your Account</h2>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form action={submitAction} className="space-y-8" id="loginForm">
                        <div className="mt-2 relative">
                            <input
                                id="emailOrUsername"
                                name="emailOrUsername"
                                type="text"
                                placeholder="Enter your Email address or Username"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 peer placeholder-transparent" />
                            <label htmlFor="emailOrUsername" className="absolute block left-0 -top-7 text-sm font-medium leading-6 text-gray-900 peer-placeholder-shown:hidden transition-all">Enter your Email address or Username</label>
                        </div>
                        <div className="mt-2 relative">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your Password"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 peer placeholder-transparent" />
                            <label htmlFor="password" className="absolute block left-0 -top-7 text-sm font-medium leading-6 text-gray-900 peer-placeholder-shown:hidden transition-all">Enter your Password</label>
                        </div>
                        <div>
                            <SubmitButton title="Log in" size="full" />
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Donot have an acccount? &nbsp;
                        <Link href={"/signup"} className="font-semibold leading-6 text-blue-600 hover:text-blue-500" >
                            Sign up now
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default LoginForm;