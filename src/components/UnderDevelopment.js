import Image from "next/image";
import Link from "next/link";

export default function UnderDevelopment() {
    return (
        <div className="min-h-full flex flex-col justify-center items-center">
            <Image src="https://www.svgrepo.com/show/426192/cogs-settings.svg" alt="Logo"
                width={200} height={200}
                className="mb-8 h-40" />
            <h1 className="font-bold text-center text-gray-700 dark:text-white mb-4">
                This section of the website is under development!
            </h1>
            <p className="text-center text-gray-500 dark:text-gray-300 text-lg md:text-xl lg:text-2xl mb-8">We are working hard to bring you the best experience. Please check back later.</p>
            <div className="flex space-x-4">
                <Link href="/" className="bg-indigo-500 hover:bg-indigo-400 text-white py-3 px-6 rounded-md">
                    Go Home
                </Link>
            </div>
        </div>
    );
}