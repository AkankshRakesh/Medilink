"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Fugaz_One, Open_Sans } from "next/font/google"
import Link from "next/link"
import Logout from "@/components/Logout"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "./icons"

const opensans = Open_Sans({ subsets: ["latin"], weight: ["500"] })
const fugaz = Fugaz_One({ subsets: ["latin"], weight: ["400"] })

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const isActive = (path) => pathname === path

  const navLinks = [
    { href: "/doctors", icon: "fa-solid fa-user-doctor", label: "Find Doctors" },
    { href: "/about", icon: "fa-solid fa-user-nurse", label: "About Us" },
    { href: "/contact", icon: "fa-solid fa-headset", label: "Contact Us" },
  ]

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "py-1 md:py-2 bg-white/90 dark:bg-gray-900/90 shadow-md backdrop-blur"
          : "py-3 md:py-4 bg-white dark:bg-gray-900 backdrop-blur-sm",
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className={`text-xl lg:text-2xl font-bold ${fugaz.className}`}>
            <Link
              href="/"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
            >
              Medilink <i className="fa-solid fa-pills"></i>
            </Link>
          </h1>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative group flex items-center text-base text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 py-2",
                  opensans.className,
                )}
              >
                <i
                  className={`${link.icon} mr-2 text-blue-500 group-hover:text-blue-600 dark:text-blue-400 dark:group-hover:text-blue-300 transition-colors`}
                ></i>
                {link.label}
                {isActive(link.href) && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    layoutId="activeNavIndicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
        {mounted && (
  <button
    onClick={toggleTheme}
    className={`ml-3 flex items-center justify-center rounded-full p-1 transition-colors duration-300
      ${theme === "light" ? "bg-gray-200 text-[#2563eb]" : "bg-gray-800 text-[#2563eb]"}`}
    aria-label="Toggle Theme"
  >
    {theme === "light" ? (
      <SunIcon className="h-5 w-5 fill-black" />
    ) : (
      <MoonIcon className="h-5 w-5 fill-white" />
    )}
  </button>
)}


          <div className="hidden lg:block">
            <Logout />
          </div>

          <button
            className="flex lg:hidden flex-col justify-center items-center w-10 h-10 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              className="bg-blue-600 dark:bg-blue-400 block h-0.5 w-6 rounded-sm transition-all duration-300 ease-out"
              animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            ></motion.span>
            <motion.span
              className="bg-blue-600 dark:bg-blue-400 block h-0.5 w-6 rounded-sm my-1 transition-all duration-300 ease-out"
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
            ></motion.span>
            <motion.span
              className="bg-blue-600 dark:bg-blue-400 block h-0.5 w-6 rounded-sm transition-all duration-300 ease-out"
              animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            ></motion.span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-white dark:bg-gray-900 shadow-lg border-t border-gray-100 dark:border-gray-800"
          >
            <div className="container mx-auto px-4">
              <nav className="flex flex-col py-4 gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center text-base py-2 px-3 rounded-lg transition-colors",
                      opensans.className,
                      isActive(link.href)
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400",
                    )}
                  >
                    <i
                      className={`${link.icon} mr-3 ${isActive(link.href) ? "text-blue-500 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}
                    ></i>
                    {link.label}
                  </Link>
                ))}


                <div className="mt-2 px-3">
                  <Logout />
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
