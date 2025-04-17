"use client"

import { useState } from "react"
import { Fugaz_One } from "next/font/google"
import { toast } from "react-toastify"
import { Loader2 } from "lucide-react"

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ["400"] })

import pic from "../public/contactus.jpg"
import Image from "next/image"

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/contactForm.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("Your message has been sent successfully!")
        setFormData({ name: "", email: "", message: "" })
      } else {
        toast.error("Failed to send message. Please try again.")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="w-full py-10 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center">
          {/* Left Column - Contact Form */}
          <div className="order-2 lg:order-1">
            <div className="max-w-2xl mx-auto lg:mx-0">
              <div className="mb-5">
                <h1 className={`${fugaz.className} text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4`}>
                  Get in Touch
                </h1>
                <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-lg">
                  Have questions or want to discuss a project? Fill out the form and we'll get back to you within 24 hours.
                </p>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                      errors.name ? "border-red-500 dark:bg-red-900/20" : "border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-primary"
                    } focus:outline-none focus:ring-2 transition-colors duration-200`}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-red-500 text-sm mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                      errors.email ? "border-red-500 dark:bg-red-900/20" : "border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-primary"
                    } focus:outline-none focus:ring-2 transition-colors duration-200`}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-red-500 text-sm mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project or inquiry..."
                    rows={6}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                      errors.message ? "border-red-500 dark:bg-red-900/20" : "border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-primary"
                    } focus:outline-none focus:ring-2 transition-colors duration-200 resize-none`}
                  />
                  {errors.message && (
                    <p id="message-error" className="text-red-500 text-sm mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-4 rounded-lg bg-primary dark:bg-gray-800 text-white font-medium hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 transition-all duration-300 disabled:opacity-70 flex items-center justify-center shadow-lg hover:shadow-primary/30"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="order-1 lg:order-2 h-full flex items-center">
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 transform lg:-translate-x-10 xl:-translate-x-16 hover:shadow-2xl transition-shadow duration-300">
              <Image
                src={pic || "/placeholder.svg"}
                alt="Contact us illustration"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
                <div className="text-white">
                  <h3 className="text-xl md:text-3xl font-bold mb-2">We're Here to Help</h3>
                  <p className="text-md md:text-lg opacity-90 max-w-md">
                    Our team is ready to assist you with any questions about our services or your healthcare needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
