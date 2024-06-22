import { FaSpinner } from "react-icons/fa";

const Loading = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <FaSpinner className="animate-spin text-2xl" />
        </div>
    );
};

export default Loading;