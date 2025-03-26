"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Calendar, Mail, PhoneCall, Smartphone, MapPin, Star, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const category = [
    "General Physician", "Dermatology", "Obstetrics & Gynaecology", "Orthopaedics",
    "ENT", "Neurology", "Cardiology", "Urology", "Gastroenterology/GI medicine",
    "Psychiatry", "Paediatrics", "Pulmonology/Respiratory", "Endocrinology",
    "Nephrology", "Neurosurgery", "Rheumatology", "Ophthalmology",
    "Surgical Gastroenterology", "Infectious Disease",
    "General & Laparoscopic Surgery", "Psychology", "Medical Oncology",
    "Diabetology", "Dentist"
]

function BookingPage() {
  const searchParams = useSearchParams();
  const [dates, setDates] = useState([])
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [availableTimes, setAvailableTimes] = useState([])
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  const id = searchParams.get("id");
  console.log(id);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (!id) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND}/saveDoctor.php?id=${id}`, 
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setDoctorDetails(data);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchDoctorDetails();
  }, [id]);

  useEffect(() => {
    if(doctorDetails){
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
  }, [doctorDetails]) // Add doctorDetails as a dependency

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimes(selectedDate)
    }
  }, [selectedDate])

  const fetchAvailableTimes = async (date) => {
    try {
      // Simulated API response (replace with actual API call)
      const startTime = "20:57:15.000000"
      const endTime = "22:57:15.000000"
      generateTimeSlots(doctorDetails.availabilityStart, doctorDetails.availabilityEnd);
    } catch (error) {
      console.error("Error fetching times:", error)
    }
  }

  const generateTimeSlots = (startTime, endTime) => {
    const slots = []

    const parseTime = (timeStr) => {
      const [hours, minutes, seconds] = timeStr.split(":").map(Number)
      return new Date(1970, 0, 1, hours, minutes, seconds)
    }

    const current = parseTime(startTime)
    const end = parseTime(endTime)

    if (isNaN(current) || isNaN(end) || current >= end) {
      console.error("Invalid time range")
      return
    }

    while (current <= end) {
      slots.push(current.toTimeString().slice(0, 5))
      current.setMinutes(current.getMinutes() + 30)
    }

    setAvailableTimes(slots)
  }

  const bookAppointment = async () => {
    try {
      console.log("Booking appointment with:", {
        doctorId: doctorDetails?.id,
        date: selectedDate,
        time: selectedTime,
      })
    } catch (error) {
      console.error("Error booking appointment:", error)
    }
  }

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen mt-6">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Book Your Appointment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main booking section - takes 2/3 of the space on large screens */}
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
                      className={`px-3 py-1 cursor-pointer hover:bg-primary/10 transition-colors ${
                        doctorDetails?.specialization === cat ? "bg-primary text-primary-foreground" : ""
                      }`}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Doctor selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Selected Doctor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                        doctorDetails && doctorDetails.name === doctorDetails.name
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Avatar className="h-14 w-14 border">
                        <AvatarImage src={doctorDetails.picture} alt={doctorDetails.name} />
                        <AvatarFallback>{doctorDetails.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{doctorDetails.name}</p>
                        <p className="text-sm text-muted-foreground">{doctorDetails.specialization}</p>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium ml-1">{doctorDetails.rating}</span>
                        </div>
                      </div>
                    </div>
                </div>
              </CardContent>
            </Card>

            {/* Date and time selection */}
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
                <div className="flex justify-between overflow-x-auto pb-2 gap-2">
                  {dates.map(({ day, date, fullDate }) => (
                    <button
                      key={fullDate}
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
                  ))}
                </div>

                {/* Time selection */}
                <div>
                  <div className="flex items-center mb-3">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Available Time Slots</h3>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 text-sm rounded-md border transition-all ${
                          time === selectedTime
                            ? "bg-primary/10 border-primary text-primary font-medium"
                            : "border-input text-foreground hover:bg-accent"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Booking summary */}
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
                      disabled={!selectedTime}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Pay ₹{doctorDetails ? doctorDetails.fee : "0"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Doctor profile section - takes 1/3 of the space on large screens */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center mb-6">
                  {doctorDetails && (
                    <>
                      <Avatar className="h-24 w-24 mb-4 border-4 border-primary/10">
                        <AvatarImage src={doctorDetails.picture} alt={doctorDetails.name} />
                        <AvatarFallback>{doctorDetails.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h2 className="text-xl font-bold text-center">{doctorDetails.name}</h2>
                      <p className="text-muted-foreground">{doctorDetails.specialization}</p>

                      <div className="flex items-center mt-2">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium ml-1">{doctorDetails.rating}</span>
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

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Biography</h3>
                    <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                      {doctorDetails ? doctorDetails.bio : "Loading..."}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" /> Location
                    </h3>
                    <div className="bg-muted h-32 rounded-lg flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">Map view available</p>
                    </div>
                  </div>
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