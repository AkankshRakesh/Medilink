"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Calendar, Mail, PhoneCall, Smartphone, MapPin, Star, Clock, User, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { createRazorpayOrder, processPayment } from "@/lib/razorpay"
import { toast } from "react-toastify"

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
  const [topDoctors, setTopDoctors] = useState([])
  const [firstDoctorChoice, setFirstDoctorChoice] = useState(null)
  const [secondDoctorChoice, setSecondDoctorChoice] = useState(null)
  const [thirdDoctorChoice, setThirdDoctorChoice] = useState(null)
  const [selectedSpecialty, setSelectedSpecialty] = useState(null)
  const [noDoctorsAvailable, setNoDoctorsAvailable] = useState(false)
  const [showMoreDoctors, setShowMoreDoctors] = useState(false);
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/doctorData/getTopDoctor.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ specialization: doctorDetails.specialization }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        // Filter out the current doctor from the top doctors list
        setSecondDoctorChoice(data[0])
        setThirdDoctorChoice(data[1])
        if (!noDoctorsAvailable) setTopDoctors(data.filter((doctor) => doctor.id !== doctorDetails.id).slice(0, 2))
      } catch (error) {
        console.error("Error fetching top doctors:", error)
      }
    }

    fetchTopDoctors()
  }, [doctorDetails])

  // Handle doctor selection from top doctors
  const handleDoctorSelect = (selectedDoctor) => {
    setTopDoctors((prevTopDoctors) => prevTopDoctors.map((doc) => (doc.id === selectedDoctor.id ? doctorDetails : doc)))

    setDoctorDetails(selectedDoctor)
  }

  const fetchTopDoctorsBySpecialty = async (specialty) => {
    try {
      setLoading(true)
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
      setLoading(false)
    }
  }

  const handleSpecialtyClick = async (specialty) => {
    setSelectedSpecialty(specialty)
    await fetchTopDoctorsBySpecialty(specialty)
  }

  // Rest of your existing code...
  // In your useEffect where you set dates, ensure consistent format:
