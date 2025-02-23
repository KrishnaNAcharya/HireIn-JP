import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { db } from "../firebase";
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import SignUpImg from '../assets/SignUp.png';
import { toast } from 'react-toastify';
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const { fullName, email, password, confirmPassword, phoneNumber } = formData;
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }
  async function onSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName: fullName });
  
      const formDataCopy = {
        fullName,
        email,
        phoneNumber,
        timestamp: serverTimestamp(),
      };
  
      await setDoc(doc(db, "users", user.uid), formDataCopy);
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong with the registration");
      console.error(error);
    }
  }

  return (
    <section className="min-h-screen flex flex-col lg:flex-row bg-black">
      {/* Left Section - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-2xl"> {/* Changed from max-w-md to max-w-2xl */}
          {/* Mobile Header */}
          <div className="text-center mb-8 lg:hidden">
            <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">
              Create Account
            </h2>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 lg:p-12 w-full"> {/* Increased padding */}
            {/* PC Header */}
            <div className="hidden lg:block text-center mb-8">
              <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">
                Create Account
              </h2>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="mb-4">
                <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  className="shadow appearance-none border rounded-full w-full center py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="fullName"
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="email@abc.com"
                  value={email}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="******"
                    value={password}
                    onChange={onChange}
                    required
                  />
                  <span onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-0 mt-3 mr-4 cursor-pointer">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="confirmPassword"
                  type="password"
                  placeholder="******"
                  value={confirmPassword}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="phoneNumber"
                  type="tel"
                  placeholder="+01 12345678"
                  value={phoneNumber}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <button
                  className="w-full md:w-auto bg-purple-700 hover:bg-purple-900 text-white font-bold py-2 px-6 rounded-full"
                  type="submit"
                >
                  Sign Up
                </button>
                <p className="text-white">OR</p>
                <OAuth />
              </div>
            </form>

            {/* Sign In Link */}
            <p className="mt-8 text-center text-gray-400">
              Already have an account?{' '}
              <Link to="/sign-in" className="text-purple-400 hover:text-purple-300">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Image (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 p-8 items-center justify-center">
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text mb-8">
            Join Our Community
          </h1>
          <img src={SignUpImg} alt="Sign Up" className="w-full animate-float" />
        </div>
      </div>
    </section>
  );
}