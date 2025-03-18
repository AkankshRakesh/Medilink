"use client";
import { useState } from "react";
import data from "./data";

const filtersData = {
  experience: ["0-5", "6-10", "11+"],
  fees: ["100-500", "500-1000", "1000+"],
  languages: ["English", "Hindi", "Telugu"],
};

function Doctors() {
  const [selectedFilters, setSelectedFilters] = useState({
    experience: [],
    fees: [],
    languages: [],
  });

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const toggleFilter = (category, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      experience: [],
      fees: [],
      languages: [],
    });
  };

  const filterDoctors = (doctors) => {
    return doctors.filter((doctor) => {
      // Filter by experience
      const experienceMatch =
        selectedFilters.experience.length === 0 ||
        selectedFilters.experience.some((range) => {
          const [min, max] = range.split("-").map(Number);
          return (
            doctor.experience >= min &&
            (max ? doctor.experience <= max : doctor.experience >= min)
          );
        });

      // Filter by fees
      const feesMatch =
        selectedFilters.fees.length === 0 ||
        selectedFilters.fees.some((range) => {
          if (range === "1000+") {
            return doctor.fee >= 1000;
          } else {
            const [min, max] = range.split("-").map(Number);
            return doctor.fee >= min && doctor.fee <= max;
          }
        });

      // Filter by languages
      const languageMatch =
        selectedFilters.languages.length === 0 ||
        selectedFilters.languages.some((lang) =>
          doctor.languages.includes(lang)
        );

      return experienceMatch && feesMatch && languageMatch;
    });
  };

  const filteredDoctors = filterDoctors(data);

  return (
    <div className="mt-2 px-4 h-[calc(100vh-2rem)] flex flex-col">
      <p className="text-sky-600 text-xs">
        Home <i className="fa-solid fa-angle-right"></i> Doctors{" "}
        <i className="fa-solid fa-angle-right"></i> General Physicians{" "}
      </p>

      <div className="flex flex-col md:flex-row gap-4 mt-4 h-full">
        {/* Filters Section */}
        <div className="w-full md:w-1/4">
          {/* Filters Toggle Button for Small Screens */}
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="md:hidden w-full bg-sky-600 text-white py-2 rounded-lg mb-4"
          >
            {isFiltersOpen ? "Hide Filters" : "Show Filters"}
          </button>

          {/* Filters Dropdown for Small Screens */}
          <div
            className={`${
              isFiltersOpen ? "block" : "hidden"
            } md:block md:relative md:top-0 md:left-0 md:bg-transparent md:shadow-none md:rounded-none md:p-0 bg-white shadow-md rounded-lg p-4`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sky-600 font-semibold"
              >
                Clear All
              </button>
            </div>

            {/* Experience Filter */}
            <div className="mt-4">
              <h3 className="font-semibold">Experience (In Years)</h3>
              {filtersData.experience.map((item) => (
                <label key={item} className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={selectedFilters.experience.includes(item)}
                    onChange={() => toggleFilter("experience", item)}
                  />
                  {item}
                </label>
              ))}
            </div>

            {/* Fees Filter */}
            <div className="mt-4">
              <h3 className="font-semibold">Fees (In Rupees)</h3>
              {filtersData.fees.map((item) => (
                <label key={item} className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={selectedFilters.fees.includes(item)}
                    onChange={() => toggleFilter("fees", item)}
                  />
                  {item}
                </label>
              ))}
            </div>

            {/* Language Filter */}
            <div className="mt-4">
              <h3 className="font-semibold">Language</h3>
              {filtersData.languages.map((item) => (
                <label key={item} className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={selectedFilters.languages.includes(item)}
                    onChange={() => toggleFilter("languages", item)}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Doctors List Section */}
        <div className="w-full md:w-3/4 h-full overflow-y-auto">
          <p className="my-5 font-bold text-xl tracking-wide">
            Consult General Physicians Online - Internal Medicine Specialists
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.name} doctor={doctor} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const DoctorCard = ({ doctor }) => (
  <div className="bg-white rounded-lg shadow-md w-full">
    <div className="relative h-28 w-full rounded-t-lg overflow-hidden">
      <img
        src="https://res.cloudinary.com/dwl2op3oh/image/upload/f_auto,q_auto/v1741589372/uploads/tixujivmssdziw8jfc4u.jpg"
        alt="Cover Photo"
        className="w-full object-cover h-full"
      />
    </div>
    <div className="flex ml-4 -mt-12">
      <img
        src={doctor.image}
        alt={doctor.name}
        className="w-24 h-24 rounded-full border-2 border-slate-800 shadow-md z-10"
      />
    </div>
    <div className="flex w-full justify-between px-4 items-center mt-3 pb-4">
      <div>
        <h3 className="text-xl font-semibold">{doctor.name}</h3>
        <p className="text-gray-600 text-sm">{doctor.specialization}</p>
        <p className="text-slate-800 font-medium">
          {doctor.experience} YEARS • {doctor.qualification}
        </p>
        <p className="text-sm text-gray-500">{doctor.location}</p>
        <p className="text-green-600 text-sm">
          <i className="fa-solid fa-thumbs-up"></i> {doctor.rating}% (
          {doctor.patients}+ Patients)
        </p>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-lg font-bold text-gray-800">₹{doctor.fee}</p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg mt-2 hover:bg-blue-700 transition">
          Digital Consult
        </button>
        <p className="text-sm text-gray-500 mt-2">{doctor.availability}</p>
      </div>
    </div>
  </div>
);

export default Doctors;