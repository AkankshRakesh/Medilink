'use client'
import { Fugaz_One } from 'next/font/google';
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { CheckCircle, Loader2, ArrowLeft, Clock, Users, Shield } from 'lucide-react';

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isDoctor, setIsDoctor] = useState(false);
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
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/auth/verifyOtp.php`, { email, otp });
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
        toast.info('You are verified! Please proceed to complete your signup.');
    }

    async function handleSignup(event) {
        event.preventDefault();
        if (!username || !email || !password || password.length < 6) {
            toast('Please fill in all fields (password must be at least 6 characters).');
            return;
        }
        if (!otpVerified) {
            toast.warning('Please verify your email first.');
            return;
        }
        setAuthenticating(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/auth/signup.php`, 
                { username, email, password, isDoctor: isDoctor ? 1 : 0 }, 
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            if(response.data.message == "Email already exists"){
                toast.info('Email already exists. Please login.', {
                    autoClose: 3500,
                    onClose: router.push('/login'),
                });
                router.push('/login')
                return;
            }
            toast.success(response.data.message);
            router.push('/login');
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            toast.error('Signup failed. Please try again.');
        } finally {
            setAuthenticating(false);
        }
    }

    return (
        <div className="h-screen w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg md:overflow-hidden flex flex-col md:flex-row">
          {/* Left Column */}
          <div className="bg-gradient-to-b mt-5 from-cyan-500 to-blue-500 text-white p-8 md:p-12 md:w-7/12 flex flex-col justify-center items-center">
            <div>
              <div className="mb-3 md:mb-12">
                <h2 className={`${fugaz.className} text-3xl md:text-4xl font-bold mb-6`}>
                  Join our community today
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="bg-white/20 p-2 rounded-full mr-4">
                      <Users className="h-5 w-5" />
                    </div>
                    <p className="font-medium">Connect with top professionals</p>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-white/20 p-2 rounded-full mr-4">
                      <Clock className="h-5 w-5" />
                    </div>
                    <p className="font-medium">24/7 access to expert advice</p>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-white/20 p-2 rounded-full mr-4">
                      <Shield className="h-5 w-5" />
                    </div>
                    <p className="font-medium">Secure and confidential service</p>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block mt-auto">
                <div className="bg-white/10 p-4 rounded-lg">
                  <p className="text-sm">
                    "Joining this platform was the best decision I made for my mental health. 
                    The support I received was exceptional."
                  </p>
                  <p className="mt-2 font-medium">— Archita S.</p>
                </div>
              </div>
            </div>
          </div>
    
          {/* Right Column */}
          <div className="p-8 md:p-12 md:w-7/12 flex flex-col justify-center items-center bg-white dark:bg-gray-900">
            <div className="mx-auto w-full max-w-md">
              <div className="flex justify-center mb-8">
                <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-full p-1">
                  <button 
                    onClick={() => setIsDoctor(false)} 
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!isDoctor ? 'bg-white dark:bg-gray-700 shadow-sm text-cyan-600' : 'text-gray-500 dark:text-gray-300'}`}
                  >
                    Patient
                  </button>
                  <button 
                    onClick={() => setIsDoctor(true)} 
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isDoctor ? 'bg-white dark:bg-gray-700 shadow-sm text-cyan-600' : 'text-gray-500 dark:text-gray-300'}`}
                  >
                    Doctor
                  </button>
                </div>
              </div>
    
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Create your account
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Fill in your details to join our community
                </p>
              </div>
    
              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-1">
                  <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300 block pl-1">
                    Username
                  </label>
                  <input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all duration-200"
                    placeholder="Choose a username"
                    required
                    autoComplete="username"
                  />
                </div>
    
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 block pl-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all duration-200"
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
                    <label htmlFor="otp" className="text-sm font-medium text-gray-700 dark:text-gray-300 block pl-1">
                      Verification Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all duration-200 text-center tracking-widest"
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
                  <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 block pl-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all duration-200"
                      placeholder="Create a password"
                      type={showPassword ? "text" : "password"}
                      minLength={6}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                        <div className="pt-2">
                            <button 
                                type="submit" 
                                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
                                disabled={authenticating}
                            >
                                {authenticating ? (
                                    <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Creating account...</>
                                ) : (
                                    'Sign Up'
                                )}
                            </button>
                        </div>
                    </form>
                    
                    <div>
                        <p className='text-center mt-5 text-gray-500'>
                            Already have an account? 
                            <button className='text-cyan-600 hover:text-cyan-700 ml-2' onClick={() => router.push('/login')}>
                                Log in
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}