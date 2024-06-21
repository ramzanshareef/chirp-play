import { userLogout } from "@root/actions/user/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const LogoutButton = ({ beforeOnClickFn }) => {
    const router = useRouter();
    return (
        <button
            className="bg-indigo-500 m-6 hover:bg-indigo-700 text-white font-normal py-2 px-4 rounded-md"
            onClick={async (e) => {
                e.preventDefault();
                beforeOnClickFn && beforeOnClickFn();
                await userLogout();
                toast.success("Logged out", {
                    onClose: () => {
                        router.replace("/login");
                    },
                });
            }}
        >
            Logout
        </button>
    );
};