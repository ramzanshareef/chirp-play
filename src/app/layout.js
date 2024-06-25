import { Inter } from "next/font/google";
import "./globals.css";
import Header, { Sidebar } from "@/app/_home/Header";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserData } from "@root/actions/user/data";
import { Suspense } from "react";
import NextTopLoader from "nextjs-toploader";
import Footer from "./_home/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: {
        template: "%s | Chirp Play",
        default: "Chirp Play",
    },
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
                    zIndex={10000}
                />
                <div className="flex flex-row max-h-screen">
                    <ToastContainer
                        autoClose={1200}
                        hideProgressBar={true}
                        position="top-center"
                        transition={Slide}
                        closeOnClick={true}
                        pauseOnHover={false}
                        draggable={false}
                        closeButton={false}
                        limit={5}
                        newestOnTop={true}
                        className="z-max"
                        theme="colored"
                    />
                    <SidebarWithSuspense>
                        <SidebarWithSuspense />
                    </SidebarWithSuspense>
                    <div className="w-full flex flex-col">
                        <Suspense>
                            <HeaderWithSuspense />
                        </Suspense>
                        <div className="px-4 py-2 pb-20 sm:py-5 sm:px-20 overflow-y-scroll scrollbar-hide">
                            {children}
                        </div>
                        <Suspense>
                            <FooterWithSuspense />
                        </Suspense>
                    </div>
                </div>
            </body>
        </html>
    );
}

async function HeaderWithSuspense() {
    let userData = await getUserData();
    return <Header userData={userData} />;
}

async function SidebarWithSuspense() {
    let userData = await getUserData();
    return <Sidebar userData={userData} />;
}

async function FooterWithSuspense() {
    let userData = await getUserData();
    return <Footer userData={userData} />;
}