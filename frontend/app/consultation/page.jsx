"use client";
import React, { useEffect, useState } from "react";
import data from "@/components/data";
import { Calendar1, Mail, PhoneOutgoing, Smartphone } from "lucide-react";

const category = [
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Orthopedic Surgeon",
  "Pediatrician",
  "Psychiatrist",
  "Oncologist",
  "Endocrinologist",
  "Ophthalmologist",
];
function Page() {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(data[0]);

  useEffect(() => {
    const today = new Date();
    const upcomingDates = Array.from({ length: 5 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() + i);
      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        date: date.getDate(),
        fullDate: date.toISOString().split("T")[0],
      };
    });
    setDates(upcomingDates);
    setSelectedDate(upcomingDates[0].fullDate);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimes(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableTimes = async (date) => {
    try {
      // Simulated API response (replace with actual API call)
      let startTime = "20:57:15.000000";
      let endTime = "22:57:15.000000";
      generateTimeSlots(startTime, endTime);
    } catch (error) {
      console.error("Error fetching times:", error);
    }
  };

  const generateTimeSlots = (startTime, endTime) => {
    const slots = [];

    const parseTime = (timeStr) => {
      let [hours, minutes, seconds] = timeStr.split(":").map(Number);
      return new Date(1970, 0, 1, hours, minutes, seconds);
    };

    let current = parseTime(startTime);
    let end = parseTime(endTime);

    if (isNaN(current) || isNaN(end) || current >= end) {
      console.error("Invalid time range");
      return;
    }

    while (current <= end) {
      slots.push(current.toTimeString().slice(0, 5));
      current.setMinutes(current.getMinutes() + 30);
    }

    setAvailableTimes(slots);
  };

  const bookAppointment = async () => {
    try {
      const response = await axios.post("/api/book-appointment", {
        doctorId: selectedDoctor.id,
        date: selectedDate,
        time: selectedTime,
      });
      console.log("Appointment booked:", response.data);
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };
  return (
    <div className="px-6 flex flex-col-reverse pt-6 gap-3 bg-slate-100 md:flex-row h-screen overflow-y-hidden">
      <div className="flex flex-col gap-2">
        <p className="text-2xl font-semibold">Make appointment</p>
        <div className="bg-white px-5 py-3 rounded-xl space-y-3">
          <p className="text-lg font-semibold">Choose category</p>
          <div className="flex flex-wrap gap-3">
            {category.map((cat) => (
              <div key={cat} className="px-4 bg-blue-100 py-1 rounded-full">
                <p>{cat}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white px-5 py-3 rounded-xl space-y-3 w-full">
          <p className="text-lg font-semibold">Choose doctor</p>
          <div className="flex w-full gap-2">
            {data.slice(0, 2).map((dct) => (
              <div
                key={dct.name}
                className="flex items-center w-full border border-blue-700 px-2 py-1 gap-1 rounded-xl"
              >
                <img src={dct.image} alt="Doctor_Avtar" className="h-12 rounded-full" />
                <div className="-space-y-1">
                  <p className="font-semibold">{dct.name}</p>
                  <p className="text-xs text-slate-700">{dct.specialization}</p>
                  <p className="font-bold">{dct.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white shadow-lg p-6 rounded-xl space-y-3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-gray-600 font-medium">Choose date and time</h2>
            <span className="text-gray-500 flex items-center gap-1">
              <Calendar1 /> {selectedDate}
            </span>
          </div>
          <div className="flex flex-wrap justify-between">
            {dates.map(({ day, date, fullDate }) => (
              <button
                key={fullDate}
                onClick={() => setSelectedDate(fullDate)}
                className={`w-10 h-14 flex flex-col items-center justify-center rounded-lg text-gray-600 font-medium transition-all ${
                  fullDate === selectedDate ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                }`}
              >
                <span className="text-sm">{day}</span>
                <span className="text-lg">{date}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {availableTimes.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`p-2 text-sm rounded-lg border transition-all min-w-20 ${
                  time === selectedTime
                    ? "bg-blue-100 border-blue-500 text-blue-600"
                    : "border-gray-300 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
          <div className="bg-yellow-100 flex items-center justify-between px-4 rounded-lg border border-slate-950 py-1">
            <div className="font-semibold">
              {selectedDate} | {selectedTime}
            </div>
            <button
              onClick={bookAppointment}
              className="bg-lime-400 text-slate-900 font-bold tracking-wide py-2 px-4 rounded-lg hover:bg-lime-500 transition"
            >
              Pay {selectedDoctor.fee}/-
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 max-w-sm">
        <div className="flex flex-col items-center gap-1">
          <img src={selectedDoctor.image} alt="Doctor image" className="h-28 w-28 rounded-full" />
          <p className="text-2xl font-semibold">{selectedDoctor.name}</p>
          <p className="text-lg text-gray-600">{selectedDoctor.specialization}</p>
        </div>
        <div className="flex items-center space-x-6 text-lg text-slate-950">
          <Mail />
          <PhoneOutgoing />
          <Smartphone />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-bold">Biography</p>
          <p className="border-2 border-slate-950 border-double rounded-xl p-2">
            {selectedDoctor.bio}
          </p>
        </div>
        <div className="hidden">
          <p>Location</p>
          <div>map</div>
        </div>
      </div>
    </div>
  );
}

export default Page;
