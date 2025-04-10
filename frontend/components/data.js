const data = [
  {
    name: "Dr. Aakash Raja",
    specialization: "General Practitioner",
    experience: 5,
    qualification: "MBBS",
    location: "Lucknow",
    bio: "Dr. Aakash Raja is a dedicated physician specializing in patient-centered care. With expertise in diagnosing and treating complex conditions, he prioritizes compassionate healthcare. Passionate about medical research, he continuously advances his knowledge to provide the best possible treatments for his patients.",
    rating: 4.5,
    patients: 25,
    fee: 374,
    availability: "Available in 1 minute",
    image: "https://picsum.photos/200",
    languages: ["English", "Hindi"],
  },
  {
    name: "Dr. Kolli Mahesh",
    specialization: "General Practitioner",
    experience: 4,
    qualification: "MD (PHYSICIAN)",
    location: "Chennai",
    rating: 4,
    patients: 50,
    fee: 374,
    availability: "Available in 1 minute",
    image: "https://picsum.photos/200",
    languages: ["English", "Telugu"],
  },
  {
    name: "Dr. Komirsetty Gayathri Naidu",
    specialization: "General Practitioner",
    experience: 6,
    qualification: "MBBS",
    location: "Hyderabad",
    rating: 4.9,
    patients: 40,
    fee: 500,
    availability: "Available in 5 minutes",
    image: "https://picsum.photos/200",
    languages: ["English", "Telugu"],
  },
  {
    name: "Dr. Priya Sharma",
    specialization: "Internal Medicine Specialist",
    experience: 8,
    qualification: "MD",
    location: "Delhi",
    rating: 4.1,
    patients: 70,
    fee: 600,
    availability: "Available in 2 minutes",
    image: "https://picsum.photos/200",
    languages: ["English", "Hindi"],
  },
  {
    name: "Dr. Ravi Kumar",
    specialization: "General Physician",
    experience: 3,
    qualification: "MBBS",
    location: "Bangalore",
    rating: 80,
    patients: 30,
    fee: 300,
    availability: "Available in 3 minutes",
    image: "https://picsum.photos/200",
    languages: ["English", "Kannada"],
  },
  {
    name: "Dr. Anjali Verma",
    specialization: "Internal Medicine Specialist",
    experience: 7,
    qualification: "MD",
    location: "Mumbai",
    rating: 92,
    patients: 60,
    fee: 550,
    availability: "Available in 1 minute",
    image: "https://picsum.photos/200",
    languages: ["English", "Hindi", "Marathi"],
  },
  {
    name: "Dr. Rajesh Mehta",
    specialization: "General Practitioner",
    experience: 2,
    qualification: "MBBS",
    location: "Kolkata",
    rating: 78,
    patients: 20,
    fee: 250,
    availability: "Available in 4 minutes",
    image: "https://picsum.photos/200",
    languages: ["English", "Bengali"],
  },
  {
    name: "Dr. Sunita Patel",
    specialization: "General Physician",
    experience: 9,
    qualification: "MD",
    location: "Ahmedabad",
    rating: 96,
    patients: 80,
    fee: 700,
    availability: "Available in 2 minutes",
    image: "https://picsum.photos/200",
    languages: ["English", "Gujarati"],
  },
  {
    name: "Dr. Rohan Singh",
    specialization: "Internal Medicine Specialist",
    experience: 5,
    qualification: "MBBS",
    location: "Pune",
    rating: 85,
    patients: 45,
    fee: 400,
    availability: "Available in 3 minutes",
    image: "https://picsum.photos/200",
    languages: ["English", "Hindi", "Marathi"],
  },
  {
    name: "Dr. Sneha Kapoor",
    specialization: "General Practitioner",
    experience: 6,
    qualification: "MD",
    location: "Jaipur",
    rating: 88,
    patients: 50,
    fee: 450,
    availability: "Available in 1 minute",
    image: "https://picsum.photos/200",
    languages: ["English", "Hindi"],
  },
  {
    name: "Dr. Arvind Das",
    specialization: "General Physician",
    experience: 4,
    qualification: "MBBS",
    location: "Chandigarh",
    rating: 83,
    patients: 35,
    fee: 375,
    availability: "Available in 2 minutes",
    image: "https://picsum.photos/200",
    languages: ["English", "Hindi", "Punjabi"],
  },
  {
    name: "Dr. Neha Gupta",
    specialization: "Internal Medicine Specialist",
    experience: 10,
    qualification: "MD",
    location: "Bhopal",
    rating: 97,
    patients: 90,
    fee: 800,
    availability: "Available in 1 minute",
    image: "https://picsum.photos/200",
    languages: ["English", "Hindi"],
  },
  {
    name: "Dr. Aman Roy",
    specialization: "General Practitioner",
    experience: 2,
    qualification: "MBBS",
    location: "Patna",
    rating: 76,
    patients: 18,
    fee: 275,
    availability: "Available in 5 minutes",
    image: "https://picsum.photos/200",
    languages: ["English", "Hindi"],
  },
  {
    name: "Dr. Kritika Iyer",
    specialization: "General Physician",
    experience: 7,
    qualification: "MD",
    location: "Nagpur",
    rating: 89,
    patients: 55,
    fee: 525,
    availability: "Available in 3 minutes",
    image: "https://picsum.photos/200",
    languages: ["English", "Hindi", "Marathi"],
  },
  {
    name: "Dr. Vishal Thakur",
    specialization: "Internal Medicine Specialist",
    experience: 6,
    qualification: "MBBS",
    location: "Indore",
    rating: 84,
    patients: 48,
    fee: 410,
    availability: "Available in 2 minutes",
    image: "https://picsum.photos/200",
    languages: ["English", "Hindi"],
  },
  {
    name: "Dr. Ananya Reddy",
    specialization: "General Practitioner",
    experience: 3,
    qualification: "MBBS",
    location: "Vizag",
    rating: 81,
    patients: 22,
    fee: 350,
    availability: "Available in 4 minutes",
    image: "https://picsum.photos/200",
    languages: ["English", "Telugu"],
  },
  {
    name: "Dr. Sameer Joshi",
    specialization: "General Physician",
    experience: 8,
    qualification: "MD",
    location: "Nashik",
    rating: 91,
    patients: 65,
    fee: 600,
    availability: "Available in 2 minutes",
    image: "https://picsum.photos/200",
    languages: ["English", "Marathi"],
  },
  {
    name: "Dr. Kavita Desai",
    specialization: "Internal Medicine Specialist",
    experience: 11,
    qualification: "MD",
    location: "Surat",
    rating: 98,
    patients: 95,
    fee: 850,
    availability: "Available in 1 minute",
    image: "https://picsum.photos/200",
    languages: ["English", "Gujarati"],
  },
  {
    name: "Dr. Vikram Singh",
    specialization: "General Practitioner",
    experience: 4,
    qualification: "MBBS",
    location: "Jaipur",
    rating: 79,
    patients: 28,
    fee: 325,
    availability: "Available in 3 minutes",
    image: "https://picsum.photos/200",
    languages: ["English", "Hindi"],
  },
  {
    name: "Dr. Meera Nair",
    specialization: "General Physician",
    experience: 9,
    qualification: "MD",
    location: "Kochi",
    rating: 94,
    patients: 75,
    fee: 750,
    availability: "Available in 2 minutes",
    image: "https://picsum.photos/200",
    languages: ["English", "Malayalam"],
  },
];

export default data;
