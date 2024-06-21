"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LogoutButton } from "@/components/buttons/LogoutButton";
import { IoSearchSharp, IoCloseSharp, IoSettingsOutline } from "react-icons/io5";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { FiHome } from "react-icons/fi";
import { MdOutlineAccountCircle } from "react-icons/md";
import { IoMdSearch, IoMdFolderOpen, IoIosHelpCircleOutline } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { RiContractLeftLine } from "react-icons/ri";
import { LuLayoutDashboard } from "react-icons/lu";
import { AiOutlineLike } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { GoHistory } from "react-icons/go";
import { CiSettings } from "react-icons/ci";

const Header = ({ userData }) => {
    const router = useRouter();
    const [searchBoxOpen, setSearchBoxOpen] = useState(false);
    const params = useSearchParams();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const trigger = useRef(null);
    const dropdown = useRef(null);

    // Close Dropdown on clicking outside
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!dropdown.current) return;
            if (
                !dropdownOpen ||
                dropdown.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setDropdownOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    // Close Dropdown on pressing ESC
    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!dropdownOpen || keyCode !== 27) return;
            setDropdownOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    return (
        <>
            <header
                className="flex justify-between items-center px-2 sm:px-4 py-1 bg-white sticky top-0 w-full z-50"
            >
                <div className="flex items-center gap-x-4">
                    <Link href="/"
                        className="sm:hidden"
                    >
                        <Image
                            width={176}
                            height={32}
                            src="/logo.png"
                            alt="Logo"
                            priority
                            quality={100}
                            className="cursor-pointer w-10 h-10"
                        />
                    </Link>
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
                <div className="flex items-center gap-x-2 relative">
                    <button className="sm:hidden"
                        onClick={() => {
                            setSearchBoxOpen(!searchBoxOpen);
                        }}
                    >
                        <IoMdSearch className={` text-2xl cursor-pointer ${searchBoxOpen === true ? "hidden" : ""}`} />
                        <IoCloseSharp className={` text-2xl cursor-pointer ${searchBoxOpen === false ? "hidden" : ""}`} />
                    </button>
                    <PiDotsThreeVerticalBold
                        className={` cursor-pointer text-3xl p-1 rounded-full
                            ${dropdownOpen === true ? "bg-gray-400" : "hover:bg-gray-400"}`}
                        ref={trigger}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    />
                    <Link className="border border-gray-400 text-blue-600 hover:bg-blue-200 flex rounded-full px-2 py-1 max-sm:p-2 gap-x-2"
                        href={userData.user ? "/profile" : "/login"}
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
                    </Link>

                    {/* DropDown */}
                    <div ref={dropdown}
                        onFocus={() => setDropdownOpen(true)}
                        onBlur={() => setDropdownOpen(false)}
                        className={`absolute top-10 sm:top-8 right-0 mt-2 z-50 flex w-60 bg-gray-100 flex-col rounded-md border border-indigo-400 shadow-md transition-all duration-500 ${dropdownOpen === true ? "block" : "hidden"}`}
                    >
                        {userData.user ?
                            <>
                                <ul className="flex flex-col gap-5 border-b border-gray-300 px-6 py-4">
                                    <li className="hover:text-indigo-600">
                                        <Link
                                            href={`/profile/${userData.user.username}`}
                                            className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                                        >
                                            <CgProfile size={22} />
                                            My Profile
                                        </Link>
                                    </li>
                                    <li className="hover:text-indigo-600">
                                        <Link
                                            href="/settings"
                                            className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                                        >
                                            <IoSettingsOutline size={22} />
                                            Account Settings
                                        </Link>
                                    </li>
                                </ul>
                                <LogoutButton
                                    beforeOnClickFn={() => setDropdownOpen(false)}
                                />
                            </> :
                            <>
                                <ul className="flex flex-col gap-5 border-b px-6 py-7 dark:border-strokedark">
                                    <li className="hover:text-indigo-600">
                                        <button
                                            className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setDropdownOpen(false);
                                                router.push("/login");
                                            }}
                                        >
                                            <CgProfile size={22} />
                                            Log in
                                        </button>
                                    </li>
                                </ul>
                            </>
                        }
                    </div>
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
                    className={`z-max px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-transparent
                    sm:hidden my-1 ${searchBoxOpen === false ? "hidden" : "w-11/12 ml-4"} `}
                />
            </header>
        </>
    );
};
export default Header;