useEffect(() => {
  if (doctorDetails) {
    const today = new Date();
    const upcomingDates = Array.from({ length: 5 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() + i);
      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        date: date.getDate(),
        fullDate: date.toISOString().split('T')[0] // YYYY-MM-DD format
      };
    });
    setDates(upcomingDates);
    setSelectedDate(upcomingDates[0].fullDate);
  }
}, [doctorDetails]);

  useEffect(() => {
    if (selectedDate && doctorDetails) {
      fetchAvailableTimes(selectedDate)
    }
  }, [selectedDate, doctorDetails])

  const fetchAvailableTimes = async (date) => {
    try {
      const { availabilityStart, availabilityEnd } = doctorDetails;
      
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/bookings/getBookedTime.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: doctorDetails.userId, type:1 }),
      });
      
      const bookedSlots = await response.json();
  
      // Normalize dates and times for comparison
      const normalizeTime = (timeStr) => {
        // Handle cases like "9:00" -> "09:00"
        const [hours, minutes] = timeStr.split(':');
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      };
  
      const bookedTimesForDate = bookedSlots
        .filter(slot => {
          return slot.date === date;
        })
        .map(slot => {
          const normalizedTime = normalizeTime(slot.time);
          return normalizedTime;
        });
  
  
      const allSlots = generateTimeSlots(availabilityStart, availabilityEnd);
  
      const timeSlots = allSlots.map(time => {
        const isBooked = bookedTimesForDate.includes(time);
        return {
          time,
          booked: isBooked
        };
      });
  
      setAvailableTimes(timeSlots);
    } catch (error) {
      console.error("Error:", error);
      setAvailableTimes([]);
    }
  };
  
  // Update your generateTimeSlots function to return array of time strings
  const generateTimeSlots = (startTime, endTime) => {
    const slots = [];
    
    // Parse start and end times
    const parseTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes; // Convert to minutes since midnight
    };
  
    const formatTime = (minutes) => {
      const hrs = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    };
  
    let current = parseTime(startTime);
    const end = parseTime(endTime);
  
    while (current <= end) {
      slots.push(formatTime(current));
      current += 30; // 30 minute intervals
    }
  
    return slots;
  };

  const bookAppointment = async () => {
    if (doctorDetails.userId == localStorage.getItem("userId")) {
      toast.error("You cannot book an appointment with yourself");
      return;
    }
  
    try {
      const payload = {
        doctor_id: doctorDetails.userId,
        patient_id: localStorage.getItem("userId"),
        amount: doctorDetails.fee,
        meeting_date: selectedDate,
        meeting_time: selectedTime,
      };
  
      const order = await createRazorpayOrder(payload);
      if (!order) {
        toast.error("Failed to create order");
        return;
      }
  
      const paymentResponse = await processPayment(order);
      console.log(paymentResponse, order.order_id);
  
      // 1. First update the order status
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/bookings/updateOrder.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          order_id: order.order_id, 
          payment_id: paymentResponse.paymentId 
        }),
      });
  
      if (paymentResponse.success) {
        // 2. Only after payment success, create Google Meet
        const meetLink = await createGoogleMeet(selectedDate, selectedTime);
        
        if (!meetLink) {
          toast.error("Appointment booked but failed to create meeting link");
          // Still proceed with booking even if Meet fails
        }
        console.log(meetLink);
        // 3. Send booking data with meet link to backend
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
            meetLink: meetLink || null // Send null if meet creation failed
          }),
        });
  
        if (!bookingResponse.ok) {
          throw new Error("Failed to save booking");
        }
  
        toast.success("Payment successful! Meeting details will be sent to your email", {
          onClose: () => window.location.reload(),
        });
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Error processing appointment");
    }
  };
  const generateGoogleMeetLink = () => {
    // Generate a random 10-character meeting code
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let meetCode = '';
    
    for (let i = 0; i < 10; i++) {
      meetCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return `https://meet.google.com/${meetCode}`;
  };
  
  const createGoogleMeet = async (date, time) => {
    try {
      // Generate the Meet link
      const meetLink = generateGoogleMeetLink();
      
      // Verify the link format (simple validation)
      if (!meetLink.startsWith('https://meet.google.com/') || meetLink.length < 30) {
        throw new Error('Invalid Meet link generated');
      }
      
      return meetLink;
    } catch (error) {
      console.error('Meet creation error:', error);
      return null;
    }
  };

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
                      className={`px-3 py-1 cursor-pointer hover:bg-primary/10 transition-colors ${
                        doctorDetails?.specialization === cat || selectedSpecialty === cat ? "bg-primary text-primary-foreground" : ""
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
    {!doctorDetails ? (
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
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium ml-1">{firstDoctorChoice.rating}</span>
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
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium ml-1">{secondDoctorChoice.rating}</span>
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
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium ml-1">{thirdDoctorChoice.rating}</span>
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

                  <div>
                    <div className="flex items-center mb-3">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <h3 className="text-sm font-medium">Available Time Slots</h3>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
  {availableTimes.map((slot, index) => (
    <button
      key={`${slot.time}-${index}`}
      onClick={() => !slot.booked && setSelectedTime(slot.time)}
      className={`p-2 text-sm rounded-md border transition-all relative ${
        slot.time === selectedTime
          ? "bg-primary/10 border-primary text-primary font-medium"
          : slot.booked
          ? "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
          : "border-input text-foreground hover:bg-accent"
      }`}
      disabled={slot.booked}
    >
      {slot.time}
      {slot.booked && (
        <span className="absolute -top-1 -right-1 bg-red-100 text-red-800 text-xs px-1 rounded-full">
          ✓
        </span>
      )}
    </button>
  ))}
</div>
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
                        disabled={!selectedTime}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Pay ₹{doctorDetails ? doctorDetails.fee : "0"}
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

                    <div>
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" /> Location
                      </h3>
                      <div className="bg-muted h-32 rounded-lg flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">Map view available</p>
                      </div>
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

