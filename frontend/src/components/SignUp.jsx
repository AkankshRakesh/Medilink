import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Buttom from "./Buttom";
import OTPInput from "react-otp-input";
import { Eye, EyeOff } from "lucide-react";

export default function SignUp({ toggleAuth }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [passwordVisiable, setPasswordVisiable] = useState(false)

  async function sendOtp() {
    if (!email) {
      toast.error("Please enter your email first.");
      return;
    }
    setLoadingOtp(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/sendOtp.php`, {
        email,
      });
      toast.success("OTP sent successfully!");
      setOtpSent(true);
    } catch (e) {
      console.log(e);

      toast.error("Failed to send OTP.");
    } finally {
      setLoadingOtp(false);
    }
  }

  async function verifyOtp() {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND}/verifyOtp.php`,
        { email, otp }
      );
      if (response.data.status === "success") {
        toast.success("OTP verified successfully!");
        setOtpVerified(true);
        setOtpSent(false);
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      toast.error("OTP verification failed.");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!username || !email || !password || password.length < 6) {
      toast.error(
        "Please fill in all fields (password must be at least 6 characters)."
      );
      return;
    }
    if (!otpVerified) {
      toast.warning("Please verify your email first.");
      return;
    }
    setRegistering(true);
    try {
      const response = await axios.post(`/signup.php`, {
        username,
        email,
        password,
      });
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setRegistering(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 justify-center items-center gap-4 w-full">
      <h3
        className={"text-4xl sm:text-5xl md:text-6xl text-white font-semibold"}
      >
        Sign Up
      </h3>
      <p className="text-white font-semibold tracking-wide">
        Join us as a Counsellor or as a Customer..!!
      </p>
      <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto text-white">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 bg-transparent border border-gray-500 py-2 rounded-lg"
          placeholder="Username"
          required
        />
        <div className="relative w-full mt-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 bg-transparent border border-gray-500 py-2 rounded-lg"
            placeholder="Email"
            type="email"
            required
            disabled={otpVerified}
          />
          {!otpSent && !otpVerified && (
            <button
              type="button"
              onClick={sendOtp}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white font-semibold px-3 py-1 rounded-lg"
            >
              {loadingOtp ? "Sending..." : "Send OTP"}
            </button>
          )}
          {otpVerified && (
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
              Verified ✓
            </span>
          )}
        </div>
        {otpSent && (
          <div className="flex justify-center flex-col gap-3 mt-4">
            <OTPInput
              value={otp}
              onChange={(otp) => setOtp(otp)}
              numInputs={6}
              renderSeparator={<span className="w-4"></span>}
              shouldAutoFocus={true}
              containerStyle={"flex w-full items-center justify-center"}
              inputStyle={{
                border: "1px solid transparent",
                borderRadius: "8px",
                width: "45px",
                height: "45px",
                fontSize: "20px",
                color: "#000",
                fontWeight: "400",
                caretColor: "blue",
              }}
              renderInput={(props) => <input {...props} />}
            />
            <button
              type="button"
              onClick={verifyOtp}
              className="ml-2 bg-green-500 text-white px-4 py-2 rounded-full"
            >
              Verify
            </button>
          </div>
        )}

        <div className="relative mt-4">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 bg-transparent border border-gray-500 py-2 rounded-lg"
            placeholder="Password"
            type="password"
            minLength={6}
            required
          />
          <div
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={() => {
              setPasswordVisiable(!passwordVisiable);
            }}
          >
            {!passwordVisiable ? <EyeOff /> : <Eye />}
          </div>
        </div>
        <div className="mt-4 w-full items-center justify-center flex">
          <Buttom
            type="submit"
            text={registering ? "Registering..." : "Register"}
            full
          />
        </div>
      </form>
      <button onClick={toggleAuth} className="mt-4 text-blue-400 underline">
        Already have an account? Log in
      </button>
    </div>
  );
}
