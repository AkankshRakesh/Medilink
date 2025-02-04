import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleUserRound, LogOut, Menu, X } from "lucide-react";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav className="bg-gray-900 text-white p-4 fixed w-full z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Moodl</h1>

        <div className="hidden md:flex space-x-6">
          <a href="#" className="hover:text-gray-400">
            Home
          </a>
          <a href="#" className="hover:text-gray-400">
            About
          </a>
          <a href="#" className="hover:text-gray-400">
            Services
          </a>
          <a href="#" className="hover:text-gray-400">
            Contact
          </a>
        </div>

        <button className="md:hidden" onClick={toggleMenu}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.7, type: "spring" }}
            className="fixed w-7/12 bg-gray-900 h-full right-0 top-0 flex flex-col justify-between origin-top-right"
          >
            <div className="flex flex-col gap-4 p-4 items-end">
              <button className="text-right" onClick={toggleMenu}>
                <X size={28} />
              </button>
              <div className="flex justify-end p-4 flex-col gap-4 text-xl font-bold">
                <a
                  href="#"
                  className="hover:text-gray-400"
                  onClick={toggleMenu}
                >
                  Home
                </a>
                <a
                  href="#"
                  className="hover:text-gray-400"
                  onClick={toggleMenu}
                >
                  About
                </a>
                <a
                  href="#"
                  className="hover:text-gray-400"
                  onClick={toggleMenu}
                >
                  Services
                </a>
                <a
                  href="#"
                  className="hover:text-gray-400"
                  onClick={toggleMenu}
                >
                  Contact
                </a>
              </div>
            </div>
            <div className="p-4 flex justify-between items-center px-8">
              <div className="flex items-center gap-2 text-xl font-bold">
              <LogOut className="cursor-pointer" onClick={toggleMenu} />
              <p>Log Out</p>
              </div>
              <div>
                <CircleUserRound size={40}/>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
