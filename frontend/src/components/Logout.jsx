import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';


export default function Logout() {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {

        const userId = localStorage.getItem('userId');
        setIsUserLoggedIn(!!userId); // Convert userId to a boolean
    }, []);

    const logout = () => {

        localStorage.removeItem('userId');
        setIsUserLoggedIn(false);
        window.location.href = '/';
    };

    if(isUserLoggedIn){
        return (
            <div
            className="flex gap-2 items-center bg-slate-600 hover:bg-slate-700 px-4 py-1 rounded-xl cursor-pointer"
            onClick={() => {
              logout();
            }}
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <p className="font-bold text-xl">Log out</p>
        </div>
        )
    }
    return (
        <div
            className="flex gap-2 items-center bg-slate-600 hover:bg-slate-700 px-4 py-1 rounded-xl cursor-pointer"
            onClick={() => {
              navigate("/auth");
            }}
          >
            <i className="fa-solid fa-key"></i>
            <p className="font-bold text-xl">Log In</p>
        </div>
    );
}