'use client'
import { Fugaz_One } from 'next/font/google';
import React, { useState } from 'react';
import Button from './Button';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function Login() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [isDoctor, setIsDoctor] = useState(false);
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [authenticating, setAuthenticating] = useState(false);

    const router = useRouter();

    async function handleSubmit(event) {
        event.preventDefault();
        if (isRegister && (!username || !email || !password || password.length < 6)) {
            alert('Please fill in all fields (password must be at least 6 characters).');
            return;
        } else if (!email || !password || password.length < 6) {
            alert('Please enter a valid email and password (min 6 characters).');
            return;
        }
        
        setAuthenticating(true);
        try {
            const endpoint = isRegister ? `${process.env.NEXT_PUBLIC_BACKEND}/signup.php` : `${process.env.NEXT_PUBLIC_BACKEND}/login.php`;
            const response = await axios.post(endpoint, { username, email, password, isDoctor: isDoctor ? 1 : 0 }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            toast(response.data.message);

            if (!isRegister && response.data.message === "Login successful") {
                console.log('User logged in successfully.');
                localStorage.setItem('userId', response.data.user_id);
                router.push('/');
                window.location.reload();
            }
            else if(isRegister) {
                router.push('/');
                window.location.reload();
                console.log('User registered successfully.');
                setIsRegister(false);
            }
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            alert('Authentication failed. Please try again.');
        } finally {
            setAuthenticating(false);
        }
    }

    return (
        <>
        {!isDoctor ? (<div className='flex flex-col flex-1 justify-center items-center gap-4'>
            <h3 className={'text-4xl sm:text-5xl md:text-6xl ' + fugaz.className}>
                {isRegister ? 'Register' : 'Log In'}
            </h3>
            <p className='text-center'>
                {isRegister ? 'Join us as a ' : "You're one step away!"}
                <button onClick={() => setIsDoctor(!isDoctor)} className='text-indigo-600'>
                    {isRegister ? 'Healer' : ''}
                </button> {isRegister ? 'or as a ' : ''}
                <button onClick={() => setIsRegister(!isRegister)} className='text-indigo-600'>
                    {isRegister ? 'Patient' : ''}
                </button>
            </p>
            <form onSubmit={handleSubmit} className="w-full max-w-[400px] mx-auto">
                {isRegister && (
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none"
                        placeholder="Username"
                        required
                        autoComplete="username"
                    />
                )}
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full ${isRegister ? 'mt-4' : ''} px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none`}
                    placeholder="Email"
                    type="email"
                    required
                    autoComplete="email"
                />
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-4 px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none"
                    placeholder="Password"
                    type="password"
                    minLength={6}
                    required
                    autoComplete="current-password"
                />
                <div className="mt-4">
                    <Button type="submit" text={authenticating ? 'Submitting' : 'Submit'} full />
                </div>
            </form>
            <p className='text-center'>
                {isRegister ? 'Already have an account? ' : "Don't have an account? "}
                <button onClick={() => setIsRegister(!isRegister)} className='text-indigo-600'>
                    {isRegister ? 'Sign in' : 'Sign up'}
                </button>
            </p>
        </div>
        
    ): (

            <div className='flex flex-col flex-1 justify-center items-center gap-4'>
            <h3 className={'text-4xl sm:text-5xl md:text-6xl ' + fugaz.className}>
                {isRegister ? 'Register as a Healer' : 'Log In'}
            </h3>
            <p className='text-center'>
                {isRegister ? 'Or join us as a ' : "You're one step away!"}
                <button onClick={() => setIsDoctor(!isDoctor)} className='text-indigo-600'>
                    {isRegister ? 'Patient' : ''}
                </button>
            </p>
            <form onSubmit={handleSubmit} className="w-full max-w-[400px] mx-auto">
                {isRegister && (
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none"
                        placeholder="Username"
                        required
                        autoComplete="username"
                    />
                )}
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full ${isRegister ? 'mt-4' : ''} px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none`}
                    placeholder="Email"
                    type="email"
                    required
                    autoComplete="email"
                />
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-4 px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none"
                    placeholder="Password"
                    type="password"
                    minLength={6}
                    required
                    autoComplete="current-password"
                />
                <div className="mt-4">
                    <Button type="submit" text={authenticating ? 'Submitting' : 'Submit'} full />
                </div>
            </form>
            <p className='text-center'>
                {isRegister ? 'Already have an account? ' : "Don't have an account? "}
                <button onClick={() => setIsRegister(!isRegister)} className='text-indigo-600'>
                    {isRegister ? 'Sign in' : 'Sign up'}
                </button>
            </p>
        </div>
        )}
        </>
    );
}
