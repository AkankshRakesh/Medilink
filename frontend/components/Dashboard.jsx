'use client'
import { Fugaz_One } from 'next/font/google';
import React, { useEffect, useState } from 'react';
import Calendar from './Calendar';
import Loading from './Loading';
import Login from './Login';

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isCounsellor, setIsCounsellor] = useState(false);
  const [data, setData] = useState({});
  const now = new Date();

  useEffect(() => {
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
          setIsCounsellor(result.isDoctor == 1); // Assuming isDoctor is returned as 1 or 0
          
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

  function countValues() {
    let total_number_of_days = 0;
    let sum_moods = 0;
    for (let year in data) {
      for (let month in data[year]) {
        for (let day in data[year][month]) {
          let days_mood = data[year][month][day];
          total_number_of_days++;
          sum_moods += days_mood;
        }
      }
    }
    return { num_days: total_number_of_days, average_mood: sum_moods / total_number_of_days };
  }

  const statuses = {
    ...countValues(),
    time_remaining: `${23 - now.getHours()}H ${60 - now.getMinutes()}M`,
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16'>
      {isCounsellor ? (
        <div>
          <h4 className={'text-5xl sm:text-6xl md:text-7xl text-center ' + fugaz.className}>
        <span className='textGradient'>Counsellor</span> Dashboard </h4>
        <div className='bg-indigo-50 text-indigo-500 p-4 gap-4 rounded-lg'>
          <p className='text-center'>Welcome, Counsellor! Here you can manage appointments, view patient history, and more.</p>
        </div>
        </div>
      ) : (
        <div>
          <h4 className={'text-5xl sm:text-6xl md:text-7xl text-center ' + fugaz.className}>
          <span className='textGradient'>User</span> Dashboard </h4>
          <p>Welcome to your dashboard! Track your mood and activities.</p>
        </div>
      )}
    </div>
  );
}
