export default function Loading() {
    return <>
        <div>
            <div className="relative h-40 w-full bg-gray-300 animate-pulse">
                <div className="absolute bottom-0 left-4 transform translate-y-1/2">
                    <div className="h-24 w-24 rounded-full bg-gray-300 border-4 border-white animate-pulse"></div>
                </div>
            </div>
            <div className="mt-12 flex items-center justify-between px-4">
                <div>
                    <div className="h-6 w-48 bg-gray-300 animate-pulse mb-2"></div>
                    <div className="h-4 w-32 bg-gray-300 animate-pulse mb-1"></div>
                    <div className="h-4 w-24 bg-gray-300 animate-pulse"></div>
                </div>
                <div className="h-10 w-12 sm:w-24 bg-gray-300 animate-pulse rounded-lg">
                    <span className="hidden sm:block"></span>
                </div>
            </div>
            <div className="mt-4 px-4">
                <div className="flex w-full mb-4">
                    <div className="py-2 px-4 w-1/3 h-10 bg-gray-300 animate-pulse rounded-t-lg"></div>
                    <div className="py-2 px-4 w-1/3 h-10 bg-gray-300 animate-pulse rounded-t-lg ml-2"></div>
                    <div className="py-2 px-4 w-1/3 h-10 bg-gray-300 animate-pulse rounded-t-lg ml-2"></div>
                    <div className="py-2 px-4 w-1/3 h-10 bg-gray-300 animate-pulse rounded-t-lg ml-2"></div>
                </div>
                <div className="flex flex-wrap">
                    {[...Array(6)].map((_, i) =>
                        <div key={i} className="w-full sm:w-1/4 overflow-hidden sm:pr-2 mb-3 animate-pulse">
                            <div className="relative">
                                <div className="w-full h-48 object-cover hover:cursor-pointer rounded-2xl bg-gray-300 animate-pulse"></div>
                                <div className="absolute bottom-2 right-2 bg-gray-300 text-gray-500 bg-opacity-75 text-xs px-2 py-1 rounded">
                                    00:00
                                </div>
                            </div>
                            <div className="flex items-start py-4">
                                <div className="flex-1">
                                    <div className="font-bold text-sm mb-1 h-4 bg-gray-300"></div>
                                    <div className="text-gray-600 text-xs h-4 bg-gray-300"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </>;
}