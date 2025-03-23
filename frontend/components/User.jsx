"use client"
import { Fugaz_One } from "next/font/google"
import { useEffect, useState } from "react"
import Loading from "./Loading"
import { toast } from "react-toastify"
import { Camera, Star, Users, Clock, MapPin, Award, Briefcase, GraduationCap, DollarSign } from "lucide-react"

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

  useEffect(() => {
    if (userId) {
      setFormData((prevState) => ({
        ...prevState,
        userId: userId,
      }))
    }
  }, [userId])

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

    const imageUrl = await uploadImageToCloudinary()
    if (!imageUrl) return

    const updatedFormData = {
      ...formData,
      picture: imageUrl,
    }

    try {
      console.log(updatedFormData)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/addDoctors.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      })

      if (!response.ok) throw new Error("Failed to add doctor details")
      toast.success("Doctor details added successfully!", { position: "top-right", autoClose: 3000 })
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

  const fetchDoctorDetails = async (userId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/getDoctor.php`, {
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
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header with gradient text */}
        <div className="mb-12 text-center">
          <h1 className={`${fugaz.className} text-5xl sm:text-6xl md:text-7xl mb-4`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              {isDoctor ? "Doctor" : "User"} Dashboard
            </span>
          </h1>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full"></div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-700 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="h-24 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            <div className="px-6 py-8 -mt-16">
              <div className="relative mb-6">
                <div className="h-32 w-32 mx-auto rounded-full overflow-hidden border-4 border-gray-800 shadow-lg">
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
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-1">{username}</h3>
                <p className="text-blue-400 mb-3">{email}</p>
                <div className="flex items-center justify-center text-sm text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Last login: {new Date(time).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor Details or Activity Card */}
          <div
            className={`${isDoctor ? "lg:col-span-2" : ""} bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-700 transform transition-all duration-300 hover:shadow-2xl`}
          >
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <span className="h-8 w-1 bg-blue-500 rounded-full mr-3"></span>
                {isDoctor ? "Professional Profile" : "Activity Summary"}
              </h2>

              {isDoctor && doctorDetails ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                      {doctorDetails.name}
                    </h3>

                    <div className="flex items-center">
                      <Briefcase className="h-5 w-5 text-blue-400 mr-2" />
                      <span className="font-medium">Experience:</span>
                      <span className="ml-2">{doctorDetails.experience} years</span>
                    </div>

                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-blue-400 mr-2" />
                      <span className="font-medium">Specialization:</span>
                      <span className="ml-2">{doctorDetails.specialization}</span>
                    </div>

                    <div className="flex items-center">
                      <GraduationCap className="h-5 w-5 text-blue-400 mr-2" />
                      <span className="font-medium">Qualification:</span>
                      <span className="ml-2">{doctorDetails.qualification}</span>
                    </div>

                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-blue-400 mr-2" />
                      <span className="font-medium">Location:</span>
                      <span className="ml-2">{doctorDetails.location}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 mr-2" />
                      <span className="font-medium">Rating:</span>
                      <div className="ml-2 flex items-center">
                        <span className="mr-1">{doctorDetails.rating}</span>
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

                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-blue-400 mr-2" />
                      <span className="font-medium">Patients:</span>
                      <span className="ml-2">{doctorDetails.patients}</span>
                    </div>

                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-blue-400 mr-2" />
                      <span className="font-medium">Fee:</span>
                      <span className="ml-2">₹{doctorDetails.fee}</span>
                    </div>

                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-blue-400 mr-2" />
                      <span className="font-medium">Availability:</span>
                      <span className="ml-2">
                        {doctorDetails.availabilityStart} - {doctorDetails.availabilityEnd}
                      </span>
                    </div>
                  </div>
                </div>
              ) : isDoctor ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="h-20 w-20 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center mb-4">
                    <Briefcase className="h-10 w-10 text-blue-400" />
                  </div>
                  <p className="text-lg mb-6">You haven't added your professional details yet.</p>
                  <button
                    onClick={handleAddDetails}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
                  >
                    Add Your Details
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-lg">Track your progress and wellness journey:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { icon: <Star className="h-5 w-5" />, text: "Monitor mood patterns" },
                      { icon: <Clock className="h-5 w-5" />, text: "Schedule appointments" },
                      { icon: <Award className="h-5 w-5" />, text: "Access resources" },
                      { icon: <Users className="h-5 w-5" />, text: "View history" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center p-4 bg-gray-700 bg-opacity-40 rounded-xl">
                        <div className="h-10 w-10 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center mr-3">
                          {item.icon}
                        </div>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding doctor details */}
      {isModalOpen && (
        <div
          id="modal"
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 animate-[fadeIn_0.2s_ease-out]"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal()
          }}
        >
          <div className="bg-gray-800 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-700 p-6 rounded-xl shadow-2xl w-11/12 max-w-lg border border-gray-700 animate-[scaleIn_0.2s_ease-out]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Add Your Doctor Details
              </h2>
              <button
                onClick={handleCloseModal}
                className="h-8 w-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
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
                    placeholder="Dr. John Doe"
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Experience (years)</label>
                  <input
                    type="number"
                    name="experience"
                    placeholder="10"
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    placeholder="Cardiology"
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    placeholder="MBBS, MD"
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    min="1"
                    max="5"
                    step="0.1"
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Patients Treated</label>
                  <input
                    type="number"
                    name="patients"
                    placeholder="1000"
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs text-gray-400 mb-1">To</label>
                    <input
                      type="time"
                      name="availabilityEnd"
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    <div className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium flex items-center transition-colors">
                      <Camera className="h-5 w-5 mr-2" />
                      Choose Image
                    </div>
                  </div>
                  {imagePreview && (
                    <div className="ml-4 relative h-16 w-16 rounded-full overflow-hidden border-2 border-blue-500">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="123 Medical Center, City"
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg transition-all hover:shadow-blue-500/20"
                >
                  Save Details
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
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #374151;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #2563eb;
        }
      `}</style>
    </div>
  )
}

