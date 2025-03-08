'use client'
import React, { useEffect, useState } from 'react'
import Button from './Button'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Fugaz_One, Open_Sans } from 'next/font/google'

const opensans = Open_Sans({ subsets: ["latin"], weight: ["500"] });
const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function Logout() {
    const pathname = usePathname();
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setIsUserLoggedIn(!!userId); // Convert userId to boolean
    }, []);

    const logout = () => {
        localStorage.removeItem('userId');
        setIsUserLoggedIn(false);
        window.location.href = '/'; // Redirect to homepage after logout
    };

    if (!isUserLoggedIn) {
        return (
            <div className="flex justify-center gap-4">
                <Link href={'/login'}>
                    <div className='lg:hidden'><Button text="Log in" /></div>
                    <div className={'hidden lg:block text-lg font-bold border-r-2 pr-4 textGradient purpleShadow' + opensans.className}>Log in</div>
                </Link>
                <Link href={'/signup'}>
                    <div className='lg:hidden'><Button text="Signup" dark/></div>
                    <div className={'hidden lg:block text-lg font-bold textGradient purpleShadow' + opensans.className}>Signup</div>
                </Link>
            </div>
        );
    }

    if (pathname === '/') {
        return <Button text="Logout" clickHandler={logout} />;
    }

    if (pathname === '/contact') {
        return (
            <Link href={'/dashboard'}>
                <h1 className={'text-base sm:text-lg py-2 sm:py-3 textGradient ' + opensans.className}>
                    Go to dashboard
                </h1>
            </Link>
        );
    }

    return <Button text="Logout" clickHandler={logout} />;
}
