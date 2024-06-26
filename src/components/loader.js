import { FaSpinner } from "react-icons/fa";

export default function Loader() {
    return (<>
        <div className="flex justify-center items-center">
            <FaSpinner className="animate-spin text-2xl" />
        </div>
    </>);
}

export const SimpleLoader = () => (
    <FaSpinner className="animate-spin text-2xl" />
);