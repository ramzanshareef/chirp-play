"use client";

import Loader from "@/components/loader";
import { usePathname } from "next/navigation";

export default function Loading() {
    const pathname = usePathname();
    return (
        <>
            {pathname === "/" ?
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {[...Array(12)].map((_, index) => (
                        <div key={index} className="rounded overflow-hidden shadow-lg animate-pulse">
                            <div className="relative">
                                <div className="w-full h-48 bg-gray-300"></div>
                                <div className="absolute bottom-2 right-2 bg-gray-400 text-white text-xs px-2 py-1 rounded"></div>
                            </div>
                            <div className="flex items-start p-4">
                                <div className="w-10 h-10 rounded-full bg-gray-300 mr-4"></div>
                                <div className="flex-1">
                                    <div className="w-3/4 h-4 bg-gray-300 mb-1"></div>
                                    <div className="w-1/2 h-4 bg-gray-300 mb-1"></div>
                                    <div className="text-gray-600 text-xs flex flex-row">
                                        <div className="w-1/4 h-4 bg-gray-300"></div> • <div className="w-1/4 h-4 bg-gray-300"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                :
                <Loader />
            }
        </>
    );
};