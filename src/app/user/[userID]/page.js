import { getAUserData } from "@root/actions/user/otherUser";
import Image from "next/image";
import { ContentBox, SubscribeButton } from "./ClientComponents";
import { getUserData, getUsersSubsribedData } from "@root/actions/user/data";
import { Suspense } from "react";
import moment from "moment";

export default async function UserPage({ params, searchParams }) {
    const userDetails = await getAUserData(params?.userID);
    const loggedInUser = await getUserData();
    const usersSubsribedData = await getUsersSubsribedData();
    return <>
        <Suspense>
            <div
                className="relative h-40 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${userDetails?.user?.coverImage})` }}
            >
                <div className="absolute bottom-0 left-4 transform translate-y-1/2">
                    <Image
                        src={userDetails?.user?.avatar}
                        alt={`${userDetails?.user?.name}'s avatar`}
                        className="h-24 w-24 rounded-full border-4 border-white"
                        width={96}
                        height={96}
                    />
                </div>
            </div>
            <div className="mt-12 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold">{userDetails?.user?.name}</h1>
                    <p className="text-gray-600 text-sm">@{userDetails?.user?.username} • Joined {moment(userDetails?.user?.createdAt).format("MMMM YYYY")}</p>
                    <p className="text-gray-600">{userDetails?.subscribers} subscribers</p>
                </div>
                <SubscribeButton
                    userID={params?.userID}
                    loggedInUser={loggedInUser}
                />
            </div>
            <ContentBox
                userDetails={userDetails}
                videos={userDetails?.videos}
                activeTab={searchParams?.tab || "videos"}
                loggedInUser={loggedInUser}
                chirps={userDetails?.chirps}
                chirpLikes={userDetails?.chirpLikes}
                usersSubsribedData={usersSubsribedData?.subscribedUsers}
            />
        </Suspense>
    </>;
}