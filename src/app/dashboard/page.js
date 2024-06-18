import Upload from "@/components/dashboard/Upload";
import { getUserData } from "@root/actions/user/data";

export default async function DashboardPage() {
    const userData = await getUserData();
    return (
        <div className="w-full sm:w-11/12 mx-auto py-4 my-2">
            <div
                className="flex w-full justify-between items-center max-sm:flex-col max-sm:gap-y-4"
            >
                <div>
                    <h2>Welcome back, {userData.user?.name}</h2>
                    <p>Track, manage and forecast your vidoes</p>
                </div>
                <Upload />
            </div>
        </div>
    );
}