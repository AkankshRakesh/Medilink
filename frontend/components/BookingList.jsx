"use client"

import { Calendar, Star } from "lucide-react"
import Link from "next/link"
import { useMemo, useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"

const formatDate = (date) => {
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  })
}

export function BookingList({ bookings, type, onCancelBooking, onRateBooking }) {
  const [doctorDetails, setDoctorDetails] = useState({})
  const [showPastBookings, setShowPastBookings] = useState(false)

  useEffect(() => {
    if (type === "personal") {
      const fetchDoctors = async () => {
        const details = {}
        for (const booking of bookings) {
          if (booking.doctorId && !details[booking.doctorId]) {
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/doctorData/getDoctor.php`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: booking.doctorId }),
              })
              const data = await response.json()
              if (data.success) {
                details[booking.doctorId] = data.doctor
              }
            } catch (error) {
              console.error("Error fetching doctor details:", error)
            }
          }
        }
        setDoctorDetails(details)
      }
      fetchDoctors()
    }
  }, [bookings, type])

  const { upcomingBookings, pastBookings } = useMemo(() => {
    if (!Array.isArray(bookings)) {
      console.error("Bookings is not an array:", bookings)
      return { upcomingBookings: [], pastBookings: [] }
    }

    const now = new Date()
    const upcoming = []
    const past = []

    bookings.forEach((booking) => {
      if (!booking?.date || !booking?.time) return
      
      const bookingDateTime = new Date(`${booking.date}T${booking.time}`)
      if (bookingDateTime >= now) {
        upcoming.push(booking)
      } else {
        past.push(booking)
      }
    })

    return {
      upcomingBookings: upcoming.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`)
        const dateB = new Date(`${b.date}T${b.time}`)
        return dateA - dateB
      }),
      pastBookings: past.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`)
        const dateB = new Date(`${b.date}T${b.time}`)
        return dateB - dateA
      })
    }
  }, [bookings])

  if (upcomingBookings.length === 0 && pastBookings.length === 0) {
    return <EmptyBookingState type={type} />
  }

  return (
    <div className="space-y-8">
      {/* Upcoming Appointments Section */}
      {upcomingBookings.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Upcoming Appointments</h3>
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <BookingCard
                key={`upcoming-${booking.time}-${booking.doctorId}`}
                booking={booking}
                type={type}
                onCancel={onCancelBooking}
                doctorDetails={type === "personal" ? doctorDetails[booking.doctorId] : null}
              />
            ))}
          </div>
        </div>
      )}

      {/* Past Appointments Section */}
      {pastBookings.length > 0 && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
  <h3 className="text-base sm:text-lg font-medium">Past Appointments</h3>
  <Button
    variant="secondary"
    size="sm"
    className="w-full sm:w-auto px-3"
    onClick={() => setShowPastBookings(!showPastBookings)}
  >
    {showPastBookings ? 'Hide' : 'Show'} Past Appointments
  </Button>
</div>
          
          {showPastBookings && (
            <div className="space-y-4">
              {pastBookings.map((booking) => (
                <BookingCard
                  key={`past-${booking.time}-${booking.doctorId}`}
                  booking={booking}
                  type={type}
                  onCancel={onCancelBooking}
                  onRate={onRateBooking}
                  doctorDetails={type === "personal" ? doctorDetails[booking.doctorId] : null}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function BookingCard({ booking, type, onCancel, onRate, doctorDetails }) {
  const handleCancel = () => {
    if (onCancel && window.confirm("Are you sure you want to cancel this appointment?")) {
      onCancel(booking.id)
    }
  }

  const handleRate = () => {
    if (onRate) {
      onRate(booking)
    }
  }

  const formattedDate = booking.date ? formatDate(booking.date) : "Date not specified"
  const formattedTime = booking.time || "Time not specified"
  const isPastBooking = new Date(`${booking.date}T${booking.time}`) < new Date()

  return (
    <Card className="hover:shadow-md transition-shadow dark:bg-gray-900">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex flex-col sm:flex-row items-start gap-4 w-full">
            {type === "personal" && (
              <div className="h-12 w-12 rounded-full overflow-hidden border border-gray-300 flex-shrink-0">
                {doctorDetails?.picture ? (
                  <Image
                    src={doctorDetails.picture || "/placeholder.svg"}
                    alt="Doctor"
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${doctorDetails.name?.charAt(0) || "D"}&background=random&color=fff&size=200`
                    }}
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-medium">{doctorDetails?.name?.charAt(0) || "D"}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex-grow min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
                <p className="font-medium">
                  {type === "doctor" ? booking.patientName || "Patient" : doctorDetails?.name || "Doctor"}
                </p>
                <Badge
                  variant="outline"
                  className={`${
                    booking.status === "cancelled" ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"
                  } border-0 self-start sm:self-auto`}
                >
                  {booking.status === "cancelled" ? "Cancelled" : "Confirmed"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {formattedDate} at {formattedTime}
              </p>
              {booking.reason && (
                <p className="text-sm mt-2">
                  <span className="font-medium">Reason:</span> {booking.reason}
                </p>
              )}
              <div className="mt-2">
                <p className="text-sm font-medium">Meeting Link:</p>
                <a
                  href={booking.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline break-all"
                >
                  {booking.meetLink}
                </a>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {isPastBooking && (<CardFooter className="flex flex-wrap gap-2 pt-0">

        {type === "personal" && isPastBooking && !booking.isRated && onRate && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRate}
            className="text-yellow-600 hover:bg-yellow-50"
          >
            <Star className="h-4 w-4 mr-2" />
            Rate Appointment
          </Button>
        )}
      </CardFooter>)}
    </Card>
  )
}

function EmptyBookingState({ type }) {
  return (
    <div className="text-center py-8">
      <div className="h-16 w-16 sm:h-20 sm:w-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
        <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
      </div>
      <p className="text-base sm:text-lg">
        {type === "doctor" ? "No upcoming appointments with you" : "You don't have any upcoming appointments"}
      </p>
      {type === "personal" && (
        <Link href="/doctors" className="inline-block mt-4">
          <Button size="sm" className="sm:size-lg">
            Book an Appointment
          </Button>
        </Link>
      )}
    </div>
  )
}