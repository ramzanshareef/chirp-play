import { FaRegEye, FaHeart } from "react-icons/fa";
import { RiUserFollowFill } from "react-icons/ri";

const DashboardSkeleton = () => {
    return (
        <div className="w-full sm:w-11/12 mx-auto p-4 my-2 flex flex-col gap-y-3 sm:gap-y-6 animate-pulse">
            <div className="flex w-full justify-between items-center max-sm:flex-col max-sm:gap-y-4">
                <div>
                    <div className="h-6 bg-gray-300 rounded-md w-40 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded-md w-64"></div>
                </div>
                <div className="h-10 bg-gray-300 rounded-md w-24"></div>
            </div>
            <div className="flex flex-col gap-y-2 sm:flex-row sm:gap-x-2 sm:gap-y-0">
                <div className="flex justify-center items-center gap-x-4 bg-white p-4 rounded-lg shadow-lg w-full sm:w-1/3 border-2">
                    <div className="w-fit bg-gray-300 p-2 rounded-full">
                        <FaRegEye className="text-gray-300 text-xl" />
                    </div>
                    <div>
                        <div className="h-4 bg-gray-300 rounded-md w-20 mb-2"></div>
                        <div className="h-6 bg-gray-300 rounded-md w-12"></div>
                    </div>
                </div>
                <div className="flex justify-center items-center gap-x-4 bg-white p-4 rounded-lg shadow-lg w-full sm:w-1/3 border-2">
                    <div className="w-fit bg-gray-300 p-2 rounded-full">
                        <FaHeart className="text-gray-300 text-xl" />
                    </div>
                    <div>
                        <div className="h-4 bg-gray-300 rounded-md w-20 mb-2"></div>
                        <div className="h-6 bg-gray-300 rounded-md w-12"></div>
                    </div>
                </div>
                <div className="flex justify-center items-center gap-x-4 bg-white p-4 rounded-lg shadow-lg w-full sm:w-1/3 border-2">
                    <div className="w-fit bg-gray-300 p-2 rounded-full">
                        <RiUserFollowFill className="text-gray-300 text-xl" />
                    </div>
                    <div>
                        <div className="h-4 bg-gray-300 rounded-md w-20 mb-2"></div>
                        <div className="h-6 bg-gray-300 rounded-md w-12"></div>
                    </div>
                </div>
            </div>
            <div>
                <div className="h-6 bg-gray-300 rounded-md w-32 mb-4"></div>
                <div className="flex flex-col gap-y-4">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="flex flex-col md:flex-row w-full animate-pulse">
                            <div className="w-full md:w-1/3 bg-gray-300 h-48 rounded-lg"></div>
                            <div className="w-full md:w-2/3 flex flex-col space-y-2 py-3 sm:py-0 px-0 sm:px-3 justify-between">
                                <div className="flex flex-col gap-y-3">
                                    <div className="h-6 bg-gray-300 rounded-md w-40"></div>
                                    <div className="h-4 bg-gray-300 rounded-md w-64"></div>
                                    <div className="flex justify-between item-center">
                                        <div className="h-4 bg-gray-300 rounded-md w-12"></div>
                                        <div className="h-4 bg-gray-300 rounded-md w-12"></div>
                                        <div className="h-4 bg-gray-300 rounded-md w-12"></div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="h-10 bg-gray-300 rounded-md w-10"></div>
                                    <div className="h-10 bg-gray-300 rounded-md w-10"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;