export const Sidebar = ({ userData }) => {
    const trigger = useRef(null);
    const sidebar = useRef(null);
    const pathname = usePathname();
    const [showSidebar, setShowSidebar] = useState(false);

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!sidebar.current || !trigger.current) return;
            if (!showSidebar || sidebar.current.contains(target) || trigger.current.contains(target))
                return;
            setShowSidebar(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ key }) => {
            if (!showSidebar || key !== "Escape") return;
            setShowSidebar(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    return <>
        {/* When The Sidebar is Open */}
        <aside className={` max-sm:hidden absolute left-0 top-0 z-max flex flex-col h-screen border-r border-r-gray-200 shadow-md shadow-indigo-400 bg-white overflow-y-hidden max-md:w-52 md:w-60 duration-300 ease-linear p-2
            ${showSidebar ? "translate-x-0" : "-translate-x-full"}
    `}
        >
            {/* <!-- SIDEBAR HEADER --> */}
            <div className="flex items-center py-4 px-2 justify-between">
                <div className="flex items-center gap-x-2">
                    <Link href="/">
                        <Image
                            width={176}
                            height={32}
                            src="/logo.png"
                            alt="Logo"
                            priority
                            quality={100}
                            className="cursor-pointer w-12 h-12 max-md:w-6 max-md:h-6"
                        />
                    </Link>
                    <Link
                        href="/"
                        className="cursor-pointer text-2xl max-md:text-lg"
                    >
                        ChirpPlay
                    </Link>
                </div>
                <RiContractLeftLine
                    size={25}
                    onClick={() => setShowSidebar(false)}
                    className="cursor-pointer"
                />
            </div>
            {/* <!-- SIDEBAR CONTENT --> */}
            <nav className="flex-1 scroll-auto overflow-y-scroll scrollbar-hide">
                <div className="flex flex-col items-center gap-y-1 h-full w-full pb-4">
                    <Link
                        href="/"
                        title="Home"
                        className={`flex items-center hover:text-white hover:bg-indigo-500 px-4 py-2 rounded-lg w-full
                        ${pathname === "/" ? "bg-indigo-600 text-white hover:bg-indigo-600" : ""} `}>
                        <FiHome size={18} />
                        <span className="ml-2">Home</span>
                    </Link>
                    <Link
                        href="/dashboard"
                        title="Dashboard"
                        className={`flex items-center hover:text-white hover:bg-indigo-500 px-4 py-2 rounded-lg w-full
                        ${pathname.includes("/dashboard") ? "bg-indigo-600 text-white hover:bg-indigo-600" : ""}
                        ${userData?.status === 200 ? "" : "hidden"}
                        `}>
                        <LuLayoutDashboard size={18} />
                        <span className="ml-2">Dashboard</span>
                    </Link>
                    <Link
                        href="/liked-videos"
                        title="Liked Videos"
                        className={`flex items-center hover:text-white hover:bg-indigo-500 px-4 py-2 rounded-lg w-full
                        ${pathname.includes("/liked-videos") ? "bg-indigo-600 text-white hover:bg-indigo-600" : ""}
                        ${userData?.status === 200 ? "" : "hidden"}
                        `}>
                        <AiOutlineLike size={18} />
                        <span className="ml-2">Liked</span>
                    </Link>
                    <Link
                        href="/history"
                        title="History"
                        className={`flex items-center hover:text-white hover:bg-indigo-500 px-4 py-2 rounded-lg w-full
                        ${pathname.includes("/history") ? "bg-indigo-600 text-white hover:bg-indigo-600" : ""}
                        ${userData?.status === 200 ? "" : "hidden"}
                        `}>
                        <GoHistory size={18} />
                        <span className="ml-2">History</span>
                    </Link>
                    <Link
                        href="/playlists"
                        title="My Playlists"
                        className={`flex items-center hover:text-white hover:bg-indigo-500 px-4 py-2 rounded-lg w-full
                        ${pathname.includes("/playlists") ? "bg-indigo-600 text-white hover:bg-indigo-600" : ""}
                        ${userData?.status === 200 ? "" : "hidden"}
                        `}>
                        <IoMdFolderOpen size={18} />
                        <span className="ml-2">My Playlists</span>
                    </Link>
                    <Link
                        href="/help"
                        title="Help"
                        className={`flex items-center hover:text-white hover:bg-indigo-500 px-4 py-2 rounded-lg w-full mt-auto
                            ${pathname.includes("/help") ? "bg-indigo-600 text-white hover:bg-indigo-600" : ""} `}>
                        <IoIosHelpCircleOutline size={18} />
                        <span className="ml-2">Help</span>
                    </Link>
                    <Link
                        href="/settings"
                        title="Settings"
                        className={`flex items-center hover:text-white hover:bg-indigo-500 px-4 py-2 rounded-lg w-full
                        ${pathname.includes("/settings") ? "bg-indigo-600 text-white hover:bg-indigo-600" : ""}
                        ${userData?.status === 200 ? "" : "hidden"}
                        `}>
                        <CiSettings size={18} />
                        <span className="ml-2">Settings</span>
                    </Link>
                </div>
            </nav>
        </aside>

        {/* When The Sidebar is Closed */}
        <aside className={` max-sm:hidden absolute left-0 top-0 z-max flex flex-col h-screen border-r border-r-gray-200 shadow-md shadow-indigo-400 bg-white items-center max-w-fit duration-300 ease-linear gap-y-4 p-2 
            ${!showSidebar ? "translate-x-0" : "-translate-x-full"}
    `}>
            {/* HEADER */}
            <div className="flex flex-col items-center gap-y-4">
                <Link
                    href="/"
                >
                    <Image
                        width={176}
                        height={32}
                        src="/logo.png"
                        alt="Logo"
                        priority
                        quality={100}
                        className="cursor-pointer w-10 h-10"
                    />
                </Link>
                <GiHamburgerMenu
                    size={25}
                    onClick={() => setShowSidebar(true)}
                    className="cursor-pointer hover:text-gray-600"
                />
            </div>
            {/* CONTENT */}
            <div className="flex flex-col items-center gap-y-1 h-full pb-4">
                <Link
                    href="/"
                    title="Home"
                    className={`flex items-center hover:text-white hover:bg-indigo-600 p-2 hover:rounded-md ${pathname === "/" ? "text-white bg-indigo-600 rounded-md" : "text-gray-600"}`}>
                    <FiHome size={25} />
                </Link>
                <Link
                    href="/dashboard"
                    title="Dashboard"
                    className={`flex items-center hover:text-white hover:bg-indigo-600 p-2 hover:rounded-md 
                    ${pathname.includes("/dashboard") ? "text-white bg-indigo-600 rounded-md" : "text-gray-600"}
                    ${userData?.status === 200 ? "" : "hidden"}
                    `}>
                    <LuLayoutDashboard size={25} />
                </Link>
                <Link
                    href="/liked-videos"
                    title="Liked Videos"
                    className={`flex items-center hover:text-white hover:bg-indigo-600 p-2 hover:rounded-md 
                    ${pathname.includes("/liked-videos") ? "text-white bg-indigo-600 rounded-md" : "text-gray-600"}
                    ${userData?.status === 200 ? "" : "hidden"}
                    `}>
                    <AiOutlineLike size={25} />
                </Link>
                <Link
                    href="/history"
                    title="History"
                    className={`flex items-center hover:text-white hover:bg-indigo-600 p-2 hover:rounded-md 
                    ${pathname.includes("/history") ? "text-white bg-indigo-600 rounded-md" : "text-gray-600"}
                    ${userData?.status === 200 ? "" : "hidden"}
                    `}>
                    <GoHistory size={25} />
                </Link>
                <Link
                    href="/playlists"
                    title="My Playlists"
                    className={`flex items-center hover:text-white hover:bg-indigo-600 p-2 hover:rounded-md 
                    ${pathname.includes("/playlists") ? "text-white bg-indigo-600 rounded-md" : "text-gray-600"}
                    ${userData?.status === 200 ? "" : "hidden"}
                    `}>
                    <IoMdFolderOpen size={25} />
                </Link>
                <Link
                    href="/help"
                    title="Help"
                    className={`flex items-center mt-auto hover:text-white hover:bg-indigo-600 p-2 hover:rounded-md ${pathname.includes("/help") ? "text-white bg-indigo-600 rounded-md" : "text-gray-600"}`}>
                    <IoIosHelpCircleOutline size={25} />
                </Link>
                <Link
                    href="/settings"
                    title="Settings"
                    className={`flex items-center hover:text-white hover:bg-indigo-600 p-2 hover:rounded-md 
                    ${pathname.includes("/settings") ? "text-white bg-indigo-600 rounded-md" : "text-gray-600"}
                    ${userData?.status === 200 ? "" : "hidden"}
                    `}>
                    <CiSettings size={25} />
                </Link>
            </div>
        </aside >
    </>;
};