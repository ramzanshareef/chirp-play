"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { IoSearchSharp, IoCloseSharp } from "react-icons/io5";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { MdOutlineAccountCircle } from "react-icons/md";
import { IoMdSearch } from "react-icons/io";
import Link from "next/link";

const Header = ({ userData }) => {
    const router = useRouter();
    const [searchBoxOpen, setSearchBoxOpen] = useState(false);
    const params = useSearchParams();

    return (
        <>
            <header
                className="flex justify-between items-center px-2 sm:px-4 py-1 bg-white sticky top-0 w-full z-50 shadow-md"
            >
                <div className="flex items-center gap-x-4">
                    <Image src="/navbar.svg" alt="Sidebar" width={24} height={24} className="hidden sm:block cursor-pointer hover:opacity-75" />
                    <Link href="/">
                        <Image src="/logo.png" title="Chirp Play" alt="Chirp Play" width={70} height={70} className="cursor-pointer h-12 w-16" /> </Link>
                </div>
                <div className="rounded-full border border-gray-500 hidden items-center px-3 py-2 w-2/5 sm:flex">
                    <div className="flex flex-row-reverse items-center w-full relative">
                        <input
                            type="search"
                            placeholder="Search for videos."
                            name="search"
                            id="search"
                            defaultValue={params.get("q") || ""}
                            className="bg-transparent outline-none ml-2 placeholder:text-gray-400 peer placeholder-transparent w-full"
                            title="Search for videos."
                            onKeyDown={(e) => {
                                if (e.key !== "Enter") return;
                                if (e.target.value.trim().length > 0) {
                                    e.preventDefault();
                                    router.push(`/search?q=${e.target.value.trim()}`);
                                }
                            }}
                        />
                        <IoSearchSharp className="text-gray-500 text-lg peer-placeholder-shown:hidden" />
                    </div>
                    <button className="text-gray-500 text-lg cursor-pointer" title="Search for videos."
                        onClick={() => {
                            if (document.getElementById("search").value) {
                                if (document.getElementById("search").value.trim().length > 0) {
                                    router.push(`/search?q=${document.getElementById("search").value.trim()}`);
                                }
                            }
                            else {
                                document.getElementById("search").focus();
                            }
                        }}
                    >
                        <IoMdSearch className="text-gray-500 text-lg" />
                    </button>
                </div>
                <div className="flex items-center gap-x-2">
                    <PiDotsThreeVerticalBold className="cursor-pointer text-2xl hidden sm:block" />
                    <button className="sm:hidden"
                        onClick={() => {
                            setSearchBoxOpen(!searchBoxOpen);
                        }}
                    >
                        <IoMdSearch className={` text-2xl cursor-pointer ${searchBoxOpen === true ? "hidden" : ""}`} />
                        <IoCloseSharp className={` text-2xl cursor-pointer ${searchBoxOpen === false ? "hidden" : ""}`} />
                    </button>
                    <button className="border border-gray-200 text-blue-600 hover:bg-blue-200 flex rounded-full px-2 py-1 max-sm:p-2 gap-x-2"
                        onClick={() => router.push("/login")}
                    >
                        {userData.user ? <div className="flex gap-2">
                            <Image src={userData.user?.avatar} alt={userData.user.name} width={24} height={24} className="rounded-full" />
                            <p className="hidden sm:block">{userData.user.username}</p>
                        </div> :
                            <>
                                <MdOutlineAccountCircle className="text-2xl" />
                                <p className="hidden sm:block">Log in</p>
                            </>
                        }
                    </button>
                </div>
            </header>
            <header>
                <input type="search"
                    placeholder="Search for videos."
                    name="search"
                    id="search"
                    defaultValue={params.get("q") || ""}
                    title="Search for videos."
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            if (e.target.value.trim().length > 0) {
                                router.push(`/search?q=${e.target.value.trim()}`);
                            }
                        }
                    }}
                    className={` w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent
                    sm:hidden mt-2 ${searchBoxOpen === false ? "hidden" : ""} `}
                />
            </header>
        </>
    );
};
export default Header;