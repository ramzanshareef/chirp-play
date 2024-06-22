"use client";

import { AiOutlineLike } from "react-icons/ai";
import { FiHome } from "react-icons/fi";
import { GoHistory } from "react-icons/go";
import { LuLayoutDashboard } from "react-icons/lu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoMdFolderOpen } from "react-icons/io";

export default function Footer({ userData }) {
    const pathname = usePathname();
    return (
        <footer className="fixed bottom-0 w-full bg-gray-500 py-2 text-center sm:hidden mt-2">
            <div className="flex flex-row justify-around items-center transition-all duration-300 text-white">
                <Link
                    href="/"
                    title="Home"
                    className={`flex flex-col items-center transition-all duration-300 
                    ${pathname === "/" ? "bg-indigo-600 p-2 rounded-md" : "text-gray-300"}`}>
                    <FiHome size={25} />
                    <span className="text-xs">Home</span>
                </Link>
                <Link
                    href="/dashboard"
                    title="Dashboard"
                    className={`flex flex-col items-center transition-all duration-300  
                    ${pathname.includes("/dashboard") ? "bg-indigo-600 p-2 rounded-md" : "text-gray-300"}
                    ${userData?.status === 200 ? "" : "hidden"}
                    `}>
                    <LuLayoutDashboard size={25} />
                    <span className="text-xs">Dashboard</span>
                </Link>
                <Link
                    href="/liked-videos"
                    title="Liked Videos"
                    className={`flex flex-col items-center transition-all duration-300 
                    ${pathname.includes("/liked-videos") ? "bg-indigo-600 p-2 rounded-md" : "text-gray-300"}
                    ${userData?.status === 200 ? "" : "hidden"}
                    `}>
                    <AiOutlineLike size={25} />
                    <span className="text-xs">Liked</span>
                </Link>
                <Link
                    href="/history"
                    title="History"
                    className={`flex flex-col items-center transition-all duration-300  
                    ${pathname.includes("/history") ? "bg-indigo-600 p-2 rounded-md" : "text-gray-300"}
                    ${userData?.status === 200 ? "" : "hidden"}
                    `}>
                    <GoHistory size={25} />
                    <span className="text-xs">History</span>
                </Link>
                <Link
                    href="/playlists"
                    title="Playlists"
                    className={`flex flex-col items-center transition-all duration-300 
                    ${pathname.includes("/playlists") ? "bg-indigo-600 p-2 rounded-md" : "text-gray-300"}
                    ${userData?.status === 200 ? "" : "hidden"}
                    `}>
                    <IoMdFolderOpen size={25} />
                    <span className="text-xs">Playlists</span>
                </Link>
            </div>
        </footer>
    );
}