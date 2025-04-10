"use client"

import { useState, useMemo, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Check, ChevronDown, Stethoscope } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "react-toastify"

export default function FindDoc() {
  const [selectedExperience, setExperience] = useState("")
  const [selectedSpecialty, setSpecialty] = useState("")
  const [selectedFees, setFees] = useState("")
  const [specialties, setSpecialties] = useState([]) // Change to state
  const router = useRouter()

  const experienceRanges = [
    { key: "0-5", label: "0-5 years" },
    { key: "6-10", label: "6-10 years" },
    { key: "11+", label: "11+ years" },
  ]

  const feesRanges = [
    { key: "100-500", label: "₹100-₹500" },
    { key: "500-1000", label: "₹500-₹1000" },
    { key: "1000+", label: "₹1000+" },
  ]

  const selectedSpecialtyLabel = useMemo(() => {
    return specialties.find((item) => item.key === selectedSpecialty)?.label || ""
  }, [selectedSpecialty, specialties])

  const selectedExperienceLabel = useMemo(() => {
    return experienceRanges.find((item) => item.key === selectedExperience)?.label || ""
  }, [selectedExperience])

  const selectedFeesLabel = useMemo(() => {
    return feesRanges.find((item) => item.key === selectedFees)?.label || ""
  }, [selectedFees])

  const handleSubmit = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (selectedSpecialty) params.append("spec", selectedSpecialty)
    if (selectedExperience) params.append("exp", selectedExperience)
    if (selectedFees) params.append("fee", selectedFees)

    // Navigate to doctors page with filters
    router.push(`/doctors?${params.toString()}`)
  }

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND}/doctorData/fetchSpecializations.php`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.specializations)) {
          const formattedSpecialties = data.specializations.map((spec) => ({
            key: spec,
            label: spec,
          }))
          setSpecialties(formattedSpecialties) // Update state
        } else {
          toast.error("Failed to fetch specializations")
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch specializations")
      })
  }, [])
  return (
    <div className="bg-gradient-to-br from-white to-blue-50 p-6 md:p-8 lg:p-10 rounded-xl shadow-lg mx-4 md:mx-6 -mt-8 mb-8 relative z-10 border border-blue-100/50 transition-shadow duration-300 ease-in-out hover:shadow-[0_0_20px_8px_rgba(59,130,246,0.5)]">

      <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span className="bg-blue-500/10 p-2 rounded-full">
            <Stethoscope className="w-6 h-6 md:w-7 md:h-7 text-blue-600" />
          </span>
          <span>
            Find Your <span className="text-blue-600">Doctor</span>
          </span>
        </h1>

        <p className="text-sm md:text-base lg:text-xl text-gray-600 font-medium">
          <span className="text-blue-600 font-semibold">Minutes Matter!</span> Just 3 steps away from your consultation
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 md:gap-6 items-end">
        {/* Speciality Dropdown */}
        <div className="flex flex-col w-full md:w-1/3">
          <label className="font-medium text-gray-700 flex items-center mb-2 gap-1 text-sm">
            Speciality <span className="text-red-500">*</span>
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between text-left h-12 px-4 rounded-lg border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all",
                  selectedSpecialty && "border-blue-300 bg-blue-50/50 text-blue-700 font-medium",
                )}
              >
                <span className="truncate">{selectedSpecialtyLabel || "Choose Speciality"}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full min-w-[240px] p-1 animate-in fade-in-80 zoom-in-95">
              <DropdownMenuLabel className="text-blue-600">Specialities</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {specialties.map((spec) => (
                <DropdownMenuItem
                  key={spec.key}
                  onClick={() => setSpecialty(spec.key)}
                  className={cn(
                    "flex items-center justify-between py-2 px-3 cursor-pointer rounded-md",
                    selectedSpecialty === spec.key && "bg-blue-50 text-blue-700 font-medium",
                  )}
                >
                  {spec.label}
                  {selectedSpecialty === spec.key && <Check className="h-4 w-4 text-blue-600" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Experience Dropdown */}
        <div className="flex flex-col w-full md:w-1/3">
          <label className="font-medium text-gray-700 flex items-center gap-1 mb-2 text-sm">
            Experience <span className="text-red-500">*</span>
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between text-left h-12 px-4 rounded-lg border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all",
                  selectedExperience && "border-blue-300 bg-blue-50/50 text-blue-700 font-medium ",
                )}
              >
                <span className="truncate">{selectedExperienceLabel || "Choose Experience"}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full min-w-[240px] p-1 animate-in fade-in-80 zoom-in-95">
              <DropdownMenuLabel className="text-blue-600">Experience Range</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {experienceRanges.map((exp) => (
                <DropdownMenuItem
                  key={exp.key}
                  onClick={() => setExperience(exp.key)}
                  className={cn(
                    "flex items-center justify-between py-2 px-3 cursor-pointer rounded-md",
                    selectedExperience === exp.key && "bg-blue-50 text-blue-700 font-medium",
                  )}
                >
                  {exp.label}
                  {selectedExperience === exp.key && <Check className="h-4 w-4 text-blue-600" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Fees Dropdown */}
        <div className="flex flex-col w-full md:w-1/3">
          <label className="font-medium text-gray-700 flex items-center mb-2 gap-1 text-sm">
            Fees Range <span className="text-red-500">*</span>
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between text-left h-12 px-4 rounded-lg border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all",
                  selectedFees && "border-blue-300 bg-blue-50/50 text-blue-700 font-medium",
                )}
              >
                <span className="truncate">{selectedFeesLabel || "Choose Fees Range"}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full min-w-[240px] p-1 animate-in fade-in-80 zoom-in-95">
              <DropdownMenuLabel className="text-blue-600">Fees Range</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {feesRanges.map((fee) => (
                <DropdownMenuItem
                  key={fee.key}
                  onClick={() => setFees(fee.key)}
                  className={cn(
                    "flex items-center justify-between py-2 px-3 cursor-pointer rounded-md",
                    selectedFees === fee.key && "bg-blue-50 text-blue-700 font-medium",
                  )}
                >
                  {fee.label}
                  {selectedFees === fee.key && <Check className="h-4 w-4 text-blue-600" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Submit Button */}
        <div className="flex w-full md:w-1/6 mt-2">
          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium text-base transition-all duration-300 shadow-md hover:shadow-lg hover:translate-y-[-2px] active:translate-y-[0px]"
          >
            Find Doctors
          </Button>
        </div>
      </form>
    </div>
  )
}

