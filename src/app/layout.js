import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserData } from "@root/actions/user/data";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Chirp Play",
    description: "Web app for creating and sharing your chirps and videos.",
};

export default async function RootLayout({ children }) {
    let userData = await getUserData();
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body className={inter.className}>
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
                <Header userData={userData} />
                {children}
            </body>
        </html>
    );
}