'use client'
import React, {useState, useMemo} from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "./ui/dropdown-menu"

  import { Button } from "./ui/button"


    //state_management
    export default function FindDoc() {

    const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false); 
    const [date, setDate] = useState('');
    const [selectedSpecialty, setSpecialty] = useState('');
    const [selectedLanguage, setLang] = useState('');

    const specialties = [
        {key: "general_physician", label: "General Physician"},
        {key: "dermatology", label: "Dermatology"},
        {key: "gynecology", label: "Obstetrics & Gynaecology"},
        {key: "orthopedics", label: "Orthopaedics"},
        {key: "ent", label: "ENT"},
        {key: "neurology", label: "Neurology"},
        {key: "cardiology", label: "Cardiology"},
        {key: "urology", label: "Urology"}
    ];

    const languages = [
        {key: "english", label: "English"},
        {key: "hindi", label: "Hindi"},
        {key: "tamil", label: "Tamil"},
        {key: "telugu", label: "Telugu"},
        {key: "malayalam", label: "Malayalam"},
        {key: "kannada", label: "Kannada"}
    ];

    const selectedSpecialtyLabel = useMemo(() => {
        return specialties.find((item) => item.key === selectedSpecialty)?.label || "";
      }, [selectedSpecialty]);
    
    const selectedLanguageLabel = useMemo(() => {
        return languages.find((item) => item.key === selectedLanguage)?.label || "";
    }, [selectedLanguage]);


    //submission_handler
        const handleSubmit = (event) => {
            event.preventDefault();
            console.log('Specialty:', selectedSpecialtyLabel);
            console.log('Date:', date);
            console.log('Language:', selectedLanguageLabel);
        };

    return(
        <div className="bg-white p-8 rounded-lg shadow-lg mx-6 -mt-8 mb-8 relative z-10 transition-shadow duration-300 ease-in-out hover:shadow-[0_0_20px_8px_rgba(59,130,246,0.5)]">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                <span> <span className="text-blue-500">Minutes Matter!</span> Just 3 Steps away from</span> 
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-8 h-8 text-blue-500" fill="currentColor"> 
                <path d="M142.4 21.9c5.6 16.8-3.5 34.9-20.2 40.5L96 71.1 96 192c0 53 43 96 96 96s96-43 96-96l0-120.9-26.1-8.7c-16.8-5.6-25.8-23.7-20.2-40.5s23.7-25.8 40.5-20.2l26.1 8.7C334.4 19.1 352 43.5 352 71.1L352 192c0 77.2-54.6 141.6-127.3 156.7C231 404.6 278.4 448 336 448c61.9 0 112-50.1 112-112l0-70.7c-28.3-12.3-48-40.5-48-73.3c0-44.2 35.8-80 80-80s80 35.8 80 80c0 32.8-19.7 61-48 73.3l0 70.7c0 97.2-78.8 176-176 176c-92.9 0-168.9-71.9-175.5-163.1C87.2 334.2 32 269.6 32 192L32 71.1c0-27.5 17.6-52 43.8-60.7l26.1-8.7c16.8-5.6 34.9 3.5 40.5 20.2zM480 224a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">

                    <div className="flex flex-col w-full md:w-1/3 font-semibold">
                        <label className="font-semibold text-gray-800 mb-2">
                            Speciality <span className="text-red-500">*</span>
                        </label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-gray-600  py-6 rounded-lg">
                                    {selectedSpecialtyLabel || "Choose Speciality"}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Specialities</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {specialties.map((spec) => (
                                    <DropdownMenuItem 
                                        key={spec.key}
                                        onClick={() => setSpecialty(spec.key)}
                                    >
                                        {spec.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>


                <div className="flex flex-col w-full md:w-1/3 font-semibold gap-2">
                    <label>
                        Languages <span className="text-red-500">*</span>
                    </label>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full flex items-center justify-start py-6 text-gray-600 gap-2 rounded-lg">
                                {selectedLanguageLabel || "Choose Language"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Languages</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {languages.map((lang) => (
                                <DropdownMenuItem 
                                    key={lang.key}
                                    onClick={() => setLang(lang.key)}
                                >
                                    {lang.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    </div>


                 <div className="flex flex-col w-full md:w-1/3">
                    <label className="font-semibold text-gray-800 mb-2">
                        Select Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                        className="border border-gray-300 rounded-lg p-3 focus:outline-none hover:bg-gray-50 text-gray-500"
                        required
                    />
                </div>

                <div className="flex w-full md:w-auto justify-center md:justify-end mt-4 md:mt-0">
                    <Button
                        type="submit"
                        className="text-white bg-[#4C6FFF] p-5 rounded-xl font-semibold w-full md:w-auto"                    
                    >
                        Submit
                    </Button>
                </div>

            </form>
        </div> 
    );
}
