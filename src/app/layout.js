import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/_home/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserData } from "@root/actions/user/data";
import { Suspense } from "react";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Chirp Play",
    description: "Web app for creating and sharing your chirps and videos.",
};

export default async function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body className={inter.className}>
                <NextTopLoader
                    color="#6366f1"
                    showSpinner={false}
                    initialPosition={0.2}
                    crawl={false}
                    crawlSpeed={300}
                />
                <ToastContainer
                    autoClose={1200}
                    hideProgressBar={true}
                    position="top-center"
                    closeOnClick={true}
                    pauseOnHover={false}
                    draggable={false}
                    closeButton={false}
                    limit={5}
                    newestOnTop={true}
                    className="z-max"
                />
                <Suspense>
                    <HeaderWithSuspense />
                </Suspense>
                {children}
            </body>
        </html>
    );
}

async function HeaderWithSuspense() {
    let userData = await getUserData();
    return <Header userData={userData} />;
}