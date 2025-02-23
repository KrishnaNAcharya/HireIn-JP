import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import LoginImg from '../assets/SignUp.png';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get the user's profile from Firestore
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        navigate('/profile', { state: { userProfile: docSnap.data() } });
      } else {
        toast.error('User profile not found');
      }
    } catch (error) {
      toast.error('Invalid email or password');
      console.error(error);
    }
  }

  return (
    <section className="min-h-screen flex flex-col lg:flex-row bg-black">
      {/* Left Section - Image (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 p-8 items-center justify-center">
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text mb-8">
            Welcome Back!
          </h1>
          <img src={LoginImg} alt="Login" className="w-full animate-float" />
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="text-center mb-8 lg:hidden">
            <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">
              Sign In
            </h2>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 lg:p-10 w-full">
            {/* PC Header */}
            <div className="hidden lg:block text-center mb-8">
              <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">
                Sign In
              </h2>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
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
                    type={showPassword ? 'text' : 'password'}
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
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <button
                  className="w-full md:w-auto bg-purple-700 hover:bg-purple-900 text-white font-bold py-2 px-6 rounded-full"
                  type="submit"
                >
                  Sign In
                </button>
                <p className="text-white">OR</p>
                <OAuth />
              </div>
            </form>

            {/* Sign Up Link */}
            <p className="mt-8 text-center text-gray-400">
              Don't have an account?{' '}
              <Link to="/sign-up" className="text-purple-400 hover:text-purple-300">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}