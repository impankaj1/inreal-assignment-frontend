"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/axiosInstance";
import { Job } from "@/types/Jobs";
import { Button } from "@/components/ui/button";
import { BACKEND_BASE_URL } from "@/helpers/helper";
import { useUserStore } from "@/lib/store";
import { toast } from "react-toastify";
const DashboardPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const user = useUserStore.getState().user;

  const fetchJobs = async (): Promise<Job[]> => {
    const response = await axiosInstance
      .get(`${BACKEND_BASE_URL}/jobs/`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });

    return response;
  };
  console.log("user", user);
  const fetchMatches = async (): Promise<Job[]> => {
    if (!user) {
      toast.error("User not found");
      return [];
    }
    const response = await axiosInstance
      .get(`${BACKEND_BASE_URL}/jobs/matches/${user._id}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        return err;
      });

    return response;
  };

  useEffect(() => {
    const getJobs = async () => {
      try {
        const data = await fetchJobs();
        setJobs(data);
      } catch (error) {
        console.log(error);
      }
    };

    getJobs();
  }, []);

  const handleFindMatches = async () => {
    const data = await fetchMatches();
    setJobs(data);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Available Jobs</h1>
        <Button onClick={handleFindMatches}>Find My Matches</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div
              key={job._id}
              className="border rounded-lg space-y-2 p-4 bg-background/90 shadow-md flex flex-col justify-between gap-2 hover:shadow-2xl hover:scale-101 ease-in-out duration-300 transition-shadow"
            >
              <div className="flex flex-col justify-between gap-2">
                <h2 className="text-xl font-semibold text-primary">
                  {job.title}
                </h2>
                <p className="text-gray-400">{job.company}</p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-gray-500">{job.location}</p>
                <p className="text-gray-500 capitalize">{job.jobType}</p>
              </div>
              <div className="flex flex-col justify-between gap-2">
                <p className="">{job.description}</p>
                <p className=" font-semibold">Salary: {job.salary}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No jobs found</div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
