import React from 'react';
import { useLocation } from 'react-router-dom';
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { MdLocationOn } from "react-icons/md";

const Job = () => {
  const location = useLocation();
  const selectedJob = location.state?.selectedJob;

  if (!selectedJob) {
    return <div>No job selected</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 md:p-8 bg-black text-white">
      <div className="w-full max-w-4xl bg-black p-4 md:p-8 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
          <img
            src={selectedJob.image}
            alt={selectedJob.jobName}
            className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full"
          />
          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold mb-2">{selectedJob.jobName}</h3>
            <p className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
              <HiOutlineBuildingOffice2 /> {selectedJob.compName}
            </p>
            <p className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
              <MdLocationOn className="h-4 w-4 text-green-600" />{selectedJob.location}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-green-300 text-white px-3 py-1 rounded-full text-sm">
            {selectedJob.jobType}
          </span>
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
            {selectedJob.timings}
          </span>
        </div>

        <div className="space-y-4 text-sm md:text-base">
          <p className="text-gray-300">
            <span className="font-semibold">Eligibility:</span> {selectedJob.eligibility}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold">Application Deadline:</span> {selectedJob.applicationDeadline}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold">Salary:</span> {selectedJob.salary}
          </p>
          <div className="text-gray-300">
            <p className="font-semibold mb-2">Job Description:</p>
            <p className="whitespace-pre-wrap">{selectedJob.jobDescription}</p>
          </div>
        </div>

        <a
          href={selectedJob.apUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full md:w-auto text-center bg-purple-700 hover:bg-purple-300 text-white font-bold py-2 px-6 rounded-md mt-6"
        >
          Apply Now
        </a>
      </div>
    </div>
  );
};

export default Job;