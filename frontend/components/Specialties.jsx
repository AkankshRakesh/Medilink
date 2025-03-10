'use client'
import React from 'react';
import generalphys from '../public/Specs/general.webp';
import derma from '../public/Specs/derma.webp';
import obsgyn from '../public/Specs/obsgyn.webp';
import ortho from '../public/Specs/ortho.webp';
import ent from '../public/Specs/ent.webp';
import neuro from '../public/Specs/neuro.webp';
import cardio from '../public/Specs/cardio.webp';
import uro from '../public/Specs/uro.webp';
import gastro from '../public/Specs/gastro.webp';
import psychi from '../public/Specs/psychi.webp';
import paedi from '../public/Specs/paedi.webp';
import respi from '../public/Specs/respi.webp';
import endo from '../public/Specs/endo.webp';
import nephro from '../public/Specs/nephro.webp';
import neurosurg from '../public/Specs/neurosurg.webp';
import rheu from '../public/Specs/rheu.webp';
import oph from '../public/Specs/oph.webp';
import gastrosurg from '../public/Specs/gastrosurg.webp';
import infect from '../public/Specs/infect.webp';
import lap from '../public/Specs/lap.webp';
import psycho from '../public/Specs/psycho.webp';
import onco from '../public/Specs/onco.webp';
import diab from '../public/Specs/diab.webp';
import dent from '../public/Specs/dent.webp';
import Image from 'next/image';
import Link from 'next/link';
const specialties = [
  { id: 1, name: 'General Physician', shortName: 'General Physician', image: generalphys },
  { id: 2, name: 'Dermatology', shortName: 'Dermatology', image: derma },
  { id: 3, name: 'Obstetrics & Gynaecology', shortName: 'Obs & Gyn', image: obsgyn },
  { id: 4, name: 'Orthopaedics', shortName: 'Orthopaedics', image: ortho },
  { id: 5, name: 'ENT', shortName: 'ENT', image: ent },
  { id: 6, name: 'Neurology', shortName: 'Neurology', image: neuro },
  { id: 7, name: 'Cardiology', shortName: 'Cardiology', image: cardio },
  { id: 8, name: 'Urology', shortName: 'Urology', image: uro },
  { id: 9, name: 'Gastroenterology/GI medicine', shortName: 'Gastro', image: gastro },
  { id: 10, name: 'Psychiatry', shortName: 'Psychiatry', image: psychi },
  { id: 11, name: 'Paediatrics', shortName: 'Paediatrics', image: paedi },
  { id: 12, name: 'Pulmonology/Respiratory', shortName: 'Pulmonology', image: respi },
  { id: 13, name: 'Endocrinology', shortName: 'Endocrinology', image: endo },
  { id: 14, name: 'Nephrology', shortName: 'Nephrology', image: nephro },
  { id: 15, name: 'Neurosurgery', shortName: 'Neurosurgery', image: neurosurg },
  { id: 16, name: 'Rheumatology', shortName: 'Rheumatology', image: rheu },
  { id: 17, name: 'Ophthalmology', shortName: 'Ophthalmology', image: oph },
  { id: 18, name: 'Surgical Gastroenterology', shortName: 'Surgical Gastro', image: gastrosurg },
  { id: 19, name: 'Infectious Disease', shortName: 'Infectious Disease', image: infect },
  { id: 20, name: 'General & Laparoscopic Surgery', shortName: 'General Surgery', image: lap },
  { id: 21, name: 'Psychology', shortName: 'Psychology', image: psycho },
  { id: 22, name: 'Medical Oncology', shortName: 'Oncology', image: onco },
  { id: 23, name: 'Diabetology', shortName: 'Diabetology', image: diab },
  { id: 24, name: 'Dentist', shortName: 'Dentist', image: dent },
];

const Specialties = () => {
  return (
    <div className="p-6 xl:mx-12 bg-white">
      <h2 className="text-xl font-bold mb-4">Browse by Specialties</h2>
      <div className="grid grid-cols-3 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-12 ">
        {specialties.map((specialty) => (
          <Link href={`/doctors`}
            key={specialty.id}
            className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-2">
              {/* Icon placeholder - you'll add Font Awesome icons here */}
              <Image src={specialty.image} alt={specialty.name} width={42} height={42} />
            </div>
            <span className="text-center text-xs md:text-sm xl:text-md font-medium text-gray-800">
              {specialty.shortName}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Specialties;