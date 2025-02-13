import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import OTPInput from "react-otp-input";
import Buttom from "./Buttom";
import { Eye, EyeOff } from "lucide-react";

const Login = ({ toggleAuth }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [passwordVisiable, setPasswordVisiable] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    if (!formData.email) return toast.error("Please enter your email first.");
    setLoadingOtp(true);
    try {
      await axios.post(`/sendOtp.php`, { email: formData.email });
      toast.success("OTP sent successfully!");
      setOtpSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoadingOtp(false);
    }
  };

  const verifyOtp = async () => {
    if (!formData.otp) return toast.error("Please enter the OTP.");
    try {
      const response = await axios.post(`/verifyOtp.php`, {
        email: formData.email,
        otp: formData.otp,
      });
      if (response.data.status === "success") {
        toast.success("OTP verified successfully!");
        setOtpSent(false);
        setOtpVerified(true);
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || formData.password.length < 6)
      return toast.error("Invalid email or password.");
    if (!otpVerified) return toast.warning("Please verify your email first.");
    setAuthenticating(true);
    try {
      const endpoint = `/login.php`;
      const response = await axios.post(endpoint, formData);
      toast.success(response.data.message);
      if (response.data.message === "Login successful") {
        localStorage.setItem("userId", response.data.user_id);
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed.");
    } finally {
      setAuthenticating(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center w-full bg-gray-900 p-8 rounded-xl shadow-lg text-white">
      <h3 className="text-6xl font-bold">Log In</h3>
      <p className="text-gray-400 mt-2">You're one step away</p>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm mt-6 flex flex-col gap-6"
      >
        <div className="relative">
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
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
        </div>
        {otpSent && (
          <OTPInput
            value={formData.otp}
            onChange={(otp) => setFormData({ ...formData, otp })}
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
        )}
        {otpSent && (
          <button
            type="button"
            onClick={verifyOtp}
            className="bg-green-600 text-white py-2 px-4 rounded-lg"
          >
            Verify OTP
          </button>
        )}
        {otpVerified && <span className="text-green-400">✔ Verified</span>}
        <div className="relative">
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="relative w-full px-4 bg-transparent border border-gray-500 py-2 rounded-lg"
            placeholder="Password"
            type={!passwordVisiable?"password":"text"}
            required
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={()=>{setPasswordVisiable(!passwordVisiable)}}>
            {!passwordVisiable ? <EyeOff /> : <Eye />}
          </div>
        </div>
        <div className="mt-4 w-full items-center justify-center flex">
          <Buttom
            type="submit"
            text={authenticating ? "Loging In...!!" : "Log In"}
            full
          />
        </div>
      </form>
      <button onClick={toggleAuth} className="mt-4 text-blue-400 underline">
        Don't have an account? Sign up
      </button>
    </div>
  );
};

export default Login;
