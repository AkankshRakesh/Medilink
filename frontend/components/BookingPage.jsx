"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  Calendar,
  Mail,
  PhoneCall,
  Smartphone,
  Star,
  Clock,
  User,
  ChevronUp,
  ChevronDown,
  MapPin,
  Shield,
  Clock3,
  CalendarSearch,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { createRazorpayOrder, processPayment } from "@/lib/razorpay"
import { toast } from "react-toastify"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "./LoadingSpinner"
import { Separator } from "@/components/ui/separator"

const category = [
  "General Physician",
  "Dermatology",
  "Obstetrics & Gynaecology",
  "Orthopaedics",
  "ENT",
  "Neurology",
  "Cardiology",
  "Urology",
  "Gastroenterology/GI medicine",
  "Psychiatry",
  "Paediatrics",
  "Pulmonology/Respiratory",
  "Endocrinology",
  "Nephrology",
  "Neurosurgery",
  "Rheumatology",
  "Ophthalmology",
  "Surgical Gastroenterology",
  "Infectious Disease",
  "General & Laparoscopic Surgery",
  "Psychology",
  "Medical Oncology",
  "Diabetology",
  "Dentist",
]

function BookingPage() {
  const searchParams = useSearchParams()
  const [dates, setDates] = useState([])
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [availableTimes, setAvailableTimes] = useState([])
  const [doctorDetails, setDoctorDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingTimes, setLoadingTimes] = useState(false)
  const [loadingDoctors, setLoadingDoctors] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [topDoctors, setTopDoctors] = useState([])
  const [firstDoctorChoice, setFirstDoctorChoice] = useState(null)
  const [secondDoctorChoice, setSecondDoctorChoice] = useState(null)
  const [thirdDoctorChoice, setThirdDoctorChoice] = useState(null)
  const [selectedSpecialty, setSelectedSpecialty] = useState(null)
  const [noDoctorsAvailable, setNoDoctorsAvailable] = useState(false)
  const [showMoreDoctors, setShowMoreDoctors] = useState(false)
  const [visibleCategories, setVisibleCategories] = useState(8)
  const [showAllCategories, setShowAllCategories] = useState(false)

  const id = searchParams.get("id")
  let first = true
  const second = true
  const third = true

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (!id) return

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/doctorData/saveDoctor.php?id=${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        setDoctorDetails(data)
        setSelectedSpecialty(data.specialization)
        if (first) {
          setFirstDoctorChoice(data)
          first = false
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctorDetails()
  }, [id])

  useEffect(() => {
    const fetchTopDoctors = async () => {
      if (!doctorDetails?.specialization) return

      try {
        setLoadingDoctors(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/doctorData/getTopDoctor.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ specialization: doctorDetails.specialization }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        setSecondDoctorChoice(data[0])
        setThirdDoctorChoice(data[1])
        if (!noDoctorsAvailable) setTopDoctors(data.filter((doctor) => doctor.id !== doctorDetails.id).slice(0, 2))
      } catch (error) {
        console.error("Error fetching top doctors:", error)
      } finally {
        setLoadingDoctors(false)
      }
    }

    fetchTopDoctors()
  }, [doctorDetails])

  const handleDoctorSelect = (selectedDoctor) => {
    setTopDoctors((prevTopDoctors) => prevTopDoctors.map((doc) => (doc.id === selectedDoctor.id ? doctorDetails : doc)))
    setDoctorDetails(selectedDoctor)
    setSelectedTime("")
  }

  const fetchTopDoctorsBySpecialty = async (specialty) => {
    try {
      setLoadingDoctors(true)
      setNoDoctorsAvailable(false)

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/doctorData/getTopDoctor.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specialization: specialty }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()

      if (data.length === 0) {
        setNoDoctorsAvailable(true)
        setFirstDoctorChoice(null)
        setSecondDoctorChoice(null)
        setThirdDoctorChoice(null)
        setDoctorDetails(null)
        return
      }

      setFirstDoctorChoice(data[0])
      setDoctorDetails(data[0])

      if (data.length > 1) {
        setSecondDoctorChoice(data[1])
      } else {
        setSecondDoctorChoice(null)
      }

      if (data.length > 2) {
        setThirdDoctorChoice(data[2])
      } else {
        setThirdDoctorChoice(null)
      }

      if (Array.isArray(data)) setTopDoctors(data.slice(0, 2))
    } catch (error) {
      console.error("Error fetching top doctors:", error)
      setNoDoctorsAvailable(true)
    } finally {
      setLoadingDoctors(false)
    }
  }

  const handleSpecialtyClick = async (specialty) => {
    setSelectedSpecialty(specialty)
    await fetchTopDoctorsBySpecialty(specialty)
  }

  useEffect(() => {
    if (doctorDetails) {
      const today = new Date()
      const upcomingDates = Array.from({ length: 5 }, (_, i) => {
        const date = new Date()
        date.setDate(today.getDate() + i)
        return {
          day: date.toLocaleDateString("en-US", { weekday: "short" }),
          date: date.getDate(),
          month: date.toLocaleDateString("en-US", { month: "short" }),
          fullDate: date.toISOString().split("T")[0],
        }
      })
      setDates(upcomingDates)
      setSelectedDate(upcomingDates[0].fullDate)
    }
  }, [doctorDetails])

  useEffect(() => {
    if (selectedDate && doctorDetails) {
      fetchAvailableTimes(selectedDate)
    }
  }, [selectedDate, doctorDetails])

  const fetchAvailableTimes = async (date) => {
    try {
      setLoadingTimes(true)
      const { availabilityStart, availabilityEnd } = doctorDetails

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/bookings/getBookedTime.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: doctorDetails.userId, type: 1 }),
      })

      const bookedSlots = await response.json()

      const normalizeTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(":")
        return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`
      }

      const bookedTimesForDate = bookedSlots
        .filter((slot) => {
          return slot.date === date
        })
        .map((slot) => {
          const normalizedTime = normalizeTime(slot.time)
          return normalizedTime
        })

      const allSlots = generateTimeSlots(availabilityStart, availabilityEnd)

      const timeSlots = allSlots.map((time) => {
        const isBooked = bookedTimesForDate.includes(time)
        return {
          time,
          booked: isBooked,
        }
      })

      setAvailableTimes(timeSlots)
    } catch (error) {
      console.error("Error:", error)
      setAvailableTimes([])
    } finally {
      setLoadingTimes(false)
    }
  }

  const generateTimeSlots = (startTime, endTime) => {
    const slots = []

    const parseTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(":").map(Number)
      return hours * 60 + minutes
    }

    const formatTime = (minutes) => {
      const hrs = Math.floor(minutes / 60)
      const mins = minutes % 60
      return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}`
    }

    let current = parseTime(startTime)
    const end = parseTime(endTime)

    while (current <= end) {
      slots.push(formatTime(current))
      current += 30
    }

    return slots
  }

  const bookAppointment = async () => {
    if (localStorage.getItem("userId") == null) {
      toast.info("Please sign in to continue with your booking")
      return
    }
    if (doctorDetails.userId == localStorage.getItem("userId")) {
      toast.error("You cannot book an appointment with yourself as a doctor")
      return
    }

    try {
      setProcessingPayment(true)
      const payload = {
        doctor_id: doctorDetails.userId,
        patient_id: localStorage.getItem("userId"),
        amount: doctorDetails.fee,
        meeting_date: selectedDate,
        meeting_time: selectedTime,
      }

      const order = await createRazorpayOrder(payload)
      if (!order) {
        toast.error("Unable to create your booking. Please try again later.")
        return
      }

      const paymentResponse = await processPayment(order)
      console.log(paymentResponse, order.order_id)

      await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/bookings/updateOrder.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: order.order_id,
          payment_id: paymentResponse.paymentId,
        }),
      })

      if (paymentResponse.success) {
        const meetLink = await createGoogleMeet(selectedDate, selectedTime)

        if (!meetLink) {
          toast.warning(
            "Your appointment has been booked, but we couldn't create a meeting link. Our team will contact you with meeting details.",
          )
        }
        console.log(meetLink)
        const bookingResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/bookTime.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            doctorId: doctorDetails.userId,
            doctorName: doctorDetails.name,
            patientId: localStorage.getItem("userId"),
            date: selectedDate,
            time: selectedTime,
            paymentId: paymentResponse.paymentId,
            meetLink: meetLink || null,
          }),
        })

        if (!bookingResponse.ok) {
          throw new Error("Failed to save booking")
        }

        toast.success("Appointment booked successfully! Meeting details will be sent to your email shortly.", {
          autoClose: 3500,
          onClose: () => window.location.reload(),
        })
      }
    } catch (error) {
      if (error.message === "Payment window closed by user") {
        toast.info("Payment cancelled. You can try booking again when you're ready.")
      } else if (error.message.includes("declined by the bank")) {
        toast.error("Your payment was declined. Please try another payment method or contact your bank for assistance.")
      } else {
        console.error("Error booking appointment:", error)
        toast.error(
          "We encountered an issue while processing your appointment. Please try again or contact support if the problem persists.",
        )
      }
    } finally {
      setProcessingPayment(false)
    }
  }

  const generateGoogleMeetLink = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
    let meetCode = ""

    for (let i = 0; i < 10; i++) {
      meetCode += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return `https://meet.google.com/${meetCode}`
  }

  const createGoogleMeet = async (date, time) => {
    try {
      const meetLink = generateGoogleMeetLink()

      if (!meetLink.startsWith("https://meet.google.com/") || meetLink.length < 30) {
        throw new Error("Invalid Meet link generated")
      }

      return meetLink
    } catch (error) {
      console.error("Meet creation error:", error)
      return null
    }
  }

  const groupTimeSlots = (slots) => {
    const getHour = (timeStr) => {
      return Number.parseInt(timeStr.split(":")[0], 10) // handles "19:00:00.000000"
    }

    const morning = slots.filter((slot) => {
      const hour = getHour(slot.time)
      return hour >= 0 && hour < 12
    })

    const afternoon = slots.filter((slot) => {
      const hour = getHour(slot.time)
      return hour >= 12 && hour < 17
    })

    const evening = slots.filter((slot) => {
      const hour = getHour(slot.time)
      return hour >= 17 && hour < 24
    })

    return { morning, afternoon, evening }
  }

  const formatTimeDisplay = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }

  const groupedTimeSlots = groupTimeSlots(availableTimes)

  const displayedCategories = showAllCategories ? category : category.slice(0, visibleCategories)

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen pt-6">
        <div className="container mx-auto py-6 px-4 md:px-6">
          <div className="flex items-center mb-8">
            <div className="h-10 w-10 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mr-3">
              <Calendar className="h-5 w-5 text-primary dark:text-gray-300" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold dark:text-white">Book Your Appointment</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="overflow-hidden border-none shadow-md dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent dark:from-primary/10 dark:to-primary/5">
                  <div className="h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden border-none shadow-md dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent dark:from-primary/10 dark:to-primary/5">
                  <div className="h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <Card className="sticky top-6 overflow-hidden border-none shadow-md dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse mb-4"></div>
                    <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-2"></div>
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-2"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen pt-6">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex items-center mb-8">
          <div className="h-10 w-10 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mr-3">
            <Calendar className="h-5 w-5 text-primary dark:text-primary-foreground" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold dark:text-white">Book Your Appointment</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Category selection */}
            <Card className="overflow-hidden border-none shadow-md dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent dark:from-primary/10 dark:to-primary/5">
                <CardTitle className="flex items-center dark:text-white">
                  <MapPin className="h-5 w-5 mr-2 text-primary dark:text-gray-300" />
                  Medical Specialties
                </CardTitle>
                <CardDescription className="dark:text-gray-300">Select a specialty to find the right doctor for your needs</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2">
                  {displayedCategories.map((cat) => (
                    <Badge
                      key={cat}
                      variant="outline"
                      className={`px-3 py-1.5 cursor-pointer transition-all ${
                        selectedSpecialty === cat
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary/25 dark:text-white dark:hover:bg-primary/10"
                          : "hover:bg-primary/10 dark:hover:bg-primary/20"
                      }`}
                      onClick={() => handleSpecialtyClick(cat)}
                    >
                      {cat}
                    </Badge>
                  ))}
                  {category.length > visibleCategories && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary/80 hover:bg-primary/5 dark:text-gray-300 dark:hover:bg-primary/20"
                      onClick={() => setShowAllCategories(!showAllCategories)}
                    >
                      {showAllCategories ? "Show less" : `+${category.length - visibleCategories} more`}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-md dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent dark:from-primary/10 dark:to-primary/5">
                <CardTitle className="flex items-center dark:text-white">
                  <User className="h-5 w-5 mr-2 text-primary dark:text-gray-300" />
                  Available Doctors
                </CardTitle>
                <CardDescription className="dark:text-gray-300">
                  {selectedSpecialty
                    ? `Showing doctors specializing in ${selectedSpecialty}`
                    : "Select a doctor for your appointment"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {loadingDoctors ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-muted-foreground dark:text-gray-400">Finding the best doctors for you...</p>
                  </div>
                ) : !doctorDetails ? (
                  <div className="text-center py-8">
                    <div className="mb-6 mx-auto w-20 h-20 rounded-full bg-primary/5 dark:bg-primary/10 flex items-center justify-center">
                      <User className="h-10 w-10 text-primary/60 dark:text-primary-foreground/60" />
                    </div>
                    <p className="text-lg font-medium mb-2 dark:text-white">No doctors available</p>
                    <p className="text-muted-foreground dark:text-gray-400 mb-6 max-w-md mx-auto">
                      {selectedSpecialty
                        ? `We couldn't find any doctors for ${selectedSpecialty} at the moment`
                        : "Please select a specialty to see available doctors"}
                    </p>
                    <Link href="/doctors">
                      <Button className="bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 dark:text-white">
                        Browse all doctors
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* First Doctor (Always shown) */}
                    {firstDoctorChoice && (
                      <div
                        className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                          doctorDetails?.id === firstDoctorChoice.id
                            ? "border-2 border-primary bg-primary/5 dark:bg-primary/10"
                            : "border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md cursor-pointer dark:bg-gray-700"
                        }`}
                        onClick={() => handleDoctorSelect(firstDoctorChoice)}
                      >
                        <Avatar className="h-16 w-16 border-2 border-primary/10 dark:border-primary/20">
                          <AvatarImage
                            src={firstDoctorChoice.picture || "/placeholder.svg"}
                            alt={firstDoctorChoice.name}
                          />
                          <AvatarFallback className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground font-bold">
                            {firstDoctorChoice.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .substring(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-lg text-foreground dark:text-white">{firstDoctorChoice.name}</p>
                          </div>
                          <p className="text-sm text-muted-foreground dark:text-gray-400">{firstDoctorChoice.specialization}</p>
                          <div className="flex items-center mt-1.5">
                            {firstDoctorChoice.rating != 0 ? (
                              <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full">
                                <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 mr-1" />
                                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">{firstDoctorChoice.rating}</span>
                              </div>
                            ) : (
                              <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                                Newly joined
                              </span>
                            )}
                            <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                            <span className="text-sm text-muted-foreground dark:text-gray-400">₹{firstDoctorChoice.fee}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional Doctors (Shown when expanded) */}
                    {showMoreDoctors && (
                      <>
                        {secondDoctorChoice && secondDoctorChoice.id !== firstDoctorChoice?.id && (
                          <div
                            className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                              doctorDetails?.id === secondDoctorChoice.id
                                ? "border-2 border-primary bg-primary/5 dark:bg-primary/10"
                                : "border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md cursor-pointer dark:bg-gray-700"
                            }`}
                            onClick={() => handleDoctorSelect(secondDoctorChoice)}
                          >
                            <Avatar className="h-16 w-16 border-2 border-primary/10 dark:border-primary/20">
                              <AvatarImage
                                src={secondDoctorChoice.picture || "/placeholder.svg"}
                                alt={secondDoctorChoice.name}
                              />
                              <AvatarFallback className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground font-bold">
                                {secondDoctorChoice.name
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-semibold text-lg text-foreground dark:text-white">{secondDoctorChoice.name}</p>
                              </div>
                              <p className="text-sm text-muted-foreground dark:text-gray-400">{secondDoctorChoice.specialization}</p>
                              <div className="flex items-center mt-1.5">
                                {secondDoctorChoice.rating != 0 ? (
                                  <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full">
                                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 mr-1" />
                                    <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                                      {secondDoctorChoice.rating}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                                    Newly joined
                                  </span>
                                )}
                                <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                                <span className="text-sm text-muted-foreground dark:text-gray-400">₹{secondDoctorChoice.fee}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {thirdDoctorChoice &&
                          thirdDoctorChoice.id !== firstDoctorChoice?.id &&
                          thirdDoctorChoice.id !== secondDoctorChoice?.id && (
                            <div
                              className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                                doctorDetails?.id === thirdDoctorChoice.id
                                  ? "border-2 border-primary bg-primary/5 dark:bg-primary/10"
                                  : "border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md cursor-pointer dark:bg-gray-700"
                              }`}
                              onClick={() => handleDoctorSelect(thirdDoctorChoice)}
                            >
                              <Avatar className="h-16 w-16 border-2 border-primary/10 dark:border-primary/20">
                                <AvatarImage
                                  src={thirdDoctorChoice.picture || "/placeholder.svg"}
                                  alt={thirdDoctorChoice.name}
                                />
                                <AvatarFallback className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground font-bold">
                                  {thirdDoctorChoice.name
                                    ?.split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .substring(0, 2)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-semibold text-lg text-foreground dark:text-white">{thirdDoctorChoice.name}</p>
                                </div>
                                <p className="text-sm text-muted-foreground dark:text-gray-400">{thirdDoctorChoice.specialization}</p>
                                <div className="flex items-center mt-1.5">
                                  {thirdDoctorChoice.rating != 0 ? (
                                    <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full">
                                      <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 mr-1" />
                                      <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                                        {thirdDoctorChoice.rating}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                                      Newly joined
                                    </span>
                                  )}
                                  <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                                  <span className="text-sm text-muted-foreground dark:text-gray-400">₹{thirdDoctorChoice.fee}</span>
                                </div>
                              </div>
                            </div>
                          )}
                      </>
                    )}

                    {/* Show More/Show Less Button */}
                    {(secondDoctorChoice || thirdDoctorChoice) && (
                      <div className="flex justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary/80 hover:bg-primary/5 dark:text-gray-300 dark:hover:bg-primary/20"
                          onClick={() => setShowMoreDoctors(!showMoreDoctors)}
                        >
                          {showMoreDoctors ? (
                            <div className="flex items-center">
                              <ChevronUp className="h-4 w-4 mr-1" />
                              Show less
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <ChevronDown className="h-4 w-4 mr-1" />
                              Show more doctors
                            </div>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {!doctorDetails ? (
              <></>
            ) : (
              <Card className="overflow-hidden border-none shadow-md dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent dark:from-primary/10 dark:to-primary/5">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center dark:text-white">
                        <CalendarSearch className="h-5 w-5 mr-2 text-primary dark:text-gray-300" />
                        Choose Date & Time
                      </CardTitle>
                      <CardDescription className="hidden md:block dark:text-gray-300">
                        Select when you'd like to meet with {doctorDetails.name}
                      </CardDescription>
                    </div>
                    <div className="hidden md:flex items-center text-sm bg-primary/5 dark:bg-primary/10 px-3 py-1 rounded-full">
                      <Calendar className="h-4 w-4 mr-1.5 text-primary dark:text-gray-300" />
                      <span className="font-medium dark:text-white">{selectedDate}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Date selection */}
                  <div className="flex justify-between items-center overflow-x-auto pb-2">
                    {dates.map(({ day, date, month, fullDate }, index) => (
                      <React.Fragment key={fullDate}>
                        <button
                          onClick={() => setSelectedDate(fullDate)}
                          className={`min-w-[4.5rem] h-20 flex flex-col items-center justify-center rounded-xl transition-all ${
                            fullDate === selectedDate
                              ? "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary/25 dark:text-white dark:hover:bg-primary/10"
                              : "bg-background border border-input hover:bg-accent hover:text-accent-foreground dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
                          }`}
                        >
                          <span className="text-sm font-medium">{day}</span>
                          <span className="text-xl font-bold my-1">{date}</span>
                          <span className="text-xs opacity-80">{month}</span>
                        </button>

                        {/* Add separator between dates except after last */}
                        {index < dates.length - 1 && <div className="h-px w-4 bg-gray-400 dark:bg-gray-600 mx-1 flex-shrink-0" />}
                      </React.Fragment>
                    ))}
                  </div>

                  <div>
                    <div className="flex items-center mb-4">
                      <Clock3 className="h-4 w-4 mr-2 text-primary dark:text-gray-300" />
                      <h3 className="text-sm font-medium dark:text-white">Available Time Slots</h3>
                    </div>

                    {loadingTimes ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <LoadingSpinner size="md" />
                        <p className="mt-3 text-sm text-muted-foreground dark:text-gray-400">Loading available times...</p>
                      </div>
                    ) : (
                      <Tabs defaultValue="morning" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-4 bg-gray-100 dark:bg-gray-700">
                          <TabsTrigger
                            value="morning"
                            className="data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-300"
                          >
                            Morning
                          </TabsTrigger>
                          <TabsTrigger
                            value="afternoon"
                            className="data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-300"
                          >
                            Afternoon
                          </TabsTrigger>
                          <TabsTrigger
                            value="evening"
                            className="data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-300"
                          >
                            Evening
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="morning" className="mt-0">
                          {groupedTimeSlots.morning.length > 0 ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                              {groupedTimeSlots.morning.map((slot, index) => {
                                const now = new Date()
                                const isToday = selectedDate === now.toISOString().split("T")[0]
                                const [hours, minutes] = slot.time.split(":").map(Number)
                                const slotTime = new Date()
                                slotTime.setHours(hours, minutes, 0, 0)
                                const isPastTime = isToday && slotTime < now
                                const formattedTime = formatTimeDisplay(slot.time)

                                return (
                                  <button
                                    key={`${slot.time}-${index}`}
                                    onClick={() => !slot.booked && !isPastTime && setSelectedTime(slot.time)}
                                    className={`p-2 text-sm rounded-md border transition-all relative ${
                                      slot.time === selectedTime
                                        ? "bg-primary/10 border-primary text-primary font-medium shadow-sm dark:bg-primary/20 dark:border-primary/50 dark:text-primary-foreground"
                                        : slot.booked || isPastTime
                                          ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-500"
                                          : "border-input text-foreground hover:bg-accent hover:border-primary/30 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-primary/50"
                                    }`}
                                    disabled={slot.booked || isPastTime}
                                  >
                                    {formattedTime}
                                    {slot.booked && (
                                      <>
                                        <span className="absolute hidden md:block -top-1 -right-1 bg-red-100 text-red-800 text-xs px-1 rounded-full dark:bg-red-900/30 dark:text-red-400">
                                          Booked
                                        </span>
                                        <span className="absolute md:hidden -top-1 -right-1 bg-red-100 text-red-800 text-xs px-1 rounded-full dark:bg-red-900/30 dark:text-red-400">
                                          ✓
                                        </span>
                                      </>
                                    )}
                                  </button>
                                )
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg dark:bg-gray-700">
                              <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-40 dark:text-gray-400" />
                              <p className="text-muted-foreground dark:text-gray-400">No morning slots available</p>
                            </div>
                          )}
                        </TabsContent>
                        <TabsContent value="afternoon" className="mt-0">
                          {groupedTimeSlots.afternoon.length > 0 ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                              {groupedTimeSlots.afternoon.map((slot, index) => {
                                const now = new Date()
                                const isToday = selectedDate === now.toISOString().split("T")[0]
                                const [hours, minutes] = slot.time.split(":").map(Number)
                                const slotTime = new Date()
                                slotTime.setHours(hours, minutes, 0, 0)
                                const isPastTime = isToday && slotTime < now
                                const formattedTime = formatTimeDisplay(slot.time)

                                return (
                                  <button
                                    key={`${slot.time}-${index}`}
                                    onClick={() => !slot.booked && !isPastTime && setSelectedTime(slot.time)}
                                    className={`p-2 text-sm rounded-md border transition-all relative ${
                                      slot.time === selectedTime
                                        ? "bg-primary/10 border-primary text-primary font-medium shadow-sm dark:bg-primary/20 dark:border-primary/50 dark:text-primary-foreground"
                                        : slot.booked || isPastTime
                                          ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-500"
                                          : "border-input text-foreground hover:bg-accent hover:border-primary/30 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-primary/50"
                                    }`}
                                    disabled={slot.booked || isPastTime}
                                  >
                                    {formattedTime}
                                    {slot.booked && (
                                      <>
                                        <span className="absolute hidden md:block -top-1 -right-1 bg-red-100 text-red-800 text-xs px-1 rounded-full dark:bg-red-900/30 dark:text-red-400">
                                          Booked
                                        </span>
                                        <span className="absolute md:hidden -top-1 -right-1 bg-red-100 text-red-800 text-xs px-1 rounded-full dark:bg-red-900/30 dark:text-red-400">
                                          ✓
                                        </span>
                                      </>
                                    )}
                                  </button>
                                )
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg dark:bg-gray-700">
                              <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-40 dark:text-gray-400" />
                              <p className="text-muted-foreground dark:text-gray-400">No afternoon slots available</p>
                            </div>
                          )}
                        </TabsContent>
                        <TabsContent value="evening" className="mt-0">
                          {groupedTimeSlots.evening.length > 0 ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                              {groupedTimeSlots.evening.map((slot, index) => {
                                const now = new Date()
                                const isToday = selectedDate === now.toISOString().split("T")[0]
                                const [hours, minutes] = slot.time.split(":").map(Number)
                                const slotTime = new Date()
                                slotTime.setHours(hours, minutes, 0, 0)
                                const isPastTime = isToday && slotTime < now
                                const formattedTime = formatTimeDisplay(slot.time)

                                return (
                                  <button
                                    key={`${slot.time}-${index}`}
                                    onClick={() => !slot.booked && !isPastTime && setSelectedTime(slot.time)}
                                    className={`p-2 text-sm rounded-md border transition-all relative ${
                                      slot.time === selectedTime
                                        ? "bg-primary/10 border-primary text-primary font-medium shadow-sm dark:bg-primary/20 dark:border-primary/50 dark:text-primary-foreground"
                                        : slot.booked || isPastTime
                                          ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-500"
                                          : "border-input text-foreground hover:bg-accent hover:border-primary/30 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-primary/50"
                                    }`}
                                    disabled={slot.booked || isPastTime}
                                  >
                                    {formattedTime}
                                    {slot.booked && (
                                      <>
                                        <span className="absolute hidden md:block -top-1 -right-1 bg-red-100 text-red-800 text-xs px-1 rounded-full dark:bg-red-900/30 dark:text-red-400">
                                          Booked
                                        </span>
                                        <span className="absolute md:hidden -top-1 -right-1 bg-red-100 text-red-800 text-xs px-1 rounded-full dark:bg-red-900/30 dark:text-red-400">
                                          ✓
                                        </span>
                                      </>
                                    )}
                                  </button>
                                )
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg dark:bg-gray-700">
                              <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-40 dark:text-gray-400" />
                              <p className="text-muted-foreground dark:text-gray-400">No evening slots available</p>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    )}
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200 rounded-xl p-5 mt-6 dark:from-amber-900/30 dark:to-amber-800/30 dark:border-amber-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center mb-1">
                          <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400 mr-1.5" />
                          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Appointment Summary</p>
                        </div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {selectedDate
                            ? new Date(selectedDate).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "Select a date"}{" "}
                          {selectedTime ? `at ${formatTimeDisplay(selectedTime)}` : ""}
                        </p>
                      </div>
                      <Button
                        onClick={bookAppointment}
                        disabled={!selectedTime || processingPayment}
                        className="bg-green-600 hover:bg-green-700 text-white shadow-sm dark:bg-green-700 dark:hover:bg-green-800"
                      >
                        {processingPayment ? (
                          <div className="flex items-center">
                            <LoadingSpinner size="sm" />
                            <span className="ml-2">Processing...</span>
                          </div>
                        ) : (
                          `Pay ₹${doctorDetails ? doctorDetails.fee : "0"}`
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Doctor profile section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 overflow-hidden border-none shadow-md dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className={`flex flex-col items-center ${!doctorDetails ? "" : "mb-6"}`}>
                  {doctorDetails ? (
                    <>
                      <div className="relative mb-4">
                        <Avatar className="h-28 w-28 border-4 border-primary/10 dark:border-primary/20">
                          <AvatarImage src={doctorDetails.picture || "/placeholder.svg"} alt={doctorDetails.name} />
                          <AvatarFallback className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground text-2xl font-bold">
                            {doctorDetails.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {doctorDetails.rating != 0 && (
                          <div className="absolute -bottom-2 -right-2 bg-white rounded-full shadow-md px-2 py-1 flex items-center dark:bg-gray-800">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                            <span className="text-sm font-medium dark:text-yellow-400">{doctorDetails.rating}</span>
                          </div>
                        )}
                      </div>
                      <h2 className="text-xl font-bold text-center dark:text-white">{doctorDetails.name}</h2>
                      <p className="text-muted-foreground mb-1 dark:text-gray-400">{doctorDetails.specialization}</p>

                      <Badge variant="outline" className="bg-primary/5 text-primary mb-4 dark:bg-primary/20 dark:text-primary-foreground">
                        ₹{doctorDetails.fee} per consultation
                      </Badge>

                      <div className="flex gap-3 mb-6">
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-full h-10 w-10 bg-primary/5 border-primary/10 hover:bg-primary/10 dark:bg-primary/10 dark:border-primary/20 dark:hover:bg-primary/20"
                        >
                          <Mail className="h-4 w-4 text-primary dark:text-primary-foreground" />
                          <span className="sr-only">Email</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-full h-10 w-10 bg-primary/5 border-primary/10 hover:bg-primary/10 dark:bg-primary/10 dark:border-primary/20 dark:hover:bg-primary/20"
                        >
                          <PhoneCall className="h-4 w-4 text-primary dark:text-primary-foreground" />
                          <span className="sr-only">Call</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-full h-10 w-10 bg-primary/5 border-primary/10 hover:bg-primary/10 dark:bg-primary/10 dark:border-primary/20 dark:hover:bg-primary/20"
                        >
                          <Smartphone className="h-4 w-4 text-primary dark:text-primary-foreground" />
                          <span className="sr-only">Message</span>
                        </Button>
                      </div>

                      <Separator className="my-4 dark:bg-gray-700" />

                      <div className="w-full">
                        <h3 className="text-lg font-semibold mb-3 dark:text-white">About Doctor</h3>
                        <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg leading-relaxed dark:bg-gray-700 dark:text-gray-300">
                          {doctorDetails.biography || "No biography available for this doctor."}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 space-y-4">
                      <div className="mx-auto w-24 h-24 rounded-full bg-primary/5 dark:bg-primary/10 flex items-center justify-center">
                        <User className="h-12 w-12 text-primary/60 dark:text-primary-foreground/60" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2 dark:text-white">Doctor Profile</h3>
                        <p className="text-sm text-muted-foreground mb-6 dark:text-gray-400">
                          Select a doctor to view their complete profile and availability
                        </p>
                      </div>
                      <Link href="/doctors">
                        <Button variant="outline" className="w-full dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
                          Browse all doctors
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPage