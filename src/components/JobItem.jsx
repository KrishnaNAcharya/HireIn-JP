import Moment from "react-moment";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

export default function JobItem({ job, handleClick }) {
  return (
    <div className="w-full bg-gray-300 rounded-lg hover:scale-105 transition-transform duration-200 ease-in cursor-pointer shadow-md">
      <div className="relative">
        <img
          className="w-full h-[170px] object-cover rounded-t-lg"
          loading="lazy"
          src={job.image}
          alt=""
        />
        <Moment
          className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-orange-500 text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg"
          fromNow
        >
          {job.createdAt?.toDate()}
        </Moment>
      </div>
      <div className="p-4">
        <div className="flex items-center space-x-1 mb-2">
          <MdLocationOn className="h-4 w-4 text-green-600" />
          <p className="font-semibold text-sm text-gray-600 truncate">
            {job.location}
          </p>
        </div>
        <p className="font-semibold text-xl truncate mb-3">{job.jobName}</p>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-bold px-2 py-1 bg-gray-200 rounded-full">
            {job.jobType}
          </span>
          <span className="text-xs font-bold px-2 py-1 bg-gray-200 rounded-full">
            {job.timings}
          </span>
        </div>
      </div>
    </div>
  );
}