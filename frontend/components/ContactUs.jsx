"use client"

import { useState } from "react"
import { Fugaz_One } from "next/font/google"
import { toast } from "react-toastify"
import { Loader2 } from "lucide-react"

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ["400"] })

import pic from "../public/contactus.jpg"
import Image from "next/image"

import Spline from '@splinetool/react-spline';

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

    // Clear error when user types
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
    <section className="container mx-auto py-12 px-4 md:px-6 min-h-[80vh] flex items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
        <div className="order-2 lg:order-1 flex flex-col justify-center">
          <div className="max-w-xl mx-auto lg:mx-0">
            <h1 className={`${fugaz.className} text-3xl md:text-4xl font-bold text-primary mb-2`}>Just Say Hello!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Let us know more about you! We'd love to hear from you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block font-medium text-primary">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={`w-full p-3 rounded-lg border ${
                    errors.name ? "border-red-500 bg-red-50" : "border-primary/20 bg-primary/5"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors`}
                />
                {errors.name && (
                  <p id="name-error" className="text-red-500 text-sm mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block font-medium text-primary">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`w-full p-3 rounded-lg border ${
                    errors.email ? "border-red-500 bg-red-50" : "border-primary/20 bg-primary/5"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors`}
                />
                {errors.email && (
                  <p id="email-error" className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block font-medium text-primary">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message here..."
                  rows={5}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className={`w-full p-3 rounded-lg border ${
                    errors.message ? "border-red-500 bg-red-50" : "border-primary/20 bg-primary/5"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-y`}
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
                className="w-full md:w-auto px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-all duration-300 disabled:opacity-70 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="order-1 md:order-2 flex justify-center h-full">
          <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] rounded-lg overflow-hidden shadow-xl">
          <Image
              src={pic || "/placeholder.svg"}
              alt="Contact us illustration"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}

