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
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [authenticating, setAuthenticating] = useState(false);
    const [loadingOtp, setLoadingOtp] = useState(false);

    const router = useRouter();

      async function sendOtp() {
        if (!email) {
            toast.error('Please enter your email first.');
            return;
        }
        setLoadingOtp(true);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/sendOtp.php`, { email });
            toast.success('OTP sent successfully!');
            setOtpSent(true);
        } catch (error) {
            console.error('OTP Error:', error.response?.data || error.message);
            toast.error('Failed to send OTP.');
        } finally {
            setLoadingOtp(false);
        }
    }
    async function verifyOtp() {
        if (!otp) {
            toast.error('Please enter the OTP.');
            return;
        }
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/verifyOtp.php`, { email, otp });
            if (response.data.status === "success") {
                toast.success('OTP verified successfully!');
                setOtpSent(false); // Hide OTP input after successful verification
                setOtpVerified(true);
            } else {
                toast.error('Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('OTP Verification Error:', error.response?.data || error.message);
            toast.error('OTP verification failed.');
        }
    }
    function youAreVerified() {
        toast.info('You are verified! Please proceed to submit the form.');
    }
    async function handleSubmit(event) {
        event.preventDefault();
        if (isRegister && (!username || !email || !password || password.length < 6)) {
            toast('Please fill in all fields (password must be at least 6 characters).');
            return;
        } else if (!email || !password || password.length < 6) {
            toast('Please enter a valid email and password (min 6 characters).');
            return;
        }
        if(!otpVerified) {
            toast.warning("Please verify your email first.");
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
            toast.success(response.data.message);

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
            toast.error('Authentication failed. Please try again.');
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
                    {isRegister ? 'Counsellor' : ''}
                </button> {isRegister ? 'or as a ' : ''}
                <button onClick={() => setIsRegister(!isRegister)} className='text-indigo-600'>
                    {isRegister ? 'Customer' : ''}
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
                <div className="relative w-full mt-4">
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 pr-16 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none"
                        placeholder="Email"
                        type="email"
                        required
                        autoComplete="email"
                        disabled={otpVerified}
                    />
                    {!otpSent && !otpVerified && (<button
                        type="button"
                        onClick={sendOtp}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-3 md:py-2 py-1 rounded-full text-sm"
                    >
                        {loadingOtp ? (
            <svg className="animate-spin h-4 w-4 border-t-2 border-white rounded-full" viewBox="0 0 24 24"></svg>
        ) : "Send OTP"}
                    </button>)}
                    {otpVerified && (
                        <button
                        type="button"
                        onClick={youAreVerified}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 text-white px-3 md:py-2 py-1 rounded-full text-sm"
                    >
                        Verified <i className="fa-solid fa-circle-check"></i>
                    </button>
                    )}
                    {otpSent && (
                    <div className="flex justify-center mt-4">
                        <input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-3/4 px-3 md:px-6 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none text-center"
                            placeholder="Enter OTP"
                            type="text"
                        />
                        <button
                            type="button"
                            onClick={verifyOtp}
                            className="ml-2 bg-green-500 text-white px-8 py-2 rounded-full"
                        >
                            Verify
                        </button>
                    </div>
                )}
                </div>
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
                {isRegister ? 'Register as a Counsellor' : 'Log In'}
            </h3>
            <p className='text-center'>
                {isRegister ? 'Or join us as a ' : "You're one step away!"}
                <button onClick={() => setIsDoctor(!isDoctor)} className='text-indigo-600'>
                    {isRegister ? 'Customer' : ''}
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
                <div className="relative w-full mt-4">
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 pr-16 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none"
                        placeholder="Email"
                        type="email"
                        required
                        autoComplete="email"
                        disabled={otpVerified}
                    />
                    {!otpSent && !otpVerified && (<button
                        type="button"
                        onClick={sendOtp}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-3 md:py-2 py-1 rounded-full text-sm"
                    >
                        {loadingOtp ? (
            <svg className="animate-spin h-4 w-4 border-t-2 border-white rounded-full" viewBox="0 0 24 24"></svg>
        ) : "Send OTP"}
                    </button>)}
                    {otpVerified && (
                        <button
                        type="button"
                        onClick={youAreVerified}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 text-white px-3 md:py-2 py-1 rounded-full text-sm"
                    >
                        Verified <i className="fa-solid fa-circle-check"></i>
                    </button>
                    )}
                    {otpSent && (
                    <div className="flex justify-center mt-4">
                        <input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-3/4 px-3 md:px-6 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none text-center"
                            placeholder="Enter OTP"
                            type="text"
                        />
                        <button
                            type="button"
                            onClick={verifyOtp}
                            className="ml-2 bg-green-500 text-white px-8 py-2 rounded-full"
                        >
                            Verify
                        </button>
                    </div>
                )}
                </div>
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
