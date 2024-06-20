"use client";

import PropTypes from "prop-types";
import { useFormStatus } from "react-dom";


export const SubmitButton = ({ title, size, className }) => {
    const { pending } = useFormStatus();

    return (
        <>
            <button
                type="submit"
                className={` "flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                disabled:cursor-not-allowed disabled:shadow-none disabled:bg-indigo-400 disabled:hover:bg-indigo-400 disabled:focus-visible:outline-indigo-400 disabled:focus-visible:outline-offset-0 disabled:focus-visible:outline-2"
                ${size === "fit" ? "w-fit" : "w-full"}
                ${className}
                `}
                disabled={pending}
            >
                <p
                    className={` ${pending === true ? "hidden" : ""} `}
                >
                    {title}
                </p>
                <div className={` ${pending === true ? "flex justify-center items-center" : "hidden"}  `}>
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white">
                    </div>
                </div>
            </button>
        </>
    );
};
SubmitButton.propTypes = {
    title: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
};