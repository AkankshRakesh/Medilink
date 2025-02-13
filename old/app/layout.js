import { Fugaz_One, Open_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Head from "./head";
import { ToastContainer } from "react-toastify";
import Logout from "@/components/Logout";
import Login from "@/components/Login";

const opensans = Open_Sans({ subsets: ["latin"] });
const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export const metadata = {
  title: "Moodl",
  description: "Track your daily mood every day of the year!",
};

export default function RootLayout({ children }) {
  const header = (
    <header className="p-4 flex items-center justify-between gap-4">
      <Link href={'/'}>
        <h1 className={'text-base sm:text-lg textGradient ' + fugaz.className}>Moodl <i class="fa-solid fa-brain"></i></h1>
      </Link>
      <Logout />
    </header>
  )

  return (
    <html lang="en">
      <Login/>
        <body className={'w-full max-w-[1000px] mx-auto text-sm sm:text-base min-h-screen flex flex-col text-slate-800  ' + opensans.className}>
          {header}
          <ToastContainer />
          {children}
        </body>
    </html>
  );
}
