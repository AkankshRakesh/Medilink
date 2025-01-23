'use client'
import { Fugaz_One } from 'next/font/google';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        toast.success('Your message has been sent successfully!');

        // console.log('Form submitted:', formData);
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className='flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16 p-4'>
            <h4 className={'text-5xl sm:text-6xl md:text-7xl text-center ' + fugaz.className}>
                Contact <span className='textGradient'>Us</span>
            </h4>
            <form onSubmit={handleSubmit} className='flex flex-col gap-6 bg-indigo-50 p-6 rounded-lg shadow-lg'>
                <div className='flex flex-col'>
                    <label htmlFor='name' className='font-medium text-indigo-500'>Name</label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        placeholder='Your name here'
                        required
                        className='p-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor='email' className='font-medium text-indigo-500'>Email</label>
                    <input
                        type='email'
                        id='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='Your email here'
                        required
                        className='p-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor='message' className='font-medium text-indigo-500'>Message</label>
                    <textarea
                        id='message'
                        name='message'
                        value={formData.message}
                        onChange={handleChange}
                        placeholder='Your message here'
                        required
                        rows='4'
                        className='p-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    />
                </div>
                <button
                    type='submit'
                    className='p-4 rounded-2xl bg-indigo-500 text-white hover:bg-indigo-600 transition duration-200'
                >
                    Send Message
                </button>
            </form>
        </div>
    );
}