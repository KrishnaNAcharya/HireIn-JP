import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Spinner from '../components/Spinner';

export default function FindJobs() {
  const [jobType, setJobType] = useState([]);
  const [timings, setTimings] = useState([]);
  const [eligibility, setEligibility] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const searchQuery = location.state?.searchQuery || '';
  const isCategory = location.state?.isCategory || false;
  const filterType = location.state?.filterType;
  const filterValue = location.state?.filterValue;
  const isFilter = location.state?.isFilter;

  const handleJobTypeChange = (event) => {
    const value = event.target.value;
    if (event.target.checked) {
      setJobType([...jobType, value]);
    } else {
      setJobType(jobType.filter(item => item !== value));
    }
  };

  const handleTimingsChange = (event) => {
    const value = event.target.value;
    if (event.target.checked) {
      setTimings([...timings, value]);
    } else {
      setTimings(timings.filter(item => item !== value));
    }
  };

  const handleEligibilityChange = (event) => {
    const value = event.target.value;
    if (event.target.checked) {
      setEligibility([...eligibility, value]);
    } else {
      setEligibility(eligibility.filter(item => item !== value));
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsCol = collection(db, 'jobs');
        const jobsSnapshot = await getDocs(jobsCol);
        const jobsList = jobsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setJobs(jobsList);
        
        // If search query is empty, show all jobs
        setFilteredJobs(jobsList);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []); // Remove searchQuery dependency

  useEffect(() => {
    // Set initial filter and check corresponding checkbox
    if (isFilter && filterType && filterValue) {
      // Set the filter state
      switch (filterType) {
        case 'jobType':
          setJobType([filterValue]);
          // Find and check the corresponding checkbox
          const jobTypeCheckbox = document.getElementById(getCheckboxId(filterValue));
          if (jobTypeCheckbox) jobTypeCheckbox.checked = true;
          break;
        case 'timings':
          setTimings([filterValue]);
          const timingsCheckbox = document.getElementById(getCheckboxId(filterValue));
          if (timingsCheckbox) timingsCheckbox.checked = true;
          break;
        case 'eligibility':
          setEligibility([filterValue]);
          const eligibilityCheckbox = document.getElementById(getCheckboxId(filterValue));
          if (eligibilityCheckbox) eligibilityCheckbox.checked = true;
          break;
        default:
          break;
      }
    }
  }, [isFilter, filterType, filterValue]);

  // Helper function to convert filter values to checkbox IDs
  const getCheckboxId = (value) => {
    const valueToId = {
      'In Office': 'inOffice',
      'Work from Home': 'workFromHome',
      'Hybrid': 'hybrid',
      'Full Time': 'fullTime',
      'Part Time': 'partTime',
      'Flex Time': 'flexTime',
      'Professionals': 'professionals',
      'College Students': 'collegeStudents'
    };
    return valueToId[value];
  };

  useEffect(() => {
    const filterJobs = () => {
      let filtered = [...jobs];

      if (searchQuery.trim()) {
        if (isCategory) {
          // For category searches, match exact job titles
          filtered = filtered.filter(job => 
            job.jobName?.toLowerCase().includes(searchQuery) ||
            job.jobType?.toLowerCase().includes(searchQuery)
          );
        } else {
          // For regular searches, keep existing broad search
          filtered = filtered.filter(job => 
            job.jobName?.toLowerCase().includes(searchQuery) ||
            job.compName?.toLowerCase().includes(searchQuery) ||
            job.location?.toLowerCase().includes(searchQuery) ||
            job.jobType?.toLowerCase().includes(searchQuery) ||
            job.jobDescription?.toLowerCase().includes(searchQuery)
          );
        }
      }

      // Apply other filters
      if (jobType.length > 0) {
        filtered = filtered.filter(job => {
          const jobTypeValue = job.jobType ? job.jobType.toLowerCase() : '';
          return jobType.some(type => jobTypeValue.includes(type.toLowerCase()));
        });
      }

      if (timings.length > 0) {
        filtered = filtered.filter(job => {
          const timingsValue = job.timings ? job.timings.toLowerCase() : '';
          return timings.some(timing => timingsValue.includes(timing.toLowerCase()));
        });
      }

      if (eligibility.length > 0) {
        filtered = filtered.filter(job => {
          const eligibilityValue = job.eligibility ? job.eligibility.toLowerCase() : '';
          return eligibility.some(elig => eligibilityValue.includes(elig.toLowerCase()));
        });
      }

      setFilteredJobs(filtered);
    }

    filterJobs();
  }, [jobType, timings, eligibility, jobs, searchQuery, isCategory]);

  const handleJobClick = (job) => {
    navigate('/job', { state: { selectedJob: job } });
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
          {/* Filtering Options - Collapsible on mobile */}
          <div className="w-full md:w-1/4 md:sticky md:top-20 h-fit">
            {/* Filter sections */}
            <div className="space-y-4">
              {/* Job Type Filter */}
              <div className="bg-white/20 rounded-lg p-4 md:p-6 shadow-[0_0_10px_purple]">
                <h3 className="text-lg font-bold text-white mb-4">Job Type</h3>
                <div className="flex flex-col gap-2">
                  <div className="mb-2 flex items-center">
                    <input
                      type="checkbox"
                      id="inOffice"
                      value="In Office"
                      onChange={handleJobTypeChange}
                      className="mr-2 rounded-full"
                    />
                    <label htmlFor="inOffice" className="text-white">
                      In Office
                    </label>
                  </div>
                  <div className="mb-2 flex items-center">
                    <input
                      type="checkbox"
                      id="workFromHome"
                      value="Work from Home"
                      onChange={handleJobTypeChange}
                      className="mr-2 rounded-full"
                    />
                    <label htmlFor="workFromHome" className="text-white">
                      Work from Home
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hybrid"
                      value="Hybrid"
                      onChange={handleJobTypeChange}
                      className="mr-2 rounded-full"
                    />
                    <label htmlFor="hybrid" className="text-white">
                      Hybrid
                    </label>
                  </div>
                </div>
              </div>

              {/* Timings Filter */}
              <div className="bg-white/20 rounded-lg p-4 md:p-6 shadow-[0_0_10px_purple]">
                <h3 className="text-lg font-bold text-white mb-4">Timings</h3>
                <div className="flex flex-col gap-2">
                  <div className="mb-2 flex items-center">
                    <input
                      type="checkbox"
                      id="fullTime"
                      value="Full Time"
                      onChange={handleTimingsChange}
                      className="mr-2 rounded-full"
                    />
                    <label htmlFor="fullTime" className="text-white">
                      Full Time
                    </label>
                  </div>
                  <div className="mb-2 flex items-center">
                    <input
                      type="checkbox"
                      id="partTime"
                      value="Part Time"
                      onChange={handleTimingsChange}
                      className="mr-2 rounded-full"
                    />
                    <label htmlFor="partTime" className="text-white">
                      Part Time
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="flexTime"
                      value="Flex Time"
                      onChange={handleTimingsChange}
                      className="mr-2 rounded-full"
                    />
                    <label htmlFor="flexTime" className="text-white">
                      Flex Time
                    </label>
                  </div>
                </div>
              </div>

              {/* Eligibility Filter */}
              <div className="bg-white/20 rounded-lg p-4 md:p-6 shadow-[0_0_10px_purple]">
                <h3 className="text-lg font-bold text-white mb-4">Eligibility</h3>
                <div className="flex flex-col gap-2">
                  <div className="mb-2 flex items-center">
                    <input
                      type="checkbox"
                      id="professionals"
                      value="Professionals"
                      onChange={handleEligibilityChange}
                      className="mr-2 rounded-full"
                    />
                    <label htmlFor="professionals" className="text-white">
                      Professionals
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="collegeStudents"
                      value="College Students"
                      onChange={handleEligibilityChange}
                      className="mr-2 rounded-full"
                    />
                    <label htmlFor="collegeStudents" className="text-white">
                      College Students
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="flex-1">
            <div className="grid gap-4">
              {filteredJobs.map((job, index) => (
                <div
                  key={`${index}-${job.jobName}`}
                  onClick={() => handleJobClick(job)}
                  className="bg-white/20 rounded-lg p-4 md:p-6 shadow-[0_0_10px_purple] cursor-pointer hover:transform hover:scale-[1.02] transition-all"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex justify-center md:justify-start">
                      <img 
                        src={job.image} 
                        alt="" 
                        className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white"
                      />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-lg font-bold text-white mb-2">{job.jobName}</h3>
                      <p className="text-gray-400 mb-2">{job.compName}</p>
                      <p className="text-gray-400 mb-4">{job.location}</p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
                        <span className="bg-green-300 text-white px-2 py-1 rounded-full text-sm">
                          {job.jobType}
                        </span>
                        <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                          {job.timings}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-300">Eligibility: {job.eligibility}</p>
                        <p className="text-gray-300">Deadline: {job.applicationDeadline}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}