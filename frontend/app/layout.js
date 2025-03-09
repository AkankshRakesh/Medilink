import { Fugaz_One, Open_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Head from "./head";
import { ToastContainer } from "react-toastify";
import Logout from "@/components/Logout";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "@/components/Navbar";

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
    <html lang="en">
      <Head />
        <body className={'w-full mx-auto text-sm sm:text-base min-h-screen flex flex-col text-slate-800  ' + opensans.className}>
          <Navbar />
          <ToastContainer />
          <GoogleOAuthProvider clientId="236783902486-2n0e2j7c18t8ar3cgvo2rndi93jno75h.apps.googleusercontent.com" >
          {children}
          </GoogleOAuthProvider>
        </body>
    </html>
  );
}
