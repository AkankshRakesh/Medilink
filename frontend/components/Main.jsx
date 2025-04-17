'use client'
import React from 'react'
export default function Main(props) {
    const { children } = props
    return (
        <main className='flex-1 flex flex-col mt-10 dark:bg-gray-900'>
            {children}
        </main>
    )
}
