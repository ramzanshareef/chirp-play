"use client";

import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="overflow-hidden">
            <div className="h-screen w-screen flex items-center">
                <div className="container flex flex-col md:flex-row items-center justify-between px-10 text-gray-700">
                    <div className="w-full lg:w-1/2 mx-8 ">
                        <div className="text-7xl text-indigo-500 font-dark font-extrabold mb-8"> 404!</div>
                        <p className="text-2xl md:text-3xl font-light leading-normal mb-8">
                            😞Sorry we couldn`t find the page you`re looking for
                        </p>

                        <Link
                            href={"/"}
                            className="px-5 inline py-3 text-sm font-medium leading-5 shadow-2xl text-white transition-all duration-400 border border-transparent rounded-md focus:outline-none bg-indigo-600 active:bg-indigo-700 hover:bg-indigo-700 ">Go Home</Link>
                        <button
                            className="px-5 inline py-3 text-sm font-medium leading-5 shadow-2xl text-white transition-all duration-400 border border-transparent rounded-md focus:outline-none bg-indigo-600 active:bg-indigo-700 hover:bg-indigo-700 ml-2"
                            onClick={() => window.history.back()}
                        >
                            Go Back
                        </button>
                    </div>
                    <div className="w-full lg:flex lg:justify-end lg:w-1/2 mx-5 my-12">
                        <Image src="/404.svg"
                            width="500" height="500"
                            className=""
                            alt="Page not found" />
                    </div>

                </div>
            </div>
        </div>
    );
}