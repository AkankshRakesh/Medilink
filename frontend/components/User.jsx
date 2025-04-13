"use client"
import { Fugaz_One } from "next/font/google"
import { useEffect, useState } from "react"
import {LoadingSpinner} from "./LoadingSpinner"
import { toast } from "react-toastify"
import { Camera, Star, Users, Clock, MapPin, Award, Briefcase, GraduationCap, DollarSign } from "lucide-react"
import { BookingList } from "./BookingList"

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ["400"] })

export const User = () => {
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [isDoctor, setIsDoctor] = useState(false)
  const [doctorDetails, setDoctorDetails] = useState(null)
  const [email, setEmail] = useState("Unknown")
  const [userId, setUserId] = useState(0)
  const [username, setUsername] = useState("Anonymous User")
  const [time, setTime] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [appointments, setAppointments] = useState({
    asDoctor: [],
    asPatient: [],
  })
  const [saveDocloading, setSaveDocLoading] = useState(false);
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
const [searchTerm, setSearchTerm] = useState("");
const [isDropdownOpen, setIsDropdownOpen] = useState(false);

const filteredSpecialties = specialties.filter(specialty =>
  specialty.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  specialty.name.toLowerCase().includes(searchTerm.toLowerCase())
);
const [formData, setFormData] = useState({
  userId: 0,
  name: "",
  experience: "",
  specialization: "",
  picture: image,
  qualification: "",
  rating: "",
  patients: "",
  fee: "",
  availabilityStart: "",
  availabilityEnd: "",
  location: "",
})
const handleEditDetails = () => {
  if (doctorDetails) {
    setFormData({
      userId: doctorDetails.userId || userId,
      name: doctorDetails.name || "",
      experience: doctorDetails.experience || "",
      specialization: doctorDetails.specialization || "",
      picture: doctorDetails.picture || null,
      qualification: doctorDetails.qualification || "",
      rating: doctorDetails.rating || "",
      patients: doctorDetails.patients || "",
      fee: doctorDetails.fee || "",
      availabilityStart: doctorDetails.availabilityStart || "09:00",
      availabilityEnd: doctorDetails.availabilityEnd || "17:00",
      location: doctorDetails.location || "",
      biography: doctorDetails.biography || ""
    });
    setImagePreview(doctorDetails.picture || null);
    setImage(null); // Reset the image state to avoid conflicts
  }
  setIsModalOpen(true);
};
  

  useEffect(() => {
    if (userId) {
      setFormData((prevState) => ({
        ...prevState,
        userId: userId,
      }))
    }
  }, [userId])

  const fetchAppointments = async () => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) return

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/bookings/getBookedTime.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, type: 3 }), 
      })

      if (!response.ok) {
        throw new Error("Failed to fetch appointments")
      }

      const data = await response.json()
      setAppointments({
        asDoctor: data.as_doctor || [],
        asPatient: data.as_patient || [],
      })
    } catch (error) {
      console.error("Error fetching appointments:", error)
      toast.error("Failed to load appointments")
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const uploadImageToCloudinary = async () => {
    if (!image) return null

    const formData = new FormData()
    formData.append("file", image)
    formData.append("upload_preset", "ml_default")

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY}/image/upload`, {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      return data.secure_url
    } catch (error) {
      console.error("Image upload failed", error)
      toast.error("Image upload failed.")
      return null
    }
  }

  const handleAddDetails = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    if (document.getElementById("modal")) {
      setIsModalOpen(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(formData);
    const imageUrl = await uploadImageToCloudinary()
    if (!imageUrl && !doctorDetails) return

    const updatedFormData = {
      ...formData,
      picture: doctorDetails.picture || imageUrl,
    }
    console.log(updatedFormData);
    try {
      setSaveDocLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/doctorData/addDoctors.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      })
      setSaveDocLoading(false)
      if (!response.ok) throw new Error("Failed to add doctor details")
      toast.success("Doctor details added successfully!", { position: "top-right", autoClose: 3000 , 
        onClose: () => window.location.reload()})
      handleCloseModal()
    } catch (error) {
      toast.error("Error adding doctor details. Please try again.", { position: "top-right" })
    }
  }

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")
    if (storedUserId) {
      setUserId(Number(storedUserId))
    }
  }, [])

  useEffect(() => {
    setEmail(localStorage.getItem("email") || "Unknown")
    setTime(localStorage.getItem("loginTime") || new Date())
    setUsername(localStorage.getItem("username") || "Anonymous User")
    const checkAuth = async () => {
      try {
        const userId = localStorage.getItem("userId")
        if (!userId) {
          setLoading(false)
          setCurrentUser(null)
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/checkSession.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        })

        if (!response.ok) throw new Error("Network response was not ok")

        const result = await response.json()
        if (result.success) {
          setCurrentUser(result)
          setIsDoctor(result.isDoctor == 1)
          if (result.isDoctor) {
            fetchDoctorDetails(userId)
          }
        } else {
          setCurrentUser(null)
        }
      } catch (error) {
        console.error("Failed to verify session:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  useEffect(() => {
    if (userId) {
      fetchAppointments()
    }
  }, [userId])

  const fetchDoctorDetails = async (userId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/doctorData/getDoctor.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })
      if (!response.ok) throw new Error("Failed to fetch doctor details")

      const doctorData = await response.json()

      if (doctorData.success) {
        setDoctorDetails(doctorData.doctor)

        if (doctorData.doctor.picture) {
          setImagePreview(doctorData.doctor.picture)
        }
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error)
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg"/>
  }
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hours24 = parseInt(hours, 10);
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 || 12; // Convert to 12-hour format
    return `${hours12}:${minutes} ${period}`;
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto mt-2 md:mt-0 px-4 py-8 md:py-12">
        <div className="mb-12 text-center">
          <h1 className={`${fugaz.className} text-5xl sm:text-6xl md:text-7xl mb-4`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              {isDoctor ? "Doctor" : "User"} Dashboard
            </span>
          </h1>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full"></div>
          
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-700 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
              <div
                className="absolute inset-0 opacity-30"
              ></div>
            </div>
            <div className="px-6 py-8 -mt-16">
              <div className="relative mb-6">
                <div className="h-32 w-32 mx-auto rounded-full overflow-hidden border-4 border-gray-800 shadow-lg bg-gray-700">
                  <img
                    src={
                      imagePreview ||
                      `https://ui-avatars.com/api/?name=${(username || "A").charAt(0)}&background=random&color=fff&size=200`
                    }
                    alt="Profile"
                    className="h-full w-full object-cover"
                    onError={(e) =>
                      (e.currentTarget.src = `https://ui-avatars.com/api/?name=${username.charAt(0) || "U"}&background=random&color=fff&size=200`)
                    }
                  />
                </div>
                {isDoctor && doctorDetails && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1.5 border-2 border-gray-800">
                    <Briefcase className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-1">{username}</h3>
                <p className="text-blue-400 mb-3">{email}</p>
                <div className="flex items-center justify-center text-sm text-gray-400 bg-gray-800 bg-opacity-50 py-2 px-3 rounded-full">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Last login: {new Date(time).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          </div>

          <div
            className={`lg:col-span-2 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-700 transform transition-all duration-300 hover:shadow-2xl`}
          >
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <span className="h-8 w-1 bg-blue-500 rounded-full mr-3"></span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  {isDoctor ? "Professional Profile" : "Your Appointments"}
                </span>
              </h2>

              {isDoctor && doctorDetails ? (
                <>
                <div className="flex flex-col md:flex-row justify-between md:items-center">
                <h3 className="text-2xl mb-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        {doctorDetails.name}
                      </h3>
                      <div className="flex mb-4">
                <button
                  onClick={handleEditDetails}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition duration-300"
                >
                  Edit Details
                </button>
              </div>
              </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">

                      <div className="bg-gray-700 bg-opacity-40 rounded-lg p-3 flex items-center">
                        <div className="bg-blue-500 bg-opacity-20 p-2 rounded-lg mr-3">
                          <Briefcase className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <span className="text-xs text-gray-400">Experience</span>
                          <p className="font-medium">{doctorDetails.experience} years</p>
                        </div>
                      </div>

                      <div className="bg-gray-700 bg-opacity-40 rounded-lg p-3 flex items-center">
                        <div className="bg-blue-500 bg-opacity-20 p-2 rounded-lg mr-3">
                          <Award className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <span className="text-xs text-gray-400">Specialization</span>
                          <p className="font-medium">{doctorDetails.specialization}</p>
                        </div>
                      </div>

                      <div className="bg-gray-700 bg-opacity-40 rounded-lg p-3 flex items-center">
                        <div className="bg-blue-500 bg-opacity-20 p-2 rounded-lg mr-3">
                          <GraduationCap className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <span className="text-xs text-gray-400">Qualification</span>
                          <p className="font-medium">{doctorDetails.qualification}</p>
                        </div>
                      </div>

                      <div className="bg-gray-700 bg-opacity-40 rounded-lg p-3 flex items-center">
                        <div className="bg-blue-500 bg-opacity-20 p-2 rounded-lg mr-3">
                          <MapPin className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <span className="text-xs text-gray-400">Location</span>
                          <p className="font-medium">{doctorDetails.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-700 bg-opacity-40 rounded-lg p-3 flex items-center">
                        <div className="bg-blue-500 bg-opacity-20 p-2 rounded-lg mr-3">
                          <Star className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <span className="text-xs text-gray-400">Rating</span>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">{doctorDetails.rating}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < Math.floor(doctorDetails.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-700 bg-opacity-40 rounded-lg p-3 flex items-center">
                        <div className="bg-blue-500 bg-opacity-20 p-2 rounded-lg mr-3">
                          <Users className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <span className="text-xs text-gray-400">Patients</span>
                          <p className="font-medium">{doctorDetails.patients}</p>
                        </div>
                      </div>

                      <div className="bg-gray-700 bg-opacity-40 rounded-lg p-3 flex items-center">
                        <div className="bg-blue-500 bg-opacity-20 p-2 rounded-lg mr-3">
                          <DollarSign className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <span className="text-xs text-gray-400">Consultation Fee</span>
                          <p className="font-medium">₹{doctorDetails.fee}</p>
                        </div>
                      </div>

                      <div className="bg-gray-700 bg-opacity-40 rounded-lg p-3 flex items-center">
                        <div className="bg-blue-500 bg-opacity-20 p-2 rounded-lg mr-3">
                          <Clock className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <span className="text-xs text-gray-400">Availability</span>
                          <p className="font-medium">
                            {formatTime(doctorDetails.availabilityStart)} to {formatTime(doctorDetails.availabilityEnd)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold flex items-center">
                        <div className="bg-blue-500 bg-opacity-20 p-2 rounded-lg mr-3">
                          <Users className="h-5 w-5 text-blue-400" />
                        </div>
                        Appointments With You
                      </h3>
                      <div className="bg-gray-700 bg-opacity-30 rounded-xl p-4">
                        <BookingList bookings={appointments.asDoctor} type="doctor" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-bold flex items-center">
                        <div className="bg-blue-500 bg-opacity-20 p-2 rounded-lg mr-3">
                          <Clock className="h-5 w-5 text-blue-400" />
                        </div>
                        Your Personal Appointments
                      </h3>
                      <div className="bg-gray-700 bg-opacity-30 rounded-xl p-4">
                        <BookingList bookings={appointments.asPatient} type="personal" />
                      </div>
                    </div>
                  </div>
                </>
              ) : isDoctor ? (
                <>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 mb-6">
                    <div className="h-full w-full rounded-full bg-gray-800 flex items-center justify-center">
                      <Briefcase className="h-12 w-12 text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    Complete Your Profile
                  </h3>
                  <p className="text-lg mb-8 text-gray-300 max-w-md">
                    Add your professional details to help patients find you and book appointments.
                  </p>
                  <button
                    onClick={handleAddDetails}
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition duration-300 transform hover:scale-105 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      <Briefcase className="h-5 w-5 mr-2" />
                      Add Your Details
                    </span>
                    <span className="absolute inset-0 bg-white bg-opacity-20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                  </button>
                </div>
                <div className="space-y-4">
                      <h3 className="text-xl font-bold flex items-center">
                        <div className="bg-blue-500 bg-opacity-20 p-2 rounded-lg mr-3">
                          <Clock className="h-5 w-5 text-blue-400" />
                        </div>
                        Your Personal Appointments
                      </h3>
                      <div className="bg-gray-700 bg-opacity-30 rounded-xl p-4">
                        <BookingList bookings={appointments.asPatient} type="personal" />
                      </div>
                    </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center mb-4">
                    </div>
                    <div className="bg-gray-700 bg-opacity-30 rounded-xl p-4">
                      <BookingList bookings={appointments.asPatient} type="personal" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          id="modal"
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 animate-[fadeIn_0.2s_ease-out]"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal()
          }}
        >
          <div className="bg-gray-800 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-700 p-6 rounded-xl shadow-2xl w-11/12 max-w-lg border border-gray-700 animate-[scaleIn_0.2s_ease-out] relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg mr-3">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  Add Your Doctor Details
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="h-8 w-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors hover:rotate-90 duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    placeholder="Dr. Akanksh Rakesh"
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Experience (years)</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    placeholder="10"
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
  <label className="block text-sm font-medium text-gray-300 mb-1">Specialization</label>
  <div className="relative">
    <input
      type="text"
      placeholder="Search specializations..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onFocus={() => setIsDropdownOpen(true)}
      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
    {isDropdownOpen && (
      <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto scrollbar-thin bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
        {filteredSpecialties.length > 0 ? (
          filteredSpecialties.map((specialty) => (
            <div
              key={specialty.id}
              className="px-4 py-3 hover:bg-blue-500 hover:text-white cursor-pointer flex items-center"
              onClick={() => {
                setFormData({...formData, specialization: specialty.name});
                setSearchTerm(specialty.name);
                setIsDropdownOpen(false);
              }}
            >
              <img 
                src={specialty.imagePath} 
                alt={specialty.name} 
                className="w-8 h-8 object-cover rounded-full bg-gray-200 p-1 mr-3"
                onError={(e) => {
                  e.target.src = '/placeholder.svg';
                }}
              />
              <div>
                <div className="font-medium">{specialty.name}</div>
                <div className="text-xs text-gray-400">{specialty.shortName}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-3 text-gray-400">No specializations found</div>
        )}
      </div>
    )}
  </div>
  <input
    type="hidden"
    name="specialization"
    value={formData.specialization}
  />
</div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    placeholder="MBBS, MD"
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Rating (out of 5)</label>
                  <input
                    type="number"
                    name="rating"
                    placeholder="4.5"
                    value={formData.rating}
                    min="1"
                    max="5"
                    step="0.1"
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Patients Treated</label>
                  <input
                    type="number"
                    name="patients"
                    placeholder="1000"
                    value={formData.patients}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Consultation Fee (₹)</label>
                <input
                  type="number"
                  name="fee"
                  placeholder="1500"
                  value={formData.fee}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Availability Hours</label>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-xs text-gray-400 mb-1">From</label>
                    <input
                      type="time"
                      name="availabilityStart"
                      value={formData.availabilityStart}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-500"
                      required
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs text-gray-400 mb-1">To</label>
                    <input
                      type="time"
                      name="availabilityEnd"
                      value={formData.availabilityEnd}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Upload Profile Image</label>
                <div className="mt-2 flex items-center">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white font-medium flex items-center transition-colors shadow-md hover:shadow-blue-500/20">
                      <Camera className="h-5 w-5 mr-2" />
                      Choose Image
                    </div>
                  </div>
                  {imagePreview && (
                    <div className="ml-4 relative h-16 w-16 rounded-full overflow-hidden border-2 border-blue-500 group">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <Camera className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Lucknow, UP"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Biography</label>
                <input
                  type="text"
                  name="biography"
                  placeholder="Tell us about you"
                  value={formData.biography}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`group relative px-6 py-3 bg-gradient-to-r ${saveDocloading ? 'disabled cursor-not-allowed' : ''} from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg transition-all hover:shadow-blue-500/20 overflow-hidden`}
                >
                  <span className="relative z-10 flex items-center">{!saveDocloading ?  'Save Details' : <LoadingSpinner/>}</span>
                  <span className="absolute inset-0 bg-white bg-opacity-20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .scrollbar-thin::-webkit-scrollbar {
          display: none;
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #374151;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
      `}</style>
    </div>
  )
}
