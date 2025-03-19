'use client'
import { Fugaz_One } from 'next/font/google';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import pic from '../public/contactus.jpg';
import Image from 'next/image';

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/contactForm.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success('Your message has been sent successfully!');
                console.log('Form submitted:', formData);
                setFormData({ name: '', email: '', message: '' });
            } else {
                toast.error('Failed to send message. Please try again.');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="md:mx-20 mx-6 ">
          
        <div className='md:flex items-center justify-center flex-1 md:pt-16   w-full'>
            
            <div className="md:w-1/2 items-center md:ms-7">
            <h4 className='md:text-4xl text-2xl md:pt-0 pt-4 font-bold text-indigo-600'>Just Say Hello!</h4>
        <p className='md:text-lg md:py-3 py-2 text-indigo-600'>Let us know more about you!</p>
                <form onSubmit={handleSubmit} className='flex flex-col gap-6  md:w-2/3'>
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
                            className='p-2 border border-indigo-300 bg-indigo-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
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
                            className='p-2 border bg-indigo-100 border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
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
                            className='p-2 border bg-indigo-100 border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
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
                <div className="md:w-1/3"><Image className='' src={pic} alt="" /></div>
            </div>
            </div>
    );
}