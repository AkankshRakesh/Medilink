"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Calendar, Mail, PhoneCall, Smartphone, Star, Clock, User, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { createRazorpayOrder, processPayment } from "@/lib/razorpay"
import { toast } from "react-toastify"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "./LoadingSpinner"

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
            "Your appointment has been booked, but we couldn't create a meeting link. Our team will contact you with meeting details."
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
        toast.error(
          "Your payment was declined. Please try another payment method or contact your bank for assistance."
        )
      } else {
        console.error("Error booking appointment:", error)
        toast.error(
          "We encountered an issue while processing your appointment. Please try again or contact support if the problem persists."
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
      return parseInt(timeStr.split(":")[0], 10); // handles "19:00:00.000000"
    };
  
    const morning = slots.filter(slot => {
      const hour = getHour(slot.time);
      return hour >= 0 && hour < 12;
    });
  
    const afternoon = slots.filter(slot => {
      const hour = getHour(slot.time);
      return hour >= 12 && hour < 17;
    });
  
    const evening = slots.filter(slot => {
      const hour = getHour(slot.time);
      return hour >= 17 && hour < 24;
    });
  
    return { morning, afternoon, evening };
  };
  

  const groupedTimeSlots = groupTimeSlots(availableTimes)
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen mt-6">
        <div className="container mx-auto py-6 px-4 md:px-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Book Your Appointment</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="h-7 w-48 bg-gray-200 rounded-md animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-8 w-24 bg-gray-200 rounded-md animate-pulse"></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <div className="h-7 w-48 bg-gray-200 rounded-md animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="h-24 w-24 rounded-full bg-gray-200 animate-pulse mb-4"></div>
                    <div className="h-6 w-48 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse mb-2"></div>
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
    <div className="bg-gray-50 min-h-screen mt-6">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Book Your Appointment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Category selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Choosen Specialty</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {category.map((cat) => (
                    <Badge
                      key={cat}
                      variant={doctorDetails?.specialization === cat ? "outline" : "outline"}
                      className={`px-3 py-1 cursor-pointer  transition-colors ${
                        doctorDetails?.specialization === cat || selectedSpecialty === cat
                          ? "bg-primary text-primary-foreground hover:bg-primary/75"
                          : "hover:bg-primary/10"
                      }`}
                      onClick={() => handleSpecialtyClick(cat)}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Select your doctor</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingDoctors ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-muted-foreground">Loading doctors...</p>
                  </div>
                ) : !doctorDetails ? (
                  <div className="text-center py-8">
                    <div className="mb-6 mx-auto w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                      <Calendar className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-medium mb-2">No doctors available</p>
                    <p className="text-muted-foreground mb-6">
                      {selectedSpecialty
                        ? `We couldn't find any doctors for ${selectedSpecialty}`
                        : "Please select a specialty to see available doctors"}
                    </p>
                    <Link href="/doctors">
                      <Button>Browse all doctors</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* First Doctor (Always shown) */}
                    {firstDoctorChoice && (
                      <div
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 ${doctorDetails?.id === firstDoctorChoice.id ? "border-primary bg-primary/5" : "cursor-pointer"} relative`}
                        onClick={() => handleDoctorSelect(firstDoctorChoice)}
                      >
                        <Avatar className="h-14 w-14 border">
                          <AvatarImage src={firstDoctorChoice.picture} alt={firstDoctorChoice.name} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {firstDoctorChoice.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .substring(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{firstDoctorChoice.name}</p>
                          <p className="text-sm text-muted-foreground">{firstDoctorChoice.specialization}</p>
                          <div className="flex items-center mt-1">
                            {firstDoctorChoice.rating != 0 ? (
                              <>
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium ml-1">{firstDoctorChoice.rating}</span>
                            </>) : (
                              <span className="text-sm font-medium text-green-500">Newly joined</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional Doctors (Shown when expanded) */}
                    {showMoreDoctors && (
                      <>
                        {secondDoctorChoice && secondDoctorChoice.id !== firstDoctorChoice?.id && (
                          <div
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 ${doctorDetails?.id === secondDoctorChoice.id ? "border-primary bg-primary/5" : "cursor-pointer"} relative`}
                            onClick={() => handleDoctorSelect(secondDoctorChoice)}
                          >
                            <Avatar className="h-14 w-14 border">
                              <AvatarImage src={secondDoctorChoice.picture} alt={secondDoctorChoice.name} />
                              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                {secondDoctorChoice.name
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-semibold text-foreground">{secondDoctorChoice.name}</p>
                              <p className="text-sm text-muted-foreground">{secondDoctorChoice.specialization}</p>
                              <div className="flex items-center mt-1">
                              {secondDoctorChoice.rating != 0 ? (
                              <>
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium ml-1">{secondDoctorChoice.rating}</span>
                            </>) : (
                              <span className="text-sm font-medium text-green-500">Newly joined</span>
                            )}
                              </div>
                            </div>
                          </div>
                        )}

                        {thirdDoctorChoice &&
                          thirdDoctorChoice.id !== firstDoctorChoice?.id &&
                          thirdDoctorChoice.id !== secondDoctorChoice?.id && (
                            <div
                              className={`flex items-center gap-3 p-3 rounded-lg border-2 ${doctorDetails?.id === thirdDoctorChoice.id ? "border-primary bg-primary/5" : "cursor-pointer"} relative`}
                              onClick={() => handleDoctorSelect(thirdDoctorChoice)}
                            >
                              <Avatar className="h-14 w-14 border">
                                <AvatarImage src={thirdDoctorChoice.picture} alt={thirdDoctorChoice.name} />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                  {thirdDoctorChoice.name
                                    ?.split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .substring(0, 2)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="font-semibold text-foreground">{thirdDoctorChoice.name}</p>
                                <p className="text-sm text-muted-foreground">{thirdDoctorChoice.specialization}</p>
                                <div className="flex items-center mt-1">
                                {thirdDoctorChoice.rating != 0 ? (
                              <>
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium ml-1">{thirdDoctorChoice.rating}</span>
                            </>) : (
                              <span className="text-sm font-medium text-green-500">Newly joined</span>
                            )}
                                </div>
                              </div>
                            </div>
                          )}
                      </>
                    )}

                    {/* Compact Show More/Show Less Button */}
                    {(secondDoctorChoice || thirdDoctorChoice) && (
                      <div className="flex justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-primary"
                          onClick={() => setShowMoreDoctors(!showMoreDoctors)}
                        >
                          {showMoreDoctors ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" />
                              Show more
                            </>
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
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Choose Date & Time</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{selectedDate}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Date selection */}

                  <div className="flex justify-between items-center overflow-x-auto pb-2">
  {dates.map(({ day, date, fullDate }, index) => (
    <React.Fragment key={fullDate}>
    <button
      onClick={() => setSelectedDate(fullDate)}
      className={`min-w-[4.5rem] h-16 flex flex-col items-center justify-center rounded-lg transition-all ${
        fullDate === selectedDate
          ? "bg-primary text-primary-foreground"
          : "bg-background border border-input hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      <span className="text-sm font-medium">{day}</span>
      <span className="text-lg font-bold">{date}</span>
    </button>
    
    {/* Add separator between dates except after last */}
    {index < dates.length - 1 && (
      <div className="h-px w-8 bg-gray-200 mx-1 flex-shrink-0" />
    )}
  </React.Fragment>
  ))}
</div>

                  <div>
                    <div className="flex items-center mb-3">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <h3 className="text-sm font-medium">Available Time Slots</h3>
                    </div>

                    {loadingTimes ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <LoadingSpinner size="md" />
                        <p className="mt-3 text-sm text-muted-foreground">Loading available times...</p>
                      </div>
                    ) : (
                      <Tabs defaultValue="morning" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-4">
                          <TabsTrigger value="morning">Morning</TabsTrigger>
                          <TabsTrigger value="afternoon">Afternoon</TabsTrigger>
                          <TabsTrigger value="evening">Evening</TabsTrigger>
                        </TabsList>
                        <TabsContent value="morning" className="mt-0">
                          {groupedTimeSlots.morning.length > 0 ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                              {groupedTimeSlots.morning.map((slot, index) => {
  const now = new Date();
  const isToday = selectedDate === now.toISOString().split("T")[0];
  const [hours, minutes] = slot.time.split(":").map(Number);
  const slotTime = new Date();
  slotTime.setHours(hours, minutes, 0, 0);
  const isPastTime = isToday && slotTime < now;

  return (
    <button
      key={`${slot.time}-${index}`}
      onClick={() => !slot.booked && !isPastTime && setSelectedTime(slot.time)}
      className={`p-2 text-sm rounded-md border transition-all relative ${
        slot.time === selectedTime
          ? "bg-primary/10 border-primary text-primary font-medium"
          : slot.booked || isPastTime
          ? "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
          : "border-input text-foreground hover:bg-accent"
      }`}
      disabled={slot.booked || isPastTime}
    >
      {slot.time}
      {slot.booked && (
        <>
        <span className="absolute hidden md:block -top-1 -right-1 bg-red-100 text-red-800 text-xs px-1 rounded-full">
          Booked
        </span>
        <span className="absolute md:hidden -top-1 -right-1 bg-red-100 text-red-800 text-xs px-1 rounded-full">
        ✓
        </span>
        </>
      )}
      {isPastTime && !slot.booked && (
        <span className="absolute -top-1 -right-1 bg-gray-300 text-gray-800 text-xs px-1 rounded-full">
         
        </span>
      )}
    </button>
  );
})}
                            </div>
                          ) : (
                            <p className="text-center text-muted-foreground py-4">No morning slots available</p>
                          )}
                        </TabsContent>
                        <TabsContent value="afternoon" className="mt-0">
                          {groupedTimeSlots.afternoon.length > 0 ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                              {groupedTimeSlots.afternoon.map((slot, index) => {
  const now = new Date();
  const isToday = selectedDate === now.toISOString().split("T")[0];
  const [hours, minutes] = slot.time.split(":").map(Number);
  const slotTime = new Date();
  slotTime.setHours(hours, minutes, 0, 0);
  const isPastTime = isToday && slotTime < now;

  return (
    <button
      key={`${slot.time}-${index}`}
      onClick={() => !slot.booked && !isPastTime && setSelectedTime(slot.time)}
      className={`p-2 text-sm rounded-md border transition-all relative ${
        slot.time === selectedTime
          ? "bg-primary/10 border-primary text-primary font-medium"
          : slot.booked || isPastTime
          ? "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
          : "border-input text-foreground hover:bg-accent"
      }`}
      disabled={slot.booked || isPastTime}
    >
      {slot.time}
      {slot.booked && (
        <>
        <span className="absolute hidden md:block -top-1 -right-1 bg-red-100 text-red-800 text-xs px-1 rounded-full">
          Booked
        </span>
        <span className="absolute md:hidden -top-1 -right-1 bg-red-100 text-red-800 text-xs px-1 rounded-full">
        ✓
        </span>
        </>
      )}
      {isPastTime && !slot.booked && (
        <span className="absolute -top-1 -right-1 bg-gray-300 text-gray-800 text-xs px-1 rounded-full">
         
        </span>
      )}
    </button>
  );
})}
                            </div>
                          ) : (
                            <p className="text-center text-muted-foreground py-4">No afternoon slots available</p>
                          )}
                        </TabsContent>
                        <TabsContent value="evening" className="mt-0">
                          {groupedTimeSlots.evening.length > 0 ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                              {groupedTimeSlots.evening.map((slot, index) => {
  const now = new Date();
  const isToday = selectedDate === now.toISOString().split("T")[0];
  const [hours, minutes] = slot.time.split(":").map(Number);
  const slotTime = new Date();
  slotTime.setHours(hours, minutes, 0, 0);
  const isPastTime = isToday && slotTime < now;

  return (
    <button
      key={`${slot.time}-${index}`}
      onClick={() => !slot.booked && !isPastTime && setSelectedTime(slot.time)}
      className={`p-2 text-sm rounded-md border transition-all relative ${
        slot.time === selectedTime
          ? "bg-primary/10 border-primary text-primary font-medium"
          : slot.booked || isPastTime
          ? "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
          : "border-input text-foreground hover:bg-accent"
      }`}
      disabled={slot.booked || isPastTime}
    >
      {slot.time}
      {slot.booked && (
        <>
        <span className="absolute hidden md:block -top-1 -right-1 bg-red-100 text-red-800 text-xs px-1 rounded-full">
          Booked
        </span>
        <span className="absolute md:hidden -top-1 -right-1 bg-red-100 text-red-800 text-xs px-1 rounded-full">
        ✓
        </span>
        </>
      )}
      {isPastTime && !slot.booked && (
        <span className="absolute -top-1 -right-1 bg-gray-300 text-gray-800 text-xs px-1 rounded-full">
         
        </span>
      )}
    </button>
  );
})}
                            </div>
                          ) : (
                            <p className="text-center text-muted-foreground py-4">No evening slots available</p>
                          )}
                        </TabsContent>
                      </Tabs>
                    )}
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Your appointment</p>
                        <p className="font-medium">
                          {selectedDate} at {selectedTime || "Select a time"}
                        </p>
                      </div>
                      <Button
                        onClick={bookAppointment}
                        disabled={!selectedTime || processingPayment}
                        className="bg-green-600 hover:bg-green-700 text-white"
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
            <Card className="sticky top-6">
              <CardContent className="pt-6">
                <div className={`flex flex-col items-center ${!doctorDetails ? "" : "mb-6"}`}>
                  {doctorDetails && (
                    <>
                      <Avatar className="h-24 w-24 mb-4 border-4 border-primary/10">
                        <AvatarImage src={doctorDetails.picture} alt={doctorDetails.name} />
                        <AvatarFallback>{doctorDetails.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h2 className="text-xl font-bold text-center">{doctorDetails.name}</h2>
                      <p className="text-muted-foreground">{doctorDetails.specialization}</p>

                      <div className="flex items-center mt-2">
                      {doctorDetails.rating != 0 ? (
                              <>
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium ml-1">{doctorDetails.rating}</span>
                            </>) : (
                              <span className="text-sm font-medium text-green-500">Newly joined</span>
                            )}
                      </div>

                      <div className="flex gap-4 mt-4">
                        <Button size="icon" variant="outline" className="rounded-full h-10 w-10">
                          <Mail className="h-4 w-4" />
                          <span className="sr-only">Email</span>
                        </Button>
                        <Button size="icon" variant="outline" className="rounded-full h-10 w-10">
                          <PhoneCall className="h-4 w-4" />
                          <span className="sr-only">Call</span>
                        </Button>
                        <Button size="icon" variant="outline" className="rounded-full h-10 w-10">
                          <Smartphone className="h-4 w-4" />
                          <span className="sr-only">Message</span>
                        </Button>
                      </div>
                    </>
                  )}
                </div>
                {!doctorDetails ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="mx-auto w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Doctor Profile</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Select a doctor to view their complete profile and availability
                      </p>
                    </div>
                    <Link href="/doctors">
                      <Button variant="outline" className="w-full">
                        Browse all doctors
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Biography</h3>
                      <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                        {doctorDetails ? doctorDetails.biography : "Loading..."}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPage

