import { getAUserData } from "@root/actions/user/otherUser";
import Image from "next/image";
import { ContentBox } from "./ClientComponents";
import { SubscribeButton } from "@/components/buttons/SubscribeButton";
import { Suspense } from "react";
import moment from "moment";
import { notFound } from "next/navigation";
import Loader from "@/components/loader";

export default async function UserPage({ params, searchParams }) {
    const userDetails = await getAUserData(params?.userID);
    if (userDetails.user.length === 0) notFound();
    return (<>
        <Suspense fallback={<Loader />}>
            <div
                className="relative h-40 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${userDetails?.user[0]?.coverImage})` }}
            >
                <div className="absolute bottom-0 left-4 transform translate-y-1/2">
                    <Image
                        src={userDetails?.user[0]?.avatar}
                        alt={`${userDetails?.user[0]?.name}'s avatar`}
                        className="h-24 w-24 rounded-full border-4 border-white"
                        width={96}
                        height={96}
                    />
                </div>
            </div>
            <div className="mt-12 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold">{userDetails?.user[0]?.name}</h1>
                    <p className="text-gray-600 text-sm">@{userDetails?.user[0]?.username} • Joined {moment(userDetails?.user[0]?.createdAt).format("MMMM YYYY")}</p>
                    <p className="text-gray-600">
                        {userDetails?.user[0]?.subscribersToUser ? userDetails?.user?.length : 0} subscribers
                    </p>
                </div>
                <SubscribeButton
                    userID={params?.userID}
                    isSubscribed={userDetails?.user[0]?.isSubscribed}
                    isAuth={userDetails?.isAuth}
                    isCurrentUser={userDetails?.isCurrentUser}
                />
            </div>
            <ContentBox
                userDetails={userDetails}
                isAuth={userDetails?.isAuth}
                activeTab={searchParams?.tab || "videos"}
                isCurrentUser={userDetails?.isCurrentUser}
            />
        </Suspense>
    </>);
}

export async function generateMetadata({ params }) {
    const userDetails = await getAUserData(params?.userID);
    return {
        title: userDetails?.user[0]?.name || "😞 User Not Found",
        description: userDetails?.user[0]?.name + " is a user on our platform" || "Sorry, we couldn't find the user you're looking for",
    };
}