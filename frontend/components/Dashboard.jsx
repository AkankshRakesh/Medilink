'use client'
import { Fugaz_One } from 'next/font/google';
import React, { useEffect, useState } from 'react'
import Calendar from './Calendar';
import Loading from './Loading';
import Login from './Login';

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userDataObj, setUserDataObj] = useState({});
  const [data, setData] = useState({});
  const now = new Date();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Get userId from local storage

        // Ensure that userId is present
        if (!userId) {
          setLoading(false);
          setCurrentUser(null);
          console.log('No userId found in local storage');
          return;
        }

        // Send userId in the request body to check the session
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/checkSession.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }), // Include userId in the body
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        if (result.success) {
          setCurrentUser(result); // Store user details returned from the server
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
  

  async function handleSetMood(mood) {
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();

    try {
      const newData = { ...userDataObj };
      if (!newData?.[year]) {
        newData[year] = {};
      }
      if (!newData?.[year]?.[month]) {
        newData[year][month] = {};
      }

      newData[year][month][day] = mood;
      // Update local state
      setData(newData);
      setUserDataObj(newData);

      // Send data to backend
      const response = await fetch('/api/auth/update_mood.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, month, day, mood }),
        credentials: 'include',
      });

      const result = await response.json();
      if (!result.success) {
        console.error('Failed to update mood:', result.message);
      }
    } catch (error) {
      console.log('Error updating mood:', error.message);
    }
  }

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

  const moods = {
    '&*@#$': '😭',
    'Sad': '🥲',
    'Existing': '😶',
    'Good': '😊',
    'Elated': '😍',
  };

  if (loading) {
    return <Loading />;
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className='flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16'>
      <div className='grid grid-cols-3 bg-indigo-50 text-indigo-500 p-4 gap-4 rounded-lg'>
        {Object.keys(statuses).map((status, statusIndex) => {
          return (
            <div key={statusIndex} className='flex flex-col gap-1 sm:gap-2'>
              <p className='font-medium capitalize text-xs sm:text-sm truncate'>{status.replaceAll('_', ' ')}</p>
              <p className={'text-base sm:text-lg truncate ' + fugaz.className}>{statuses[status]}{status === 'num_days' ? ' 🔥' : ''}</p>
            </div>
          );
        })}
      </div>
      <h4 className={'text-5xl sm:text-6xl md:text-7xl text-center ' + fugaz.className}>
        How do you <span className='textGradient'>feel</span> today?
      </h4>
      <div className='flex items-stretch flex-wrap gap-4'>
        {Object.keys(moods).map((mood, moodIndex) => {
          return (
            <button onClick={() => {
              const currentMoodValue = moodIndex + 1;
              handleSetMood(currentMoodValue);
            }} className={'p-4 px-5 rounded-2xl purpleShadow duration-200 bg-indigo-50 hover:bg-indigo-100 text-center flex flex-col items-center gap-2 flex-1 '} key={moodIndex}>
              <p className='text-4xl sm:text-5xl md:text-6xl'>{moods[mood]}</p>
              <p className={'text-indigo-500 text-xs sm:text-sm md:text-base ' + fugaz.className}>{mood}</p>
            </button>
          );
        })}
      </div>
      <Calendar completeData={data} handleSetMood={handleSetMood} />
    </div>
  );
}