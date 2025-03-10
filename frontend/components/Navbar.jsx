'use client'

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Fugaz_One, Open_Sans } from "next/font/google";
import Link from "next/link";
import Logout from "@/components/Logout";
import { motion, AnimatePresence } from "framer-motion";
import CallToAction from "./CallToAction";

const opensans = Open_Sans({ subsets: ["latin"], weight: ["500"] });
const fugaz = Fugaz_One({ subsets: ["latin"], weight: ["400"] });

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Get the current route

  // Function to check if the link is active
  const isActive = (path) => pathname === path ? "border-b-2 border-blue-500" : "";

  return (
    <header className="p-4 flex items-center justify-between gap-4 sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
        <div className="flex gap-4 items-center ">
          <h1 className={`text-xl lg:text-2xl textGradient ${fugaz.className}`}>
           <Link href="/">Medilink <i className="fa-solid fa-pills"></i></Link>
          </h1>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-4 mt-2">
            <Link href="/doctors" className={`text-base textGradient pb-1 ${opensans.className} ${isActive('/doctors')}`}>
            <i className="fa-solid fa-user-doctor mr-2"></i>Find Doctors
            </Link>
            <Link href="/consultation" className={`text-base textGradient pb-1 ${opensans.className} ${isActive('/consultation')}`}>
            <i className="fa-solid fa-video mr-2"></i>Video Consultation
            </Link>
            <Link href="/contact" className={`text-base textGradient pb-1 ${opensans.className} ${isActive('/contact')}`} onClick={() => setIsOpen(false)}>
            <i className="fa-solid fa-headset mr-2"></i>Contact Us
            </Link>
          </nav>
        </div>

      {/* Animated Hamburger Button */}
      <button className="flex lg:hidden flex-col justify-center items-center" onClick={() => setIsOpen(!isOpen)}>
        <motion.span
          className="bg-black block h-0.5 w-6 rounded-sm transition-all duration-300 ease-out"
          animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
        ></motion.span>
        <motion.span
          className="bg-black block h-0.5 w-6 rounded-sm my-1 transition-all duration-300 ease-out"
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.2 }}
        ></motion.span>
        <motion.span
          className="bg-black block h-0.5 w-6 rounded-sm transition-all duration-300 ease-out"
          animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
        ></motion.span>
      </button>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-12 left-0 right-0 bg-white/95 border-b shadow-lg lg:hidden"
          >
            <nav className="flex flex-col p-4 gap-4">
              <Link href="/doctors" className={`text-base py-1 textGradient ${opensans.className} ${isActive('/doctors')}`} onClick={() => setIsOpen(false)}>
              <i className="fa-solid fa-user-doctor mr-2"></i>Find Doctors
              </Link>
              <Link href="/consultation" className={`text-base pt-1 textGradient ${opensans.className} ${isActive('/consultation')}`} onClick={() => setIsOpen(false)}>
              <i className="fa-solid fa-video mr-2"></i>Video Consultation
              </Link>
              <Link href="/contact" className={`text-base pt-1 textGradient ${opensans.className} ${isActive('/contact')}`} onClick={() => setIsOpen(false)}>
              <i className="fa-solid fa-headset mr-2"></i>Contact Us
              </Link>
              <Logout />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden lg:block">
        <Logout />
      </div>
    </header>
  );
}
