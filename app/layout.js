import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import Header from "@/components/header";
import Footer from "@/components/footer";
import BackgroundImage from "@/components/backgroundimage";
//import { JsonResume } from 'jsonresume-component';
import React from "react";
import "./globals.css";

const myfont = Montserrat({ subsets: ["latin"] });
const monoFur = localFont({ src: "../public/MonofurNerdFont-Regular.ttf", display: "swap" });

export const metadata = {
    title: "Batteries Etc",
    description: "Proudly Serving Inverness, FL and Surrounding Areas 352-344-1962",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`w-full h-full ${myfont.className} overflow-y-auto`}>
                <BackgroundImage src="pcb.jpg" />
                <div className="bg-overlay">
                    <Header font={myfont.className} slug="Batteries Etc" />
                    <main className="w-full relative z-10 flex-grow">{children}</main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
