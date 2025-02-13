import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Ambulance, CircleUserRound, ContactRound, Hospital, House, KeyRound, LogOut, Menu, X } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
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
      <div className="flex justify-between w-full items-center">
        <h1 className="text-2xl font-bold">Moodl</h1>

        <div className="hidden md:flex gap-14 items-center">
          <div className="space-x-6 text-lg font-semibold tracking-wide flex">
            <Link to={"/"} className="hover:text-gray-300 flex items-center gap-1">
            <House />
              Home
            </Link>
            <Link to={"/about"} className="hover:text-gray-300 flex items-center gap-1">
            <Hospital />
              About
            </Link>
            <Link to={"/service"} className="hover:text-gray-300 flex items-center gap-1">
            <Ambulance />
              Services
            </Link>
            <Link to={"/contect"} className="hover:text-gray-300 flex items-center gap-1">
            <ContactRound />
              Contact
            </Link>
          </div>
          <div
            className="flex gap-2 items-center bg-slate-600 hover:bg-slate-700 px-4 py-1 rounded-xl cursor-pointer"
            onClick={() => {
              navigate("/auth");
            }}
          >
            <KeyRound className="font-bold" />
            <p className="font-bold text-xl">Log In</p>
          </div>
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
                <Link
                  to={"/"}
                  className="hover:text-gray-400 flex items-center gap-2 hover:border-b w-fit"
                  onClick={toggleMenu}
                >
                  <House />
                  Home
                </Link>
                <Link
                  to={"/about"}
                  className="hover:text-gray-400 flex items-center gap-2 hover:border-b w-fit"
                  onClick={toggleMenu}
                >
                  <Hospital />
                  About
                </Link>
                <Link
                  to={"/service"}
                  className="hover:text-gray-400 flex items-center gap-2 hover:border-b w-fit"
                  onClick={toggleMenu}
                >
                  <Ambulance />
                  Services
                </Link>
                <Link
                  to={"/contect"}
                  className="hover:text-gray-400 flex items-center gap-2 hover:border-b w-fit"
                  onClick={toggleMenu}
                >
                  <ContactRound />
                  Contact
                </Link>
              </div>
            </div>
            <div className="p-4 flex justify-between items-center px-8">
              <div
                className="flex items-center gap-2 text-xl font-bold cursor-pointer"
                onClick={() => {
                  toggleMenu();
                  navigate("/auth");
                }}
              >
                <LogOut className="cursor-pointer" />
                <p>Log In</p>
              </div>
              <div>
                <CircleUserRound size={40} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
