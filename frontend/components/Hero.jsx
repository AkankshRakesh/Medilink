'use client'
import { Fugaz_One } from 'next/font/google';
import React from 'react'
import Button from './Button';
import Calendar from './Calendar';
import Link from 'next/link';
import CallToAction from './CallToAction';
import Specialties from './Specialties';
import Find_Doc from './findDoc';
// import Carousel from './Carousel';

import Spline from '@splinetool/react-spline';

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function Hero() {
    return (
        <div className='pb-4 flex flex-col'>
            <div className=" bg-[#D4D5E5]">
      {/* Hero Section */}
      <div className="px-6 pb-16 pt-12 lg:p-10 py-0">
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
          <div className="flex-1 relative h-[620px] block md:hidden z-10">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Mobile View"
              className="w-full h-full object-cover rounded-xl shadow-xl"
            />
          </div>
          <div className="flex-1 relative h-[620px] hidden md:block">
        <Spline
          className="w-auto h-auto"
          scene="https://prod.spline.design/DsttbXsriKDBQQMr/scene.splinecode"/>

      </div>
        </div>
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



              <div className="text-black text-xl sm:text-2xl md:text-3xl ml-4 sm:ml-6 md:ml-12 lg:ml-[62px] font-bold">
              {/* <span>
              <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 576 512"
              className="w-5 h-5"
              >
              <path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/> */}
              {/* </svg> */}
              Benefits of Online Consultation  
              </div>
              <div className="gap-2 border border-gray-200 mx-4 sm:mx-6 md:mx-12 lg:mx-16 my-5 p-4 sm:p-8 md:p-16 lg:p-24 rounded-xl transition-shadow duration-300 ease-in-out hover:shadow-[0_0_20px_8px_rgba(59,130,246,0.5)] max-w-9xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-12">
                  <div className="flex flex-col border border-gray-300 p-8  font-semibold text-base sm:text-lg md:text-xl gap-4 rounded-2xl"
                  style={{boxShadow: '0 0 20px 5px rgba(99, 102, 241, 0.4)'}}>
                    <div className="text-blue-500">
                      Consult Top Doctors 24x7
                    </div>
                    <div className="text-gray-700">
                      Connect instantly with a 24x7 specialist or choose to video visit a particular
                      doctor.
                    </div>
                  </div>
                  <div className="flex flex-col border border-gray-300 p-8  font-semibold text-base sm:text-lg md:text-xl gap-4 rounded-2xl"
                  style={{ boxShadow: '0 0 20px 5px rgba(59, 130, 246, 0.4)' }}>
                    <div className="text-blue-500">
                      Convenient and Easy
                    </div>
                    <div className="text-gray-700">
                      Start an instant consultation within 2 minutes or do video consultation
                      at the scheduled time.
                    </div>
                  </div>
                  <div className="flex flex-col border border-gray-300 p-8  font-semibold text-base sm:text-lg md:text-xl gap-4 rounded-2xl"
                  style={{boxShadow: '0 0 20px 5px rgba(99, 102, 241, 0.4)'}}>
                    <div className="text-blue-500">
                      100% Safe Consultations
                    </div>
                    <div className="text-gray-700">
                      Be assured that your online consultation will be fully private and secured.
                    </div>
                  </div>
                  <div className="flex flex-col border border-gray-300 p-8  font-semibold text-base sm:text-lg md:text-xl gap-4 rounded-2xl"
                  style={{boxShadow: '0 0 20px 5px rgba(99, 102, 241, 0.4)'}}>
                    <div className="text-blue-500">
                      Digital Prescriptions
                    </div>
                    <div className="text-gray-700">
                      Receive legally valid prescriptions straight to your phone or email.
                    </div>
                  </div>
                  <div className="flex flex-col border border-gray-300 p-8 font-semibold text-base sm:text-lg md:text-xl gap-4 rounded-2xl"
                  style={{ boxShadow: '0 0 20px 5px rgba(59, 130, 246, 0.4)' }}>
                    <div className="text-blue-500">
                      Free Follow-up
                    </div>
                    <div className="text-gray-700">
                      Get a valid digital prescription and a 7-day, free follow-up for further
                      clarifications.
                    </div>
                  </div>
                  <div className="flex flex-col border border-gray-300 p-8  font-semibold text-base sm:text-lg md:text-xl gap-4 rounded-2xl"
                  style={{boxShadow: '0 0 20px 5px rgba(99, 102, 241, 0.4)'}}>
                    <div className="text-blue-500">
                      Instant Access
                    </div>
                    <div className="text-gray-700">
                      Connect with a certified doctor instantly—no waiting, no hassle.
                    </div>
                  </div>
                </div>
              </div>
              

              {/* <Carousel/> */}
              </div>
    )
}
