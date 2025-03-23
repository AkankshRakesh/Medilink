"use client"
import { Fugaz_One } from "next/font/google"
import { useEffect, useState } from "react"
import Loading from "./Loading"
import { toast } from "react-toastify"

// Add these styles to your CSS or add them inline here
const styles = {
  "@keyframes fadeIn": {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  "@keyframes scaleIn": {
    from: { transform: "scale(0.95)", opacity: 0 },
    to: { transform: "scale(1)", opacity: 1 },
  },
}

// Add these utility classes
const utilityClasses = `
  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
  }
  .animate-scaleIn {
    animation: scaleIn 0.2s ease-out;
  }
`

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
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
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
      setFormData(prevState => ({
        ...prevState,
        userId: userId, // Update userId when it's available
      }));
    }
  }, [userId]);
const handleImageChange = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }
};

const uploadImageToCloudinary = async () => {
  if (!image) return null;

  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", "ml_default");   

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.secure_url; // Return Cloudinary image URL  
  } catch (error) {
    console.error("Image upload failed", error);
    toast.error("Image upload failed.");
    return null;
  }
};

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
    e.preventDefault();
  
    const imageUrl = await uploadImageToCloudinary(); // Upload first
    if (!imageUrl) return; // Stop if upload fails
  
    const updatedFormData = {
      ...formData,
      picture: imageUrl, // Use the uploaded image URL
    };
  
    try {
      console.log(updatedFormData);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/addDoctors.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });
  
      if (!response.ok) throw new Error("Failed to add doctor details");
      toast.success("Doctor details added successfully!", { position: "top-right", autoClose: 3000 });
      handleCloseModal(); // Close modal upon success
    } catch (error) {
      toast.error("Error adding doctor details. Please try again.", { position: "top-right" });
    }
  };
  
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(Number(storedUserId));
      console.log("Stored User ID:", storedUserId); // Log before updating state
    }
  }, []);
  useEffect(() => {
    console.log("Updated userId:", userId);
  }, [userId]); // This will log userId whenever it updates.
    

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
      console.log("Doctor Data:", doctorData)

      if (doctorData.success) {
        setDoctorDetails(doctorData.doctor);
  
        // Set image from Cloudinary URL
        if (doctorData.doctor.picture) {
          setImagePreview(doctorData.doctor.picture);
        }
      }
      if (doctorData.success) {
        setDoctorDetails(doctorData.doctor)
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <h4 className={"text-5xl sm:text-6xl md:text-7xl text-center " + fugaz.className}>
          <span className="textGradient">{isDoctor ? "Doctor" : "User"}</span> Dashboard
        </h4>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Grid Component - Profile Info */}
          <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-200">Profile Information</h2>
              <div className="flex items-center gap-4 mt-4">
                <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-300">
                  <img
                    src={
                      imagePreview  ||
                      `https://ui-avatars.com/api/?name=${(username || "A").charAt(0)}&background=random`
                    }
                    alt="Profile"
                    className="h-full w-full object-cover"
                    onError={(e) =>
                      (e.currentTarget.src = `https://ui-avatars.com/api/?name=${username.charAt(0) || "U"}&background=random`)
                    }
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white">{username}</h3>
                  <p className="text-gray-400">{email}</p>
                  <p className="text-sm text-gray-500">Last Login: {new Date(time).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Grid Component - Doctor Details */}
          <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-200">
                {isDoctor ? "Doctor Details" : "Activity Summary"}
              </h2>

              {isDoctor && doctorDetails ? (
                <div className="grid grid-cols-2 gap-4 text-gray-300">
                  <p className="col-span-2 text-2xl font-semibold text-white">{doctorDetails.name}</p>
                  <p>
                    <strong>Experience:</strong> {doctorDetails.experience} years
                  </p>
                  <p>
                    <strong>Specialization:</strong> {doctorDetails.specialization}
                  </p>
                  <p>
                    <strong>Qualification:</strong> {doctorDetails.qualification}
                  </p>
                  <p>
                    <strong>Rating:</strong> ⭐ {doctorDetails.rating}
                  </p>
                  <p>
                    <strong>Patients:</strong> {doctorDetails.patients}
                  </p>
                  <p>
                    <strong>Fee:</strong> ₹{doctorDetails.fee}
                  </p>
                  <p>
                    <strong>Availability:</strong> {doctorDetails.availabilityStart} - {doctorDetails.availabilityEnd}
                  </p>
                  <p className="col-span-2">
                    <strong>Location:</strong> {doctorDetails.location}
                  </p>
                </div>
              ) : isDoctor ? (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <p className="text-center">You haven't added your details yet.</p>
                  <button
                    onClick={handleAddDetails}
                    className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition duration-300"
                  >
                    Add Your Details
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-400">Track your progress and wellness journey:</p>
                  <ul className="space-y-2">
                    {["Monitor mood patterns", "Schedule appointments", "Access resources", "View history"].map(
                      (item, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-300">
                          <span className="h-2 w-2 rounded-full bg-blue-500" />
                          {item}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div
          id="modal"
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal()
          }}
        >
          <div className="bg-gray-900 max-h-[90vh] overflow-y-auto no-scrollbar p-6 rounded-xl shadow-2xl w-11/12 max-w-lg border border-gray-700 animate-scaleIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-white">Add Your Doctor Details</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Dr. John Doe"
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    placeholder="Cardiology"
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Availability Hours</label>
                <div className="flex gap-4 mb-4">
                  <div className="w-1/2">
                    <label className="block text-xs text-gray-400 mb-1">From</label>
                    <input
                      type="time"
                      name="availabilityStart"
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs text-gray-400 mb-1">To</label>
                    <input
                      type="time"
                      name="availabilityEnd"
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white"
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="mt-2 rounded-lg w-32 h-32 object-cover" />
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
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
                >
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

