import Cookies from "js-cookie";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [OTP, setOTP] = useState("");
  const [withOTP, setWithOTp] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginWithPassword = async () => {
    if (!identifier || !password) {
      toast.warn("Please fill in both fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URI}/user/pass/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, password }),
        }
      );
      const data = await res.json();
      if (!res.ok) return toast.error(data.error || "Login failed");

      toast.success(data.message || "Login successful!");
      Cookies.set("token", data.accessToken, { expires: 1 });
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async () => {
    if (!identifier) return toast.warn("Please enter your email or username");
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URI}/user/otp/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        Cookies.set("token", data.accessToken, { expires: 1 });
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loginWithOTP = async () => {
    if (!identifier || !OTP) {
      toast.warn("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URI}/user/otp/login/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, otp: parseInt(OTP) }),
        }
      );
      const data = await res.json();
      if (!res.ok) return toast.error(data.error || "Login failed");

      Cookies.set("token", data.accessToken, { expires: 1 });
      toast.success(data.message || "Login successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-emerald-50 px-4 py-8">
      <div className="w-full max-w-3xl md:bg-emerald-300 bg-white rounded-2xl flex flex-col md:flex-row overflow-hidden shadow-2xl">
        {/* Image Section */}
        <div className="w-full md:w-1/3 rounded-b-[600px] md:rounded-none flex items-center justify-center p-6 bg-emerald-300">
          <img
            src="./02.png"
            alt="Login Visual"
            className="w-40 h-40 md:w-56 md:h-56 object-cover drop-shadow-2xl"
          />
        </div>

        {/* Login Section */}
        <div className="w-full md:w-2/3 bg-white md:rounded-l-[600px] p-6 md:p-10 flex flex-col justify-center items-center text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-emerald-500">
            Sign In
          </h3>
          <p className="text-sm text-emerald-400 mt-1">
            Welcome back! Don’t forget your daily task
          </p>

          {/* Forms */}
          <div className="w-full p-4">
            <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
              {/* Identifier */}
              <div className="text-left">
                <label className="block mb-1 text-sm text-gray-600">
                  Email or Username
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="you@example.com or username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              {/* Password or OTP */}
              {withOTP ? (
                <div className="text-left">
                  <label className="block mb-1 text-sm text-gray-600">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    required
                    value={OTP}
                    onChange={(e) => setOTP(e.target.value)}
                    placeholder="6-digit OTP"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              ) : (
                <div className="text-left">
                  <label className="block mb-1 text-sm text-gray-600">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="text-xs font-bold text-emerald-700 flex justify-between">
                {withOTP ? (
                  <>
                    <button
                      className="border px-3 py-1 rounded-full"
                      onClick={sendOTP}
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send OTP"}
                    </button>
                    <button onClick={() => setWithOTp(false)}>
                      Login With Password
                    </button>
                  </>
                ) : (
                  <button onClick={() => setWithOTp(true)}>
                    Login With OTP
                  </button>
                )}
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={withOTP ? loginWithOTP : loginWithPassword}
                disabled={loading}
                className="w-full bg-emerald-400 hover:bg-emerald-500 text-white font-semibold py-2 rounded-lg transition duration-300"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </div>

          {/* Signup link */}
          <p className="text-sm text-gray-500 mt-2">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-emerald-500 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
