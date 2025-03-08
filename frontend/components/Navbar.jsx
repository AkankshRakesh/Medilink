"use client";

import { useState } from "react";
import { Fugaz_One } from "next/font/google";
import Link from "next/link";
import Logout from "@/components/Logout";
import { motion, AnimatePresence } from "framer-motion";
import { Open_Sans } from 'next/font/google'
import CallToAction from "./CallToAction";
const opensans = Open_Sans({ subsets: ["latin"], weight: ["500"]  });
const fugaz = Fugaz_One({ subsets: ["latin"], weight: ["400"] });

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="p-4 flex items-center justify-between gap-4 sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <Link href="/">
        <div className="flex gap-4 items-center">
          <h1 className={`text-xl lg:text-2xl textGradient ${fugaz.className}`}>
            Medilink <i className="fa-solid fa-pills"></i>
          </h1>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-4">
            <Link href="/location" className={`text-base textGradient ${opensans.className}`}>
              Location
            </Link>
            <Link href="/doctors" className={`text-base textGradient ${opensans.className}`}>
              Find Doctors
            </Link>
            <Link href="/consultation" className={`text-base textGradient ${opensans.className}`}>
              Video Consultation
            </Link>
            <Link href="/contact" className={`text-base textGradient ${opensans.className}`} onClick={() => setIsOpen(false)}>
                Contact Us
              </Link>
          </nav>
        </div>
      </Link>

      {/* Animated Hamburger Button */}
        <button className="flex md:hidden flex-col justify-center items-center" onClick={() => setIsOpen(!isOpen)}>
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
            className="fixed top-12 left-0 right-0 bg-white/95 border-b shadow-lg md:hidden"
          >
            <nav className="flex flex-col p-4 gap-4">
              <Link href="/location" className={`text-base pb-1 textGradient ${opensans.className}`} onClick={() => setIsOpen(false)}>
                Location
              </Link>
              <Link href="/doctors" className={`text-base py-1 textGradient ${opensans.className}`} onClick={() => setIsOpen(false)}>
                Find Doctors
              </Link>
              <Link href="/consultation" className={`text-base pt-1 textGradient ${opensans.className}`} onClick={() => setIsOpen(false)}>
                Video Consultation
              </Link>
              <Link href="/contact" className={`text-base pt-1 textGradient ${opensans.className}`} onClick={() => setIsOpen(false)}>
                Contact Us
              </Link>
              <Logout />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden md:block">
        <Logout />
      </div>
    </header>
  );
}
