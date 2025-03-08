'use client'
import React, { useEffect, useState } from 'react'
import Button from './Button'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Fugaz_One, Open_Sans } from 'next/font/google'
const opensans = Open_Sans({ subsets: ["latin"], weight: ["500"]  });
const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function Logout() {
    const pathname = usePathname();
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    useEffect(() => {
        // Check for the userId in localStorage to determine if the user is logged in
        const userId = localStorage.getItem('userId');
        setIsUserLoggedIn(!!userId); // Convert userId to a boolean
    }, []);

    const logout = () => {
        // Remove the userId from localStorage to log out
        localStorage.removeItem('userId');
        setIsUserLoggedIn(false);
        window.location.href = '/'; // Redirect to the homepage after logout
    };

    if (pathname === '/') {
        return (
            <Link href={'/contact'}>
                <h1 className={'text-base sm:text-lg py-2 sm:py-3 textGradient ' + opensans.className}>
                    Contact us
                </h1>
            </Link>
        );
    }
    else if(pathname === '/contact') {
        return (
            <Link href={'/dashboard'}>
                <h1 className={'text-base sm:text-lg py-2 sm:py-3 textGradient ' + opensans.className}>
                    Go to dashboard
                </h1>
            </Link>
        )
    }

    if (!isUserLoggedIn) {
        return (
            <Link href={'/contact'}>
                <h1 className={'text-base sm:text-lg py-2 sm:py-3 textGradient ' + opensans.className}>
                    Contact us
                </h1>
            </Link>
        );
    }

    return <Button text="Logout" clickHandler={logout} />;
}
