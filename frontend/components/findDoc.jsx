'use client'
import React, {useState, useMemo} from 'react';
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@heroui/react";
import {DatePicker} from "@heroui/react";

export default function FindDoc() {
    // Add new state for dropdown visibilityz
    const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    
    // State variables
    const [date, setDate] = useState('');
    const [specialty, setSpecialty] = useState(new Set([]));
    const [lang, setLang] = useState(new Set([]));

    const doctors = [
        {key: "general_physician", label: "General Physician"},
        {key: "dermatology", label: "Dermatology"},
        {key: "gynecology", label: "Obstetrics & Gynaecology"},
        {key: "orthopedics", label: "Orthopaedics"},
        {key: "ent", label: "ENT"},
        {key: "neurology", label: "Neurology"},
        {key: "cardiology", label: "Cardiology"},
        {key: "urology", label: "Urology"}
    ];

    const langs = [
        {key: "english", label: "English"},
        {key: "hindi", label: "Hindi"},
        {key: "tamil", label: "Tamil"},
        {key: "telugu", label: "Telugu"},
        {key: "malayalam", label: "Malayalam"},
        {key: "kannada", label: "Kannada"}
    ];

    const specialtyValue = useMemo(
        () => Array.from(specialty).map(key => 
            doctors.find(doc => doc.key === key)?.label || key
        ).join(", "),
        [specialty]
    );

    const langValue = useMemo(
        () => Array.from(lang).map(key => 
            langs.find(l => l.key === key)?.label || key
        ).join(", "),
        [lang]
    );

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Speciality:', specialtyValue);
        console.log('Date:', date);
        console.log('Language:', langValue);
    };

    const handleDropdownClick = async (elementId, setIsOpen) => {
        const element = document.getElementById(elementId);
        if (element) {
            const yOffset = -150; // Increased offset for better visibility
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            
            // Close dropdown, scroll, then open
            setIsOpen(false);
            await new Promise((resolve) => {
                window.scrollTo({ 
                    top: y, 
                    behavior: 'smooth' 
                });
                setTimeout(() => {
                    setIsOpen(true);
                    resolve();
                }, 300); // Reduced timeout for better responsiveness
            });
        }
    };

    return(
        <div className="bg-white p-8 rounded-lg shadow-md mx-6 -mt-8 mb-8 relative z-10">
            <h2 className="text-3xl font-bold text-gray-900">
                Minutes Matter! Book in 3 Steps
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col w-full md:w-1/3" id="specialty-dropdown">
                    <label className="font-semibold text-gray-800 mb-2">
                        Select Speciality <span className="text-red-500">*</span>
                    </label>
                    <Dropdown 
                        isOpen={isSpecialtyOpen}
                        onOpenChange={setIsSpecialtyOpen}
                    >
                        <DropdownTrigger>
                            <Button 
                                className="w-full border border-gray-300 rounded-lg p-3 bg-white text-left capitalize hover:bg-gray-50 flex justify-start"
                                variant="bordered"
                                onClick={() => handleDropdownClick('specialty-dropdown', setIsSpecialtyOpen)}
                            >
                                {specialtyValue || "Choose Speciality"}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            className="w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-[300px] overflow-y-auto mt-1"
                            disallowEmptySelection
                            aria-label="Select speciality"
                            selectedKeys={specialty}
                            selectionMode="single"
                            onSelectionChange={setSpecialty}
                            placement="bottom"
                            offset={8}
                        >
                            {doctors.map((spec) => (
                                <DropdownItem 
                                    key={spec.key}
                                    className="hover:bg-gray-100 px-4 py-2 cursor-pointer"
                                >
                                    {spec.label}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                </div>

                 <div className="flex flex-col w-full md:w-1/3">
                    <label className="font-semibold text-gray-800 mb-2">
                        Select Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border border-gray-300 rounded-lg p-3 focus:outline-none hover:bg-gray-50"
                        required
                    />
                </div>
                <div className="flex flex-col w-full md:w-1/3" id="language-dropdown">
                    <label className="font-semibold text-gray-800 mb-2">
                        Select Language <span className="text-red-500">*</span>
                    </label>
                    <Dropdown 
                        isOpen={isLanguageOpen}
                        onOpenChange={setIsLanguageOpen}
                    >
                        <DropdownTrigger>
                            <Button 
                                className="w-full border border-gray-300 rounded-lg p-3 bg-white text-left capitalize hover:bg-gray-50 flex justify-start"
                                variant="bordered"
                                onClick={() => handleDropdownClick('language-dropdown', setIsLanguageOpen)}
                            >
                                {langValue || "Choose Language"}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            className="w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-[300px] overflow-y-auto mt-1"
                            disallowEmptySelection
                            aria-label="Select language"
                            selectedKeys={lang}
                            selectionMode="single"
                            onSelectionChange={setLang}
                            placement="bottom"
                            offset={8}
                        >
                            {langs.map((lang) => (
                                <DropdownItem 
                                    key={lang.key}
                                    className="hover:bg-gray-100 px-4 py-2 cursor-pointer"
                                >
                                    {lang.label}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </form>
        </div>
    );
}
