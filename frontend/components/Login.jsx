'use client'

import { Fugaz_One } from 'next/font/google';
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { CheckCircle, Loader2, ArrowLeft, Clock, Users, Shield } from 'lucide-react';

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function Login() {
    const [email, setEmail] = useState('');
    const [isDoctor, setIsDoctor] = useState(false);
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [authenticating, setAuthenticating] = useState(false);
    const [loadingOtp, setLoadingOtp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
                setOtpSent(false); 
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
        toast.info('You are verified! Please proceed to login.');
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!email || !password || password.length < 6) {
            toast('Please enter a valid email and password (min 6 characters).');
            return;
        }
        if(!otpVerified) {
            toast.warning("Please verify your email first.");
            return;
        }
        setAuthenticating(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/auth/login.php`, 
                { email, password, isDoctor: isDoctor ? 1 : 0 }, 
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if(response.data.message == "Invalid email or password"){
                toast.warning("Invalid email or password. Please try again.");
                return;
            }
            toast.success(response.data.message);

            if (response.data.message === "Login successful") {
                console.log('User logged in successfully.');
                localStorage.setItem('userId', response.data.user_id);
                localStorage.setItem('username', response.data.username);
                localStorage.setItem('email', email);
                router.push('/');
            }
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            toast.error('Authentication failed. Please try again.');
        } finally {
            setAuthenticating(false);
        }
    }

    return (
            <div className="h-screen w-full bg-white rounded-2xl shadow-lg md:overflow-hidden flex flex-col md:flex-row">
                {/* Left Column - Info Section */}
                <div className="bg-gradient-to-b mt-5 from-cyan-500 to-blue-500 text-white p-8 md:p-12 md:w-7/12 flex flex-col justify-center items-center">
                    <div>
                    
                    <div className="mb-4 md:mb-12">
                        <h2 className={`${fugaz.className} text-3xl md:text-4xl font-bold mb-6`}>
                            Expert advice from top doctors
                        </h2>
                        
                        <div className="space-y-6">
                            <div className="flex items-center">
                                <div className="bg-white/20 p-2 rounded-full mr-4">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Connect with top doctors</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center">
                                <div className="bg-white/20 p-2 rounded-full mr-4">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Available 24/7 on any device</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center">
                                <div className="bg-white/20 p-2 rounded-full mr-4">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Private questions answered within 24 hrs</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="hidden lg:block mt-auto">
                        <div className="bg-white/10 p-4 rounded-lg">
                            <p className="text-sm">
                                "This platform has connected me with counsellors who truly understand my needs. 
                                The advice I've received has been life-changing."
                            </p>
                            <p className="mt-2 font-medium">— Akanksh R.</p>
                        </div>
                    </div>
                    </div>
                </div>
                
                {/* Right Column - Form Section */}
                <div className="p-8 md:p-12 md:w-7/12 flex flex-col justify-center items-center bg-white">
                
                    <div className="mx-auto">
                        
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                Welcome back
                            </h3>
                            <p className="text-gray-500 text-sm">
                                Log in to your account and we'll get you to see our counsellors
                            </p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700 block pl-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all duration-200"
                                        placeholder="Email Address"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        disabled={otpVerified}
                                    />
                                    {!otpSent && !otpVerified && (
                                        <button
                                            type="button"
                                            onClick={sendOtp}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                                            disabled={loadingOtp}
                                        >
                                            {loadingOtp ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : "Send OTP"}
                                        </button>
                                    )}
                                    {otpVerified && (
                                        <button
                                            type="button"
                                            onClick={youAreVerified}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1"
                                        >
                                            <span>Verified</span>
                                            <CheckCircle className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {otpSent && (
                                <div className="space-y-1">
                                    <label htmlFor="otp" className="text-sm font-medium text-gray-700 block pl-1">
                                        Verification Code
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            id="otp"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all duration-200 text-center tracking-widest"
                                            placeholder="Enter OTP"
                                            type="text"
                                        />
                                        <button
                                            type="button"
                                            onClick={verifyOtp}
                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200"
                                        >
                                            Verify
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1">
                                <div className="flex justify-between items-center pl-1">
                                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <p onClick={() => toast.info("Our team has been notified and will get in touch with you soon")} className="text-sm text-cyan-600 hover:text-cyan-700 cursor-pointer">
                                        Forgot password?
                                    </p>
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all duration-200"
                                        placeholder="Password"
                                        type={showPassword ? "text" : "password"}
                                        minLength={6}
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button 
                                    type="submit" 
                                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
                                    disabled={authenticating}
                                >
                                    {authenticating ? (
                                        <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Logging in...</>
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>
                            </div>
                        </form>
                        
                            <div>
                            <p className='text-center mt-5 text-gray-500'>
                                Don't have an account? 
                                <button className='text-cyan-600 hover:text-cyan-700 ml-2' onClick={() => router.push('/signup')}>
                                    Sign up
                                </button>
                            </p>
                            </div>
                    </div>
                </div>
            </div>
    );
}