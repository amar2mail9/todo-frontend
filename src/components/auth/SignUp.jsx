import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    username: "",
  });

  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URI}/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Signup successful. OTP sent!", {
          transition: Bounce,
        });
        setShowOtp(true);
      } else {
        toast.error(data.error || "Signup failed", { transition: Bounce });
      }
    } catch (error) {
      toast.error("Something went wrong!", { transition: Bounce });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    if (!otp || otp.length !== 6) {
      toast.warning("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URI}/user/signup/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, otp }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || "OTP Verified Successfully!", {
          transition: Bounce,
        });
        setOtp("");
        // Optional: redirect to login page after OTP verification
      } else {
        toast.error(result.message || "Invalid OTP", { transition: Bounce });
      }
    } catch (error) {
      toast.error("OTP verification failed!", { transition: Bounce });
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (!formData.email) {
      toast.warning("Email is missing. Please fill email.");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URI}/user/signup/resend-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || "OTP resent successfully!");
      } else {
        toast.error(result.error || "Failed to resend OTP.");
      }
    } catch (error) {
      toast.error(error.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="w-full min-h-screen bg-emerald-100 flex flex-col items-center justify-center px-4 py-10">
      <ToastContainer position="top-right" autoClose={5000} theme="light" />
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg overflow-hidden flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-br from-emerald-200 via-emerald-300 to-emerald-400 md:rounded-r-[50%] rounded-b-[50%]">
          <img
            src="./01.png"
            alt="Signup Visual"
            className="w-full h-full object-cover rounded-l-lg drop-shadow-2xl"
          />
        </div>

        {/* Form Section */}
        {!showOtp ? (
          <div className="w-full md:w-1/2 md:p-16 p-8">
            <h2 className="text-3xl font-bold text-emerald-600 mb-6 text-center">
              Create Account
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {["fullname", "email", "password", "username"].map((field) => (
                <div key={field}>
                  <label className="block mb-1 text-sm text-gray-600 capitalize">
                    {field === "fullname" ? "Full Name" : field}
                  </label>
                  <input
                    type={field.includes("password") ? "password" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-emerald-500 text-white py-2 rounded-lg transition duration-300 ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-emerald-600"
                }`}
              >
                {loading ? "Processing..." : "Sign Up"}
              </button>

              <p className="text-sm text-center text-gray-500 mt-4">
                Already have an account?{" "}
                <Link to="/login" className="text-emerald-600 hover:underline">
                  Log In
                </Link>
              </p>
            </form>
          </div>
        ) : (
          <div className="md:flex w-full md:w-1/2 p-8 md:items-center md:justify-center max-w-xl bg-white">
            <div className="w-full">
              <h3 className="text-xl font-semibold text-center text-emerald-600 mb-4">
                Verify OTP
              </h3>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-center tracking-widest"
              />
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  OTP sent to{" "}
                  <strong className="text-emerald-500">{formData.email}</strong>
                </p>
                <button
                  onClick={resendOTP}
                  className="text-emerald-600 font-semibold text-sm"
                >
                  Resend OTP
                </button>
              </div>

              <button
                onClick={handleOtpVerify}
                disabled={loading}
                className={`w-full bg-emerald-500 text-white py-2 rounded-lg transition duration-300 ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-emerald-600"
                }`}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
