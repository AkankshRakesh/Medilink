"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CopyrightIcon, Facebook, Instagram, Linkedin, Mail, Youtube } from 'lucide-react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronRight, Filter, ThumbsUp, X } from "lucide-react"
import Link from "next/link"
import { Fugaz_One } from "next/font/google"
import Image from "next/image"

const fugaz = Fugaz_One({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
})

const filtersData = {
  specialties: [
  ],
  experience: ["0-5", "6-10", "11+"],
  fees: ["100-500", "500-1000", "1000+"],
}

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [specialties, setSpecialties] = useState([])
  const [selectedFilters, setSelectedFilters] = useState({
    specialties: [],
    experience: [],
    fees: [],
    languages: [],
  })
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  // console.log(doctors)
  useEffect(() => {
    setLoading(true);
    
    // Get query parameters from URL
    const searchParams = new URLSearchParams(window.location.search);
    const spec = searchParams.get('spec');
    const exp = searchParams.get('exp');
    const fee = searchParams.get('fee');
    
    // Set initial filters from URL
    const initialFilters = {
      specialties: spec ? [spec] : [],
      experience: exp ? [exp] : [],
      fees: fee ? [fee] : [],
      languages: []
    };
    
    setSelectedFilters(initialFilters);
  
    // Fetch all doctors
    fetch(`${process.env.NEXT_PUBLIC_BACKEND}/doctorData/doctorData.php`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.doctors)) {
          setDoctors(data.doctors);
        } else {
          setDoctors([]);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setDoctors([]);
      })
      .finally(() => {
        setLoading(false);
      });
      fetch(`${process.env.NEXT_PUBLIC_BACKEND}/doctorData/fetchSpecializations.php`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.specializations)) {
          filtersData.specialties = data.specializations;
          setSpecialties(filtersData.specialties);
        } else {
          setSpecialties([]);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setSpecialties([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const toggleFilter = (category, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }))
  }

  const clearFilters = () => {
    setSelectedFilters({ 
      specialties: [],
      experience: [], 
      fees: [],
      languages: [] 
    })
  }

  const filterDoctors = (doctors) => {
    return doctors.filter((doctor) => {
      const specialtyMatch =
        selectedFilters.specialties.length === 0 ||
        selectedFilters.specialties.some(specialty => 
          doctor.specialization.toLowerCase().includes(specialty.toLowerCase())
        );
      
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
        
      return specialtyMatch && experienceMatch && feesMatch
    })
  }

  const filteredDoctors = filterDoctors(doctors)
  const hasActiveFilters = Object.values(selectedFilters).some((filters) => filters.length > 0)

  return (
    <>
      <div className="container mx-auto px-4 py-6 max-w-7xl mt-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Section */}
          <div className="w-full md:w-1/4 shrink-0">
            <div className="md:sticky md:top-20">
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
            <h1 className="text-2xl font-bold mb-6">Consult Doctors Online</h1>

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
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
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
    </>
  )
}

const DoctorCard = ({ doctor }) => {
  const router = useRouter();

  const checkout = (doctor) => {
    router.push(`/checkout?id=${doctor.userId}&fee=${doctor.fee}`);
  };

  const handleConsultClick = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/doctorData/saveDoctor.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doctor),
      credentials: "include",
    });
    console.log("sent data: ", doctor);
    const { id } = await response.json();
    router.push(`/booking?id=${id}`);
  };

  // Calculate the rating percentage
  const ratingPercentage = doctor.rating * 20; // Convert rating (1-5) to percentage (0-100)

  return (
    <Card className="overflow-hidden">
      <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-900">
        <div className="absolute -bottom-12 left-4">
          <div className="h-24 w-24 rounded-full border-4 border-background overflow-hidden bg-muted">
            {doctor.picture ? (
              <Image
                src={doctor.picture || "/placeholder.svg"}
                alt={doctor.name}
                width={300} // Set a width that makes sense for your layout
                height={300} // Set a height that maintains the aspect ratio
                layout="responsive"
                className="object-cover"
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
              
              {ratingPercentage != 0 ? (<>
                <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                <span>{ratingPercentage}%</span>
                </>
            ) : "Recently Joined"}
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
  );
};

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

