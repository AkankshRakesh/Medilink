'use client'
import { Fugaz_One } from 'next/font/google';
import { CopyrightIcon, Facebook, Instagram, Linkedin, Mail, Youtube } from 'lucide-react'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Specialties from './Specialties';
import FindDoc from './findDoc';
import Card from "@/components/Card";
import { animate, motion, useMotionValue } from "framer-motion";
import useMeasure from "react-use-measure";
import Spline from '@splinetool/react-spline';
import Image from 'next/image';
// import MapChart from "./MapChart";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";


const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });
const images = [
  "/Docs_headshots/img1.png",
  "/Docs_headshots/img2.png",
  "/Docs_headshots/img3.png",
  "/Docs_headshots/img4.png",
  "/Docs_headshots/img5.png",
  "/Docs_headshots/img6.jpg",
  "/Docs_headshots/img7.png",
  "/Docs_headshots/img8.jpg",
];


export default function Hero() {
  const FAST_DURATION = 25;
  const SLOW_DURATION = 75;

  const [duration, setDuration] = useState(FAST_DURATION);
  const [ref, { width }] = useMeasure();

  const xTranslation = useMotionValue(0);

  const [mustFinish, setMustFinish] = useState(false);
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    let controls;
    let finalPosition = -width / 2 - 8;

    if (mustFinish) {
      controls = animate(xTranslation, [xTranslation.get(), finalPosition], {
        ease: "linear",
        duration: duration * (1 - xTranslation.get() / finalPosition),
        onComplete: () => {
          setMustFinish(false);
          setRerender(!rerender);
        },
      });
    } else {
      controls = animate(xTranslation, [0, finalPosition], {
        ease: "linear",
        duration: duration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
      });
    }

    return controls?.stop;
  }, [rerender, xTranslation, duration, width]);

    return (
      <>
        <div className='mt-6 flex flex-col dark:bg-gray-900'>
            <div className="bg-[#D4D5E5] ">
      {/* Hero Section */}
      <div className="px-6 pb-16 pt-12 lg:p-10 py-0">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900  leading-tight">
              Find the right doctor for all your concerns
            </h1>
            <p className="text-lg text-gray-700 ">
              Private consultation + Audio call · Starts at just ₹249
            </p>
            <Link href="/doctors" className="inline-block">
            <button className="bg-[#4C6FFF] text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors ">
              Consult Now
            </button>
            </Link>

            <div className="flex gap-6 pt-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-700 " viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <polyline points="16 11 18 13 22 9" />
                </svg>
                <span className="text-sm text-gray-700 ">Verified Doctors</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-700 " viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
                <span className="text-sm text-gray-700 ">Digital Prescription</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-700 " viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
                </svg>
                <span className="text-sm text-gray-700 ">Free Followups</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 relative h-[620px] block md:hidden z-10">
            <Image
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Mobile View"
              width={500}
              height={500}
              className="w-full h-full object-cover rounded-xl shadow-xl"
            />
          </div>
          <div className="flex-1 relative h-[620px] hidden lg:block">
        <Spline
          className="w-auto h-auto"
          scene="https://prod.spline.design/DsttbXsriKDBQQMr/scene.splinecode"/>
        <div className="absolute bottom-0 left-0 w-full h-14 bg-[#D4D5E5]  z-10"></div>
      </div>
        </div>
      </div>
    </div>

            <FindDoc/>
            <Specialties/>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-4 bg-gray-900 p-8 dark:bg-gray-800">
                  <div className="text-center">
                    <div className="text-white text-2xl font-bold">2,00,000+</div>
                    <div className="text-gray-400 text-sm">Happy Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white text-2xl font-bold">20,000+</div>
                    <div className="text-gray-400 text-sm">Verified Doctors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white text-2xl font-bold">25+</div>
                    <div className="text-gray-400 text-sm">Specialities</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white text-2xl font-bold">4.5/5</div>
                    <div className="text-gray-400 text-sm">App Rating</div>
                  </div>
                </div>

                <div className="relative py-12 mt-8 dark:bg-gray-900">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-70 dark:from-gray-800 dark:to-gray-800"></div>
          <div className="relative z-10 text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 inline-block text-transparent bg-clip-text">
              Benefits of Online Consultation
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-8 md:px-12 lg:px-16 relative z-10">
         
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-blue-50 dark:border-gray-700 flex flex-col h-full transform hover:-translate-y-1">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 w-14 h-14 flex items-center justify-center mb-5">
                <svg
                  className="w-7 h-7 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">24/7 Doctor Access</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">
                Connect instantly with specialists around the clock or schedule video consultations with your preferred
                doctor.
              </p>
            </div>

            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-blue-50 dark:border-gray-700 flex flex-col h-full transform hover:-translate-y-1">
              <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 w-14 h-14 flex items-center justify-center mb-5">
                <svg
                  className="w-7 h-7 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Quick & Convenient</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">
                Start an instant consultation within 2 minutes or join scheduled video appointments from the comfort of
                your home.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-blue-50 dark:border-gray-700 flex flex-col h-full transform hover:-translate-y-1">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 w-14 h-14 flex items-center justify-center mb-5">
                <svg
                  className="w-7 h-7 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Private & Secure</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">
                Rest assured that all consultations are fully private, encrypted, and comply with healthcare security
                standards.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-blue-50 dark:border-gray-700 flex flex-col h-full transform hover:-translate-y-1">
              <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 w-14 h-14 flex items-center justify-center mb-5">
                <svg
                  className="w-7 h-7 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Digital Prescriptions</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">
                Receive legally valid digital prescriptions directly to your device, ready to use at your preferred
                pharmacy.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-blue-50 dark:border-gray-700 flex flex-col h-full transform hover:-translate-y-1">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 w-14 h-14 flex items-center justify-center mb-5">
                <svg
                  className="w-7 h-7 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Free Follow-ups</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">
                Enjoy complimentary 7-day follow-up consultations to address any concerns or questions about your
                treatment.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-blue-50 dark:border-gray-700 flex flex-col h-full transform hover:-translate-y-1">
              <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 w-14 h-14 flex items-center justify-center mb-5">
                
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Instant Access</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">
                Skip the waiting room and connect with certified healthcare professionals in minutes, anytime and
                anywhere.
              </p>
            </div>
          </div>
        </div>


        <div className="relative z-10 text-center mt-16">
        <h2 className="text-2xl  md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 inline-block text-transparent bg-clip-text">
          Get connected with Doctors across the Globe
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full"></div>
          </div>
          

        <div className="ml-[-5rem] w-full mx-auto mb-0">
  <ComposableMap
    className="text-center font-sans text-lg"
  >
    <Geographies geography="/features.json">
      {({ geographies }) =>
        geographies.map((geo) => (
          <Geography
            key={geo.rsmKey}
            geography={geo}
            style={{
              default: {
                fill: "#2a354d", // Updated to match the theme
                outline: "none",
              },
              hover: {
                fill: "#4C6FFF", // Blue matching the site's theme
                outline: "none",
              },
              pressed: {
                fill: "#4C6FFF", // Blue matching the site's theme
                outline: "none",
              },
            }}
          />
        ))
      }
    </Geographies>
  </ComposableMap>
</div>


<div className="relative z-10 text-center mt-16">
        <h2 className="text-2xl  md:text-4xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 inline-block text-transparent bg-clip-text">
          Get treated from the convenience of your Home
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full"></div>
          </div>


<div className="relative py-8 overflow-hidden dark:bg-slate-900">
  <motion.div
    className="flex gap-4"
    style={{ x: xTranslation }}
    ref={ref}
    onHoverStart={() => {
      setMustFinish(true);
      setDuration(SLOW_DURATION);
    }}
    onHoverEnd={() => {
      setMustFinish(true);
      setDuration(FAST_DURATION);
    }}
  >
    {[...images, ...images].map((item, idx) => (
      <Card image={item} key={idx} />
    ))}
  </motion.div>
</div>


<div className="text-center mt-10 mb-10">
            <Link href="/doctors">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                Consult a Doctor Now
              </button>
            </Link>
          </div>

              
              </div>

              <footer className="bg-slate-800 dark:bg-black py-12 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="container mx-auto max-w-6xl">
          {/* Social Media */}
          <div className="flex items-center justify-center mb-8">
            <div className="h-px bg-slate-600 dark:bg-gray-700 flex-1"></div>
            <div className="flex space-x-6 px-6">
              <a href="#" className="text-slate-300 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors" aria-label="YouTube">
                <Youtube size={24} />
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin size={24} />
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors" aria-label="Email">
                <Mail size={24} />
              </a>
            </div>
            <div className="h-px bg-slate-600 dark:bg-gray-700 flex-1"></div>
          </div>

          {/* Logo */}
          <div className="mb-8 text-center">
            <Link href="/" className={`text-2xl md:text-3xl text-slate-100 dark:text-white ${fugaz.className}`}>
              Medilink
            </Link>
          </div>

          {/* Copyright */}
          <div className="flex items-center justify-center text-slate-400 dark:text-gray-400 text-sm mb-6">
            <span>Copyright</span>
            <CopyrightIcon size={14} className="mx-1" />
            <span>2025 Medilink, Inc</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-slate-300 dark:text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              Legal Terms
            </a>
            <span className="hidden sm:inline text-slate-500 dark:text-gray-600">|</span>
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <span className="hidden sm:inline text-slate-500 dark:text-gray-600">|</span>
            <a href="#" className="hover:text-white transition-colors">
              Security
            </a>
            <span className="hidden sm:inline text-slate-500 dark:text-gray-600">|</span>
            <a href="#" className="hover:text-white transition-colors">
              Website Accessibility
            </a>
            <span className="hidden sm:inline text-slate-500 dark:text-gray-600">|</span>
            <a href="#" className="hover:text-white transition-colors">
              Manage Cookies
            </a>
          </div>
        </div>
      </footer>
              </>
    )
}