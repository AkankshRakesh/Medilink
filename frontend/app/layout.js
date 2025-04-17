import { Fugaz_One, Open_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Head from "./head";
import { ToastContainer } from "react-toastify";
import Logout from "@/components/Logout";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "next-themes";

const opensans = Open_Sans({ subsets: ["latin"] });
const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export const metadata = {
  title: "Medilink",
  description: "Track your daily mood every day of the year!",
};

export default function RootLayout({ children }) {
  const header = (
    <header className="p-4 flex items-center justify-between gap-4">
      <Link href={'/'}>
        <div className="flex gap-4">
          <h1 className={'text-base sm:text-lg textGradient ' + fugaz.className}>CosmoCounsel <i className="fa-solid fa-prescription"></i></h1>
          <h1 className={'text-base sm:text-lg textGradient ' + fugaz.className}>Location</h1>
          <h1 className={'text-base sm:text-lg textGradient ' + fugaz.className}>Find Doctors</h1>
          <h1 className={'text-base sm:text-lg textGradient ' + fugaz.className}>Video Consultation</h1>
        </div>
        
        </Link>
      <div>
        <Logout />
      </div>
    </header>
  )

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
            <link rel="icon" href="pills-solid.svg" sizes="any" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        </head>
        <body className={'w-full mx-auto text-sm sm:text-base min-h-screen flex flex-col text-slate-800 overflow-y-scroll no-scrollbar ' + opensans.className}>
          
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />
          <ToastContainer />
          {children}
          
      </ThemeProvider>
        </body>
    </html>
  );
}
