"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronRight, Filter, ThumbsUp, X } from "lucide-react"

const filtersData = {
  experience: ["0-5", "6-10", "11+"],
  fees: ["100-500", "500-1000", "1000+"],
  languages: ["English", "Hindi", "Telugu"],
}

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFilters, setSelectedFilters] = useState({
    experience: [],
    fees: [],
    languages: [],
  })
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_BACKEND}/doctorData.php`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched doctors:", data)
        if (data.success && Array.isArray(data.doctors)) {
          setDoctors(data.doctors)
        } else {
          setDoctors([])
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err)
        setDoctors([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const toggleFilter = (category, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }))
  }

  const clearFilters = () => {
    setSelectedFilters({ experience: [], fees: [], languages: [] })
  }

  const filterDoctors = (doctors) => {
    return doctors.filter((doctor) => {
      const experienceMatch =
        selectedFilters.experience.length === 0 ||
        selectedFilters.experience.some((range) => {
          const [min, max] = range.split("-").map(Number)
          return doctor.experience >= min && (max ? doctor.experience <= max : true)
        })
      const feesMatch =
        selectedFilters.fees.length === 0 ||
        selectedFilters.fees.some((range) => {
          if (range === "1000+") {
            return doctor.fee >= 1000
          } else {
            const [min, max] = range.split("-").map(Number)
            return doctor.fee >= min && doctor.fee <= max
          }
        })
      const languageMatch =
        selectedFilters.languages.length === 0 ||
        selectedFilters.languages.some((lang) => doctor.languages.includes(lang))
      return experienceMatch && feesMatch && languageMatch
    })
  }

  const filteredDoctors = filterDoctors(doctors)
  const hasActiveFilters = Object.values(selectedFilters).some((filters) => filters.length > 0)

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl mt-10">

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Section */}
        <div className="w-full md:w-1/4 shrink-0">
          <div className="md:sticky md:top-4">
            <Button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              variant="outline"
              className="w-full flex items-center justify-between md:hidden mb-4"
            >
              <span className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </span>
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2">
                  {Object.values(selectedFilters).flat().length}
                </Badge>
              )}
            </Button>

            <div className={`${isFiltersOpen ? "block" : "hidden"} md:block bg-card rounded-lg border shadow-sm`}>
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-lg">Filters</h2>
                  {hasActiveFilters && (
                    <Button onClick={clearFilters} variant="ghost" size="sm" className="h-8 text-primary">
                      Clear all
                    </Button>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-6">
                {Object.entries(filtersData).map(([category, values]) => (
                  <div key={category} className="space-y-3">
                    <h3 className="font-medium capitalize">{category}</h3>
                    <div className="space-y-2">
                      {values.map((value) => (
                        <div key={value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${category}-${value}`}
                            checked={selectedFilters[category].includes(value)}
                            onCheckedChange={() => toggleFilter(category, value)}
                          />
                          <label
                            htmlFor={`${category}-${value}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {value}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          <h1 className="text-2xl font-bold mb-6">Consult General Physicians Online</h1>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(selectedFilters).map(([category, values]) =>
                values.map((value) => (
                  <Badge
                    key={`${category}-${value}`}
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1.5"
                  >
                    <span className="capitalize">{category}:</span> {value}
                    <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleFilter(category, value)} />
                  </Badge>
                )),
              )}
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-muted-foreground">
                  Clear all
                </Button>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <DoctorCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <h3 className="text-xl font-medium mb-2">No doctors found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters to see more results</p>
              <Button onClick={clearFilters} variant="outline">
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredDoctors.map((doctor) => (
                <DoctorCard key={doctor.name} doctor={doctor} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const DoctorCard = ({ doctor }) => {
  const router = useRouter();

  const checkout = (doctor) => {
    router.push(`/checkout?id=${doctor.userId}&fee=${doctor.fee}`);
  };

  const handleConsultClick = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/saveDoctor.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doctor),
      credentials: "include",
    })
    console.log("sent data: ", doctor)
    const { id } = await response.json()
    router.push(`/booking?id=${id}`)
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-900">
        <div className="absolute -bottom-12 left-4">
          <div className="h-24 w-24 rounded-full border-4 border-background overflow-hidden bg-muted">
            {doctor.picture ? (
              <img
                src={doctor.picture || "/placeholder.svg"}
                alt={doctor.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary">
                {doctor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}
          </div>
        </div>
      </div>

      <CardContent className="pt-14 pb-4">
        <div className="flex justify-between">
          <div>
            <h3 className="font-semibold text-lg">{doctor.name}</h3>
            <p className="text-muted-foreground text-sm">{doctor.specialization}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-green-600 text-sm font-medium">
              <ThumbsUp className="h-3.5 w-3.5 mr-1" />
              <span>{doctor.rating}%</span>
            </div>
            <p className="text-xs text-muted-foreground">{doctor.patients}+ Patients</p>
          </div>
        </div>

        <div className="mt-3 space-y-1">
          <div className="flex items-center text-sm">
            <span className="font-medium">Experience:</span>
            <span className="ml-2">{doctor.experience} years</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="font-medium">Qualification:</span>
            <span className="ml-2">{doctor.qualification}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="font-medium">Location:</span>
            <span className="ml-2">{doctor.location}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center border-t bg-muted/30 py-3">
        <div>
          <p className="text-lg font-bold">₹{doctor.fee}</p>
          <p className="text-xs text-muted-foreground">{doctor.availability}</p>
        </div>
        <Button onClick={handleConsultClick} className="px-6">
          Digital Consult
        </Button>
      </CardFooter>
    </Card>
  )
}

const DoctorCardSkeleton = () => (
  <Card className="overflow-hidden">
    <div className="h-32 bg-muted"></div>
    <div className="relative">
      <div className="absolute -top-12 left-4">
        <Skeleton className="h-24 w-24 rounded-full" />
      </div>
    </div>
    <CardContent className="pt-14 pb-4">
      <div className="flex justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </CardContent>
    <CardFooter className="flex justify-between items-center border-t bg-muted/30 py-3">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-9 w-32" />
    </CardFooter>
  </Card>
)

