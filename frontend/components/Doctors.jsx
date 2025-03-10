import { Fugaz_One, Open_Sans } from "next/font/google";

const opensans = Open_Sans({ subsets: ["latin"] });
const fugaz = Fugaz_One({ subsets: ["latin"], weight: ["400"] });

const data = [
  {
    name: "Dr. Aakash Raja",
    specialization: "General Practitioner",
    experience: "5 YEARS",
    qualification: "MBBS",
    location: "Lucknow",
    rating: "82%",
    patients: "25+ Patients",
    fee: 374,
    availability: "Available in 1 minute",
    image: "https://picsum.photos/200",
  },
  {
    name: "Dr. Kolli Mahesh",
    specialization: "General Practitioner",
    experience: "4 YEARS",
    qualification: "MD (PHYSICIAN)",
    location: "Chennai",
    rating: "87%",
    patients: "50+ Patients",
    fee: 374,
    availability: "Available in 1 minute",
    image: "https://picsum.photos/200",
  },
  {
    name: "Dr. Komirsetty Gayathri Naidu",
    specialization: "General Practitioner",
    experience: "6 YEARS",
    qualification: "MBBS",
    location: "Hyderabad",
    rating: "90%",
    patients: "40+ Patients",
    fee: 500,
    availability: "Available in 5 minutes",
    image: "https://picsum.photos/200",
  },
  {
    name: "Dr. Priya Sharma",
    specialization: "Internal Medicine Specialist",
    experience: "8 YEARS",
    qualification: "MD",
    location: "Delhi",
    rating: "95%",
    patients: "70+ Patients",
    fee: 600,
    availability: "Available in 2 minutes",
    image: "https://picsum.photos/200",
  },
  {
    name: "Dr. Ravi Kumar",
    specialization: "General Physician",
    experience: "3 YEARS",
    qualification: "MBBS",
    location: "Bangalore",
    rating: "80%",
    patients: "30+ Patients",
    fee: 300,
    availability: "Available in 3 minutes",
    image: "https://picsum.photos/200",
  },
  {
    name: "Dr. Anjali Verma",
    specialization: "Internal Medicine Specialist",
    experience: "7 YEARS",
    qualification: "MD",
    location: "Mumbai",
    rating: "92%",
    patients: "60+ Patients",
    fee: 550,
    availability: "Available in 1 minute",
    image: "https://picsum.photos/200",
  },
  {
    name: "Dr. Rajesh Mehta",
    specialization: "General Practitioner",
    experience: "2 YEARS",
    qualification: "MBBS",
    location: "Kolkata",
    rating: "78%",
    patients: "20+ Patients",
    fee: 250,
    availability: "Available in 4 minutes",
    image: "https://picsum.photos/200",
  },
  {
    name: "Dr. Sunita Patel",
    specialization: "General Physician",
    experience: "9 YEARS",
    qualification: "MD",
    location: "Ahmedabad",
    rating: "96%",
    patients: "80+ Patients",
    fee: 700,
    availability: "Available in 2 minutes",
    image: "https://picsum.photos/200",
  },
  {
    name: "Dr. Rohan Singh",
    specialization: "Internal Medicine Specialist",
    experience: "5 YEARS",
    qualification: "MBBS",
    location: "Pune",
    rating: "85%",
    patients: "45+ Patients",
    fee: 400,
    availability: "Available in 3 minutes",
    image: "https://picsum.photos/200",
  },
  {
    name: "Dr. Sneha Kapoor",
    specialization: "General Practitioner",
    experience: "6 YEARS",
    qualification: "MD",
    location: "Jaipur",
    rating: "88%",
    patients: "50+ Patients",
    fee: 450,
    availability: "Available in 1 minute",
    image: "https://picsum.photos/200",
  },
  {
    name: "Dr. Arvind Das",
    specialization: "General Physician",
    experience: "4 YEARS",
    qualification: "MBBS",
    location: "Chandigarh",
    rating: "83%",
    patients: "35+ Patients",
    fee: 375,
    availability: "Available in 2 minutes",
    image: "https://picsum.photos/200",
  },
  {
    name: "Dr. Neha Gupta",
    specialization: "Internal Medicine Specialist",
    experience: "10 YEARS",
    qualification: "MD",
    location: "Bhopal",
    rating: "97%",
    patients: "90+ Patients",
    fee: 800,
    availability: "Available in 1 minute",
    image: "https://picsum.photos/200",
  },
  {
    name: "Dr. Aman Roy",
    specialization: "General Practitioner",
    experience: "2 YEARS",
    qualification: "MBBS",
    location: "Patna",
    rating: "76%",
    patients: "18+ Patients",
    fee: 275,
    availability: "Available in 5 minutes",
    image: "https://picsum.photos/200",
  },
  {
    name: "Dr. Kritika Iyer",
    specialization: "General Physician",
    experience: "7 YEARS",
    qualification: "MD",
    location: "Nagpur",
    rating: "89%",
    patients: "55+ Patients",
    fee: 525,
    availability: "Available in 3 minutes",
    image: "https://picsum.photos/200",
  },
  {
    name: "Dr. Vishal Thakur",
    specialization: "Internal Medicine Specialist",
    experience: "6 YEARS",
    qualification: "MBBS",
    location: "Indore",
    rating: "84%",
    patients: "48+ Patients",
    fee: 410,
    availability: "Available in 2 minutes",
    image: "https://picsum.photos/200",
  },
];

