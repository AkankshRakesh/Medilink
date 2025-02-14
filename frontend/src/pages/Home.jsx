import { useEffect, useState } from "react";


const Home = () => {
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [isCounsellor, setIsCounsellor] = useState(false);
    const [data, setData] = useState({});
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
            <div className='h-full flex flex-col items-center justify-center my-auto'>
                <p className='text-2xl text-white'>This is Home page before login</p>
            </div>
        );
      }
    return (
        <div className='h-full flex flex-col items-center justify-center my-auto'>
            <p className='text-2xl text-white'>This is Home page</p>
        </div>
    );
}

export default Home;
