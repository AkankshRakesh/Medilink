'use client'
import { Fugaz_One } from 'next/font/google';
import React from 'react'
import Button from './Button';
import Calendar from './Calendar';
import Link from 'next/link';
import CallToAction from './CallToAction';
import Specialties from './Specialties';
import Find_Doc from './findDoc';
const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function Hero() {
    return (
        <div className='pb-4 flex flex-col'>
            <div className=" bg-[#dfe2ec]">
      {/* Hero Section */}
      <div className="px-6 pb-16 pt-12 lg:p-16">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Find the right doctor for all your concerns
            </h1>
            <p className="text-lg text-gray-700">
              Private consultation + Audio call · Starts at just ₹199
            </p>
            <Link href="/doctors" className="inline-block">
            <button className="bg-[#4C6FFF] text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors">
              Consult Now
            </button>
            </Link>
            
            <div className="flex gap-6 pt-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <polyline points="16 11 18 13 22 9" />
                </svg>
                <span className="text-sm text-gray-700">Verified Doctors</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
                <span className="text-sm text-gray-700">Digital Prescription</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
                </svg>
                <span className="text-sm text-gray-700">Free Followups</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Doctor consultation"
              className="rounded-2xl shadow-xl w-full"
            />
          </div>
        </div>

        {/* Stats Section */}
        
      </div>
    </div>

            <Find_Doc/>
            <Specialties/>
            <div className=" grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 bg-gray-900  p-8">
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
        </div>
    )
}