const numberOfDoctor = 120;

function Doctors() {
    return (
        <div className="mt-2 px-4">
          <p className={"text-sky-600 text-xs"}>
            Home <i className="fa-solid fa-angle-right"></i> Doctors{" "}
            <i className="fa-solid fa-angle-right"></i> General Physicians{" "}
          </p>
    
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="flex md:flex-col flex-row gap-2 w-full md:w-1/4">
              <button className="flex items-center justify-between bg-sky-300/50 font-semibold tracking-wide px-4 py-2 rounded-md border border-sky-900">
                Availability<i className="fa-solid fa-angle-down"></i>
              </button>
              <button className="flex items-center justify-between font-semibold tracking-wide px-4 py-2 rounded-md border border-gray-400">
                Filter<i className="fa-solid fa-filter"></i>
              </button>
            </div>
    
            <div className="w-full md:w-3/4">
              <p className="my-5 font-bold text-xl tracking-wide">
                Consult General Physicians Online - Internal Medicine Specialists{" "}
                <span className="text-sm font-normal">{`(${numberOfDoctor} doctors)`}</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {data.map((item) => (
                  <div
                    key={item.name}
                    className="bg-white rounded-lg shadow-md w-full"
                  >
                    <div className="relative h-28 w-full rounded-t-lg overflow-hidden">
                      <img
                        src="https://res.cloudinary.com/dwl2op3oh/image/upload/f_auto,q_auto/v1741589372/uploads/tixujivmssdziw8jfc4u.jpg"
                        alt="Cover Photo"
                        className="w-full object-cover h-full"
                      />
                    </div>
                    <div className="flex ml-4 -mt-12">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 rounded-full border-2 border-slate-800 shadow-md z-10"
                      />
                    </div>
                    <div className="flex w-full justify-between px-4 items-center mt-3 pb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{item.name}</h3>
                        <p className="text-gray-600 text-sm">{item.specialization}</p>
                        <p className="text-slate-800 font-medium">
                          {item.experience} • {item.qualification}
                        </p>
                        <p className="text-sm text-gray-500">{item.location}</p>
                        <p className="text-green-600 text-sm">
                          <i className="fa-solid fa-thumbs-up"></i> {item.rating} ({item.patients})
                        </p>
                      </div>
                      <div className="flex flex-col items-center">
                        <p className="text-lg font-bold text-gray-800">₹{item.fee}</p>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg mt-2 hover:bg-blue-700 transition">
                          Digital Consult
                        </button>
                        <p className="text-sm text-gray-500 mt-2">{item.availability}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
}

export default Doctors;
