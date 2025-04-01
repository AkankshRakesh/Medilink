"use client"

import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  CopyrightIcon,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Youtube,
} from "lucide-react"
import { Fugaz_One } from "next/font/google"
import { useState } from "react"
import Link from "next/link"

const fugaz = Fugaz_One({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
})
import pic1 from "../public/AboutUsPics/aboutus1.jpeg"
import pic2 from "../public/AboutUsPics/aboutus2.avif"
import pic3 from "../public/AboutUsPics/div1.svg"
import pic4 from "../public/AboutUsPics/div2.svg"
import pic5 from "../public/AboutUsPics/div3.svg"
import pic6 from "../public/AboutUsPics/sustainibility.avif"
import pic7 from "../public/AboutUsPics/wellness.avif"
import pic8 from "../public/AboutUsPics/care.avif"
import pic9 from "../public/AboutUsPics/growth.jpg"
import better from "../public/AboutUsPics/better.jpg"
import Image from "next/image"
export const Aboutus = () => {
  const testimonials = [
    {
      name: "John Doe",
      img: "https://www.stryx.com/cdn/shop/articles/man-looking-attractive.jpg?v=1666662774",
      review:
        "Easy to use and highly professional service. The doctors are attentive and provide clear advice. Highly recommended!",
      color: "#FF5733",
    },
    {
      name: "Jane Smith",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNHfPBD1IU8yer95JpHkMQB9-F6p-aV907MA&s",
      review:
        "Quick appointment booking and seamless consultation. The experience was smooth, and the medical guidance was spot-on!",
      color: "#097969",
    },
    {
      name: "Emily Johnson",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_k00ibnFvQaMvvSRBY3ZBpT3Cit1hn9ztHw&s",
      review:
        "Great platform for online consultations. The doctors are knowledgeable, and the response time is impressive!",
      color: "#96DED1",
    },
    {
      name: "Michael Brown",
      img: "https://static.vecteezy.com/system/resources/thumbnails/005/346/410/small_2x/close-up-portrait-of-smiling-handsome-young-caucasian-man-face-looking-at-camera-on-isolated-light-gray-studio-background-photo.jpg",
      review:
        "A fantastic healthcare solution! Booking appointments is hassle-free, and the doctors genuinely care about patient well-being.",
      color: "#4CBB17",
    },
    {
      name: "Sophia Wilson",
      img: "https://media.licdn.com/dms/image/C5612AQHBdKAy4Gy84g/article-cover_image-shrink_720_1280/0/1606351329473?e=2147483647&v=beta&t=mLW_cQxhzNMHPXvh8MvKjnv4hB7SjoojUPJE-HN-zRM",
      review:
        "Medilink made my healthcare journey so much easier. The interface is user-friendly, and I got expert advice in no time!",
      color: "#C4B454",
    },
  ]

  const [index, setIndex] = useState(0)

  const prevReview = () => {
    setIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1))
  }

  const nextReview = () => {
    setIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1))
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#f0f2fd] to-[#e8ecff] py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-3/5 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 tracking-tight">About Us</h1>
              <p className="text-lg md:text-xl text-slate-700 leading-relaxed max-w-2xl">
                Our platform is designed, not just assembled, to provide a seamless and reassuring healthcare
                experience—connecting you with the right doctors effortlessly.
              </p>
            </div>
            <div className="w-full md:w-2/5 mt-8 md:mt-0">
              <div className="relative h-64 sm:h-72 md:h-80 lg:h-96 overflow-hidden rounded-xl shadow-2xl">
                <img
                  src="https://plus.unsplash.com/premium_photo-1681843126728-04eab730febe?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z3JvdXAlMjBvZiUyMGRvY3RvcnN8ZW58MHx8MHx8fDA%3D"
                  alt="Group of doctors"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="w-full md:w-1/2">
              <div className="relative h-64 sm:h-72 md:h-80 lg:h-96 overflow-hidden rounded-xl shadow-xl">
                <Image src={pic1} alt="Our mission" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800">
                Our Mission: Making Quality Healthcare Accessible to Millions
              </h2>
              <p className="text-lg text-slate-700 leading-relaxed">
                We believe in not just more appointments, but better care. And better care means aligning the well-being
                of patients with the expertise of doctors—a healthier, happier future for all!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
            <div className="w-full md:w-1/2">
              <div className="relative h-64 sm:h-72 md:h-80 lg:h-96 overflow-hidden rounded-xl shadow-xl">
                <Image src={pic2} alt="Our story" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800">Our Story</h2>
              <div className="space-y-4 text-lg text-slate-700 leading-relaxed">
                <p>
                  In a world where accessing quality healthcare often feels complicated and time-consuming, we saw the
                  need for a better way. Patients weren't looking for long waits or confusing processes—they wanted
                  seamless, reliable, and hassle-free healthcare.
                </p>
                <p>
                  That's why we created Medilink—a platform designed to connect patients with trusted doctors
                  effortlessly. Guided by our commitment to innovation and accessibility, we're transforming healthcare
                  by making it more convenient, efficient, and patient-friendly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#f0f2fd] to-[#e8ecff]">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-slate-800 mb-12 md:mb-16">
            Medilink By The Numbers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-xl transition-transform hover:scale-105 duration-300 overflow-hidden">
              <div className="p-6 flex flex-col items-center">
                <div className="h-40 w-40 flex items-center justify-center mb-6">
                  <Image src={pic3} alt="Global offices" className="max-h-full max-w-full" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 text-center">15 Global Offices</h3>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow-xl transition-transform hover:scale-105 duration-300 overflow-hidden">
              <div className="p-6 flex flex-col items-center">
                <div className="h-40 w-40 flex items-center justify-center mb-6">
                  <Image src={pic4} alt="Doctors" className="max-h-full max-w-full" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 text-center">20,000+ Doctors</h3>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow-xl transition-transform hover:scale-105 duration-300 overflow-hidden">
              <div className="p-6 flex flex-col items-center">
                <div className="h-40 w-40 flex items-center justify-center mb-6">
                  <Image src={pic5} alt="Customers" className="max-h-full max-w-full" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 text-center">Over 10,000 Customers</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-center">
            <div className="flex items-center w-full max-w-4xl">
              {/* Left Arrow (Desktop) */}
              <button
                className="hidden md:flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors mr-6"
                onClick={prevReview}
                aria-label="Previous testimonial"
              >
                <ArrowLeftCircleIcon size={28} className="text-slate-600" />
              </button>

              {/* Testimonial Card */}
              <div
                className="flex-1 flex flex-col items-center bg-white rounded-xl shadow-xl p-6 md:p-10 relative"
                style={{ borderTop: `6px solid ${testimonials[index].color}` }}
              >
                <div className="absolute -top-12 w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
                  <img
                    src={testimonials[index].img || "/placeholder.svg"}
                    alt={testimonials[index].name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="mt-14 mb-6 text-center">
                  <p className="text-lg md:text-xl text-slate-700 italic">"{testimonials[index].review}"</p>
                </div>

                <div className="w-full pt-6 border-t border-slate-200 text-center">
                  <p className="text-lg font-semibold text-slate-800 uppercase tracking-wide">
                    {testimonials[index].name}
                  </p>
                </div>

                {/* Mobile Navigation */}
                <div className="flex items-center justify-center gap-4 mt-6 md:hidden">
                  <button
                    className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                    onClick={prevReview}
                    aria-label="Previous testimonial"
                  >
                    <ArrowLeftCircleIcon size={24} className="text-slate-600" />
                  </button>
                  <button
                    className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                    onClick={nextReview}
                    aria-label="Next testimonial"
                  >
                    <ArrowRightCircleIcon size={24} className="text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Right Arrow (Desktop) */}
              <button
                className="hidden md:flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors ml-6"
                onClick={nextReview}
                aria-label="Next testimonial"
              >
                <ArrowRightCircleIcon size={28} className="text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Growing Together Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#f0f2fd] to-[#e8ecff]">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-slate-800 mb-12 md:mb-16">
            Growing Better Together
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-xl transition-transform hover:scale-105 duration-300 overflow-hidden">
              <div className="p-6 flex flex-col items-center">
                <div className="h-40 w-40 flex items-center justify-center mb-6">
                  <Image src={pic6} alt="Sustainability" className="max-h-full max-w-full" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 text-center">Sustainability</h3>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow-xl transition-transform hover:scale-105 duration-300 overflow-hidden">
              <div className="p-6 flex flex-col items-center">
                <div className="h-40 w-40 flex items-center justify-center mb-6">
                  <Image src={pic7} alt="Wellness" className="max-h-full max-w-full" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 text-center">Wellness</h3>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow-xl transition-transform hover:scale-105 duration-300 overflow-hidden">
              <div className="p-6 flex flex-col items-center">
                <div className="h-40 w-40 flex items-center justify-center mb-6">
                  <Image src={pic8} alt="Compassionate Care" className="max-h-full max-w-full" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 text-center">Compassionate Care</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="container mx-auto max-w-6xl">
          {/* Social Media */}
          <div className="flex items-center justify-center mb-8">
            <div className="h-px bg-slate-600 flex-1"></div>
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
            <div className="h-px bg-slate-600 flex-1"></div>
          </div>

          {/* Logo */}
          <div className="mb-8 text-center">
            <Link href="/" className={`text-2xl md:text-3xl text-slate-100 ${fugaz.className}`}>
              Medilink
            </Link>
          </div>

          {/* Copyright */}
          <div className="flex items-center justify-center text-slate-400 text-sm mb-6">
            <span>Copyright</span>
            <CopyrightIcon size={14} className="mx-1" />
            <span>2025 Medilink, Inc</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-slate-300">
            <a href="#" className="hover:text-white transition-colors">
              Legal Terms
            </a>
            <span className="hidden sm:inline text-slate-500">|</span>
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <span className="hidden sm:inline text-slate-500">|</span>
            <a href="#" className="hover:text-white transition-colors">
              Security
            </a>
            <span className="hidden sm:inline text-slate-500">|</span>
            <a href="#" className="hover:text-white transition-colors">
              Website Accessibility
            </a>
            <span className="hidden sm:inline text-slate-500">|</span>
            <a href="#" className="hover:text-white transition-colors">
              Manage Cookies
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

