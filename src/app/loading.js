export default function Loading() {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-indigo-600"></div>
            <div className="h-2 w-full fixed top-0 bg-indigo-600 animate-pulse"></div>
        </div>
    );
};