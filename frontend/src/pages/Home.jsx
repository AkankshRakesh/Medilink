import { useEffect, useState } from "react";

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [isCounsellor, setIsCounsellor] = useState(false);

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

                const response = await fetch(`http://localhost/backend/checkSession.php`, {
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
                if (result.success) {
                    setCurrentUser(result);
                    setIsCounsellor(result.isDoctor === 1); // Assuming isDoctor is returned as 1 or 0
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

    if (!currentUser) {
        return (
            <div className='h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
                <p className='text-3xl text-white font-semibold'>Welcome to our platform!</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 text-white">
            <h4 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-center">
                {isCounsellor ? (
                    <>
                        <span className="textGradient">Counsellor</span> Dashboard
                    </>
                ) : (
                    <>
                        <span className="textGradient">User</span> Dashboard
                    </>
                )}
            </h4>

            <div className="mt-8 w-full max-w-3xl bg-white text-gray-800 rounded-2xl shadow-lg p-6 sm:p-10">
                <p className="text-lg sm:text-xl font-medium text-center">
                    {isCounsellor
                        ? "Welcome, Counsellor! Manage appointments, view patient history, and more."
                        : "Welcome, User! Book appointments and explore available services."}
                </p>
            </div>
        </div>
    );
};

export default Home;
