"use client"
import Image from "next/image"
import Link from "next/link"


const specialties = [
  { id: 1, name: "General Physician", shortName: "General Physician", imagePath: "/Specs/general.webp" },
  { id: 2, name: "Dermatology", shortName: "Dermatology", imagePath: "/Specs/derma.webp" },
  { id: 3, name: "Obstetrics & Gynaecology", shortName: "Obs & Gyn", imagePath: "/Specs/obsgyn.webp" },
  { id: 4, name: "Orthopaedics", shortName: "Orthopaedics", imagePath: "/Specs/ortho.webp" },
  { id: 5, name: "ENT", shortName: "ENT", imagePath: "/Specs/ent.webp" },
  { id: 6, name: "Neurology", shortName: "Neurology", imagePath: "/Specs/neuro.webp" },
  { id: 7, name: "Cardiology", shortName: "Cardiology", imagePath: "/Specs/cardio.webp" },
  { id: 8, name: "Urology", shortName: "Urology", imagePath: "/Specs/uro.webp" },
  { id: 9, name: "Gastroenterology/GI medicine", shortName: "Gastro", imagePath: "/Specs/gastro.webp" },
  { id: 10, name: "Psychiatry", shortName: "Psychiatry", imagePath: "/Specs/psychi.webp" },
  { id: 11, name: "Paediatrics", shortName: "Paediatrics", imagePath: "/Specs/paedi.webp" },
  { id: 12, name: "Pulmonology/Respiratory", shortName: "Pulmonology", imagePath: "/Specs/respi.webp" },
  { id: 13, name: "Endocrinology", shortName: "Endocrinology", imagePath: "/Specs/endo.webp" },
  { id: 14, name: "Nephrology", shortName: "Nephrology", imagePath: "/Specs/nephro.webp" },
  { id: 15, name: "Neurosurgery", shortName: "Neurosurgery", imagePath: "/Specs/neurosurg.webp" },
  { id: 16, name: "Rheumatology", shortName: "Rheumatology", imagePath: "/Specs/rheu.webp" },
  { id: 17, name: "Ophthalmology", shortName: "Ophthalmology", imagePath: "/Specs/oph.webp" },
  { id: 18, name: "Surgical Gastroenterology", shortName: "Surgical Gastro", imagePath: "/Specs/gastrosurg.webp" },
  { id: 19, name: "Infectious Disease", shortName: "Infectious Disease", imagePath: "/Specs/infect.webp" },
  { id: 20, name: "General & Laparoscopic Surgery", shortName: "General Surgery", imagePath: "/Specs/lap.webp" },
  { id: 21, name: "Psychology", shortName: "Psychology", imagePath: "/Specs/psycho.webp" },
  { id: 22, name: "Medical Oncology", shortName: "Oncology", imagePath: "/Specs/onco.webp" },
  { id: 23, name: "Diabetology", shortName: "Diabetology", imagePath: "/Specs/diab.webp" },
  { id: 24, name: "Dentist", shortName: "Dentist", imagePath: "/Specs/dent.webp" },
]

const Specialties = () => {
  // Only render the first 12 specialties initially for faster loading
  const initialSpecialties = specialties.slice(0, 12)
  const remainingSpecialties = specialties.slice(12)

  return (
    <div className="p-6 xl:mx-12">
      <h2 className="text-xl font-bold mb-4">Browse by Specialties</h2>

      {/* Initial specialties - load immediately */}
      <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12">
        {initialSpecialties.map((specialty) => (
          <SpecialtyCard key={specialty.id} specialty={specialty} />
        ))}
      </div>

      {/* Remaining specialties - load when visible */}
      <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 mt-4">
        {remainingSpecialties.map((specialty) => (
          <SpecialtyCard key={specialty.id} specialty={specialty} />
        ))}
      </div>
    </div>
  )
}

// Extract specialty card to its own component for better organization
const SpecialtyCard = ({ specialty }) => {
  return (
    <Link
      href={`/doctors?spec=${encodeURIComponent(specialty.name)}`}
      className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-2">
        <Image
          src={specialty.imagePath || "/placeholder.svg"}
          alt={specialty.name}
          width={42}
          height={42}
          loading="lazy" // Lazy load images that might be below the fold
        />
      </div>
      <span className="text-center text-xs md:text-sm xl:text-md font-medium text-gray-800">{specialty.shortName}</span>
    </Link>
  )
}

export default Specialties

