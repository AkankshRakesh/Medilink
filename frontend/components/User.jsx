'use client'
import { Fugaz_One } from 'next/font/google';
import React, { useEffect, useState } from 'react';
import Calendar from './Calendar';
import Loading from './Loading';
import Login from './Login';

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export const User = () => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isDoctor, setIsDoctor] = useState(false);
  const [email, setEmail] = useState('Unknown');
  const [username, setUsername] = useState('Anonymous User');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Initialize state with localStorage values
    setEmail(localStorage.getItem('email') || 'Unknown');
    setTime(localStorage.getItem('loginTime') || new Date());
    setUsername(localStorage.getItem('username') || 'Anonymous User');
    
    const checkAuth = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setLoading(false);
          setCurrentUser(null);
          console.log('No userId found in local storage');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/checkSession.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log(result);
        if (result.success) {
          setCurrentUser(result);
          setIsDoctor(result.isDoctor == 1);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Failed to verify session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div>
          <h4 className={'text-5xl sm:text-6xl md:text-7xl text-center ' + fugaz.className}>
            <span className="textGradient">
              {isDoctor ? 'Doctor' : 'User'}
            </span>{' '}
            Dashboard
          </h4>
        </div>

        {/* Profile Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* User Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-200">Profile Information</h2>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative h-20 w-20 rounded-full overflow-hidden bg-gray-200">
                  <img
                    src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${(username || 'A').charAt(0)}&background=random`}
                    alt="Profile"
                    className="h-full w-full object-cover"
                    onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${username.charAt(0) || 'U'}&background=random`)}
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-200">{username}</h3>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span>{email}</span>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isDoctor 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {isDoctor ? 'Doctor' : 'Patient'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="h-px bg-gray-200 dark:bg-gray-700 my-4" />
              
              <div className="grid gap-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>Member since: {currentUser?.joinDate || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>Last login: {new Date(time).toLocaleString('en-IN', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Summary Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-200">Activity Summary</h2>
              {isDoctor ? (
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    Welcome to your counsellor dashboard. Here you can:
                  </p>
                  <ul className="space-y-2">
                    {['Manage appointments', 'View patient history', 'Access counselling resources', 'Generate reports'].map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    Track your progress and wellness journey:
                  </p>
                  <ul className="space-y-2">
                    {['Monitor your mood patterns', 'Schedule appointments', 'Access self-help resources', 'View your activity history'].map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}