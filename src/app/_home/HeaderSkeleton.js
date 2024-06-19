import { IoMdSearch, IoCloseSharp } from "react-icons/io5";
import { PiDotsThreeVerticalBold } from "react-icons/pi";

const HeaderSkeleton = () => {
    return (
        <>
            <header className="flex justify-between items-center px-2 sm:px-4 py-1 bg-white sticky top-0 w-full z-50 shadow-md">
                <div className="flex items-center gap-x-4">
                    <div className="h-6 w-6 bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="h-12 w-16 bg-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="rounded-full border border-gray-500 hidden items-center px-3 py-2 w-2/5 sm:flex">
                    <div className="flex flex-row-reverse items-center w-full relative">
                        <div className="h-5 w-full bg-gray-300 rounded animate-pulse"></div>
                    </div>
                    <button className="text-gray-500 text-lg cursor-pointer">
                        <IoMdSearch className="text-gray-500 text-lg" />
                    </button>
                </div>
                <div className="flex items-center gap-x-2">
                    <PiDotsThreeVerticalBold className="cursor-pointer text-2xl hidden sm:block" />
                    <button className="sm:hidden">
                        <IoMdSearch className="text-2xl cursor-pointer" />
                        <IoCloseSharp className="text-2xl cursor-pointer hidden" />
                    </button>
                    <div className="h-8 w-24 bg-gray-300 rounded-full animate-pulse"></div>
                </div>
            </header>
            <header>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm sm:hidden mt-2 animate-pulse"></div>
            </header>
        </>
    );
};

export default HeaderSkeleton;