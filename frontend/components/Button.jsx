import { Fugaz_One, Open_Sans } from 'next/font/google';
import React from 'react'

const opensans = Open_Sans({ subsets: ["latin"], weight: ["500"] });

export default function Button(props) {
    const { text, dark, full, clickHandler, icon } = props

    return (
        <button onClick={clickHandler} className={'rounded-full overflow-hidden duration-200 hover:opacity-60 border-2 border-solid border-indigo-600 ' + (dark ? ' text-white bg-indigo-600 ' : ' text-indigo-600 ') + (full ? ' grid place-items-center w-full ' : ' ')}>
            <p className={'px-6 whitespace-nowrap py-2 ' + opensans.className}>{icon}{text}</p>
        </button>
   )
}