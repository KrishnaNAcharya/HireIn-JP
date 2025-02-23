"use client";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import homeImage from '../assets/Home.png';
import Phone from '../assets/Phones.png';
import Slide from '../components/Slide';
import { db } from '../firebase';
import { orderBy, limit, getDocs, collection, query } from "firebase/firestore";
import JobItem from '../components/JobItem';
import Candidate from '../assets/Candidate.png';
import Employer from '../assets/Employer.png';
import Spinner from '../components/Spinner';

const Home = () => {
  const contactUsRef = useRef(null);
  const navigate = useNavigate();

  const [recentJobs, setRecentJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const jobsRef = collection(db, "jobs");
        const q = query(jobsRef, orderBy("createdAt", "desc"), limit(4));
        const querySnapshot = await getDocs(q);
        const jobs = [];
        querySnapshot.forEach((doc) => {
          jobs.push({ id: doc.id, data: doc.data() });
        });
        setRecentJobs(jobs);
        setIsLoading(false); // Set isLoading to false after data is fetched
      } catch (error) {
        console.error("Error fetching recent jobs:", error);
        setIsLoading(false); // Set isLoading to false even if there's an error
      }
    };

    fetchRecentJobs();
  }, []);

  const handleCategoryClick = (filterType, value) => {
    navigate('/find-jobs', { 
      state: { 
        filterType, // 'jobType', 'timings', or 'eligibility'
        filterValue: value,
        isFilter: true
      } 
    });
  };

  const handleJobClick = (job) => {
    navigate('/job', { state: { selectedJob: job } });
  };

  const handleGetStarted = () => {
    navigate('/find-jobs');
  };

  return (
    <section className='min-h-screen w-full relative px-4 md:px-8'>
      {isLoading ? (
        <div className="absolute inset-0 flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <>
          {/* Background blobs */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute w-48 md:w-96 h-48 md:h-96 rounded-full bg-blue-300/40 blur-[80px] -bottom-20 md:bottom-[85vh] -right-20 md:right-[140vh] animate-pulse"></div>
            <div className="absolute w-36 md:w-72 h-36 md:h-72 rounded-full bg-orange-500/40 blur-[80px] bottom-[35vh] right-10 md:right-20 animate-pulse"></div>
            <div className="absolute w-48 md:w-96 h-48 md:h-96 rounded-full bg-purple-300/40 blur-[80px] top-[30vh] right-20 md:right-40 animate-pulse"></div>
          </div>

          {/* Hero Section */}
          <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto pt-20 md:pt-32">
            <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
              <h1 className="text-3xl md:text-5xl text-transparent font-bold mb-6 bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500 bg-clip-text">
                Find your future today!
              </h1>
              <p className="text-xl md:text-2xl text-white mb-4">Where Talent Finds Home</p>
              <p className="text-sm md:text-base text-gray-400 mb-8">
                Welcome to HireIn, where talent meets opportunity.<br />
                Be productive be employed.
              </p>
              <button
                onClick={handleGetStarted}
                className="px-6 py-3 md:py-4 font-bold bg-black hover:bg-purple-800 text-white shadow-[0_0_30px_purple] rounded-full w-full md:w-auto"
              >
                Get Started
              </button>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <img
                src={homeImage}
                alt="Website Info"
                className="w-[80%] md:w-[70%] h-auto"
              />
            </div>
          </div>

          <Slide />

          {/* Cards Section */}
          <div className="flex flex-col md:flex-row gap-6 justify-center max-w-7xl mx-auto my-20 md:my-40">
            {/* Employer Card */}
            <div className="w-full md:w-[400px] bg-blue-200 rounded-lg p-6 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-xl font-bold text-white mb-4">For Employers</h2>
                <p className="mb-6">Find Professionals from around the world and across all skills</p>
                <Link
                  to="/upload-job"
                  className="inline-block bg-black hover:bg-purple-800 text-white shadow-[0_0_10px_purple] font-bold py-2 px-6 rounded-full"
                >
                  Upload a Job
                </Link>
              </div>
              <img
                src={Employer}
                alt="Employer"
                className="absolute -right-20 -bottom-20 w-2/3 opacity-50 md:opacity-100"
              />
            </div>

            {/* Candidate Card */}
            <div className="w-full md:w-[400px] bg-red-200 rounded-lg p-6 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-xl font-bold text-white mb-4">For Candidates</h2>
                <p className="mb-6">Build your professional Profile and find new Job Opportunities</p>
                <Link
                  to="find-jobs"
                  className="inline-block bg-black hover:bg-purple-800 text-white shadow-[0_0_10px_purple] font-bold py-2 px-6 rounded-full"
                >
                  Find Jobs
                </Link>
              </div>
              <img
                src={Candidate}
                alt="Candidate"
                className="absolute -right-20 -bottom-20 w-2/3 opacity-50 md:opacity-100"
              />
            </div>
          </div>

          {/* Phone Section */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-7xl mx-auto my-20">
            <div className="w-full md:w-1/2">
              <img src={Phone} alt="Mobile app" className="w-full max-w-md mx-auto" />
            </div>
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h2 className="text-2xl md:text-4xl text-transparent font-bold bg-gradient-to-r from-green-200 to-blue-300 bg-clip-text">
                Find Your Dream Job
              </h2>
            </div>
          </div>

          {/* Job Type Buttons */}
          <div className="max-w-7xl mx-auto my-10">
            <div className="flex justify-center mb-4 mt-17">
              <button 
                onClick={() => handleCategoryClick('jobType', 'In Office')} 
                className="flex items-center justify-center bg-black hover:bg-gradient-to-r from-green-200 to-blue-500 shadow-lg shadow-blue-500/50 text-white font-bold py-2 px-4 rounded-full mb-2 md:mb-0 md:mr-2 w-full md:w-auto"
              >
                In Office
              </button>
              <button 
                onClick={() => handleCategoryClick('jobType', 'Work from Home')} 
                className="flex items-center justify-center bg-black hover:bg-gradient-to-r from-green-200 to-blue-300 shadow-lg shadow-blue-500/50 text-white font-bold py-2 px-4 rounded-full mb-2 md:mb-0 md:mr-2 w-full md:w-auto ml-3"
              >
                Work from Home
              </button>
              <button 
                onClick={() => handleCategoryClick('jobType', 'Hybrid')} 
                className="flex items-center justify-center bg-black hover:bg-gradient-to-r from-green-200 to-blue-300 shadow-lg shadow-blue-500/50 text-white font-bold py-2 px-4 rounded-full mb-2 md:mb-0 md:mr-2 w-full md:w-auto ml-3"
              >
                Hybrid
              </button>
            </div>

            <div className="flex justify-center mb-20 mt-5">
              <button 
                onClick={() => handleCategoryClick('timings', 'Full Time')} 
                className="flex items-center justify-center bg-black hover:bg-gradient-to-r from-green-200 to-blue-300 shadow-lg shadow-blue-500/50 text-white font-bold py-2 px-4 rounded-full mb-2 md:mb-0 md:mr-2 w-full md:w-auto ml-3"
              >
                Full Time
              </button>
              <button 
                onClick={() => handleCategoryClick('timings', 'Part Time')} 
                className="flex items-center justify-center bg-black hover:bg-gradient-to-r from-green-200 to-blue-300 shadow-lg shadow-blue-500/50 text-white font-bold py-2 px-4 rounded-full mb-2 md:mb-0 md:mr-2 w-full md:w-auto ml-3"
              >
                Part Time
              </button>
              <button 
                onClick={() => handleCategoryClick('timings', 'Flex Time')} 
                className="flex items-center justify-center bg-black hover:bg-gradient-to-r from-green-200 to-blue-300 shadow-lg shadow-blue-500/50 text-white font-bold py-2 px-4 rounded-full mb-2 md:mb-0 md:mr-2 w-full md:w-auto ml-3"
              >
                Flex Time
              </button>
            </div>
          </div>

          {/* Recent Updates */}
          <div className="max-w-7xl mx-auto my-20 px-4">
            <h2 className="text-2xl md:text-4xl text-center text-transparent font-bold mb-10 bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text">
              Recent Updates
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {recentJobs.map((job) => (
                <div key={job.id} onClick={() => handleJobClick(job.data)}>
                  <JobItem job={job.data} id={job.id} handleClick={handleJobClick} />
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-transparent shadow-[0_0_10px_purple] py-8 md:py-12 mt-20" ref={contactUsRef} id="contact">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                  <p className="text-gray-400">Get in touch with us for any inquiries or support.</p>
                </div>
                <div className="mt-6 md:mt-0">
                  <p className="text-gray-400">
                    Email: <a href="mailto:contact@example.com" className="text-white hover:text-purple-500">contact@hirein.in</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default Home;