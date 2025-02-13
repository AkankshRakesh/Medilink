import { useState } from "react";
import SignUp from "../components/SignUp";
import Login from "../components/Login";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const toggleAuth = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center my-auto">
      <p>Hello</p>
      {isSignUp ? <SignUp toggleAuth={toggleAuth} /> : <Login toggleAuth={toggleAuth} />}      </div>
  );
};

export default Auth;
