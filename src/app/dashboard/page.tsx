"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/axiosInstance";
import { Job } from "@/types/Jobs";
import { Button } from "@/components/ui/button";
import { BACKEND_BASE_URL } from "@/helpers/helper";
import { useJobStore, useUserStore } from "@/lib/store";
import { toast } from "react-toastify";
import { Role } from "@/enums/Roles";
import { AddJobDialog, jobFormValues } from "@/components/AddJobDialog";
import { Loader2, Pencil, Trash } from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";

const DashboardPage = () => {
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const [isAddJobDialogOpen, setIsAddJobDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job>();
  const [isEdit, setIsEdit] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showClearMatches, setShowClearMatches] = useState(false);
  const jobs = useJobStore((state) => state.jobs);
  const setJobs = useJobStore((state) => state.setJobs);

  const fetchJobs = async (): Promise<Job[]> => {
    let response;
    
    if (user?.role === Role.USER) {
      response = await axiosInstance
        .get(`${BACKEND_BASE_URL}/jobs/`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    } else {
      response = await axiosInstance
        .get(`${BACKEND_BASE_URL}/jobs/user/${user?._id}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    }
    return response;
  };
  const getJobs = async () => {
    setLoading(true);
    try {
      const data = await fetchJobs();
      setJobs(data);
    } catch (error) {
      toast.error("Error fetching jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (values: jobFormValues, resetForm: () => void) => {
    const salary = parseInt(values.salary);
    const res = await axiosInstance
      .post(`${BACKEND_BASE_URL}/jobs/`, {
        ...values,
        createdBy: user?._id,
        salary,
      })
      .then((res) => res)
      .catch((err) => {
        toast.error(err.response.data.message);
        return;
      });
    if (res?.status === 200) {
      resetForm();
      toast.success("Job created successfully");
      setIsAddJobDialogOpen(false);
      getJobs();
    }
  };

  const handleJobUpdate = async (
    values: jobFormValues,
    resetForm: () => void
  ) => {
    const salary = parseInt(values.salary);
    const res = await axiosInstance
      .put(`${BACKEND_BASE_URL}/jobs/${selectedJob?._id}`, {
        ...values,
        createdBy: user?._id,
        salary,
      })
      .then((res) => res)
      .catch((err) => {
        toast.error(err.response.data.message);
        return;
      });
    if (res?.status === 200) {
      toast.success("Job updated successfully");
      setIsAddJobDialogOpen(false);
      getJobs();
      resetForm();
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    const res = await axiosInstance.delete(`${BACKEND_BASE_URL}/jobs/${jobId}`);

    if (res?.status === 200) {
      toast.success("Job deleted successfully");
      getJobs();
    }
  };
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
    getJobs();
  }, [user]);

  const handleFindMatches = async () => {
    setLoading(true);
    try {
      const data = await fetchMatches();
      setJobs(data);
      setShowClearMatches(true);
    } catch (error) {
      toast.error("Error fetching matched jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleClearMatches = () => {
    getJobs();
    setShowClearMatches(false);
  };

  const handleDialogClose = () => {
    setIsAddJobDialogOpen(false);
    setIsEdit(false);
    setSelectedJob(undefined);
  };

  const toggleDeleteDialog = () => {
    setIsDeleteDialogOpen(!isDeleteDialogOpen);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between  p-4 items-center">
        <h1 className="text-2xl font-bold ">Available Jobs</h1>
        {user?.role === Role.USER ? (
          <div className="flex gap-5">
            {showClearMatches ? (
              <Button onClick={handleClearMatches}>Clear Matches</Button>
            ) : (
              <Button onClick={handleFindMatches}>Find My Matches</Button>
            )}
          </div>
        ) : (
          <Button
            onClick={() => {
              setSelectedJob(undefined);
              setIsEdit(false);
              setIsAddJobDialogOpen(true);
            }}
          >
            Add Job
          </Button>
        )}
      </div>
      <div>
        {loading ? (
          <div className="flex w-full justify-center items-center h-[100vh]">
            <Loader2 className="animate-spin" />
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="border rounded-lg space-y-2 p-4 bg-background/90 shadow-md flex flex-col justify-between gap-2 hover:shadow-2xl hover:scale-101 ease-in-out duration-300 transition-shadow"
              >
                <div className="flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xl font-semibold text-primary">
                      {job.title}
                    </h2>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setSelectedJob(job);
                          setIsEdit(true);
                          setIsAddJobDialogOpen(true);
                        }}
                      >
                        <Pencil />
                      </Button>
                      <ConfirmDialog
                        open={isDeleteDialogOpen}
                        trigger={
                          <Button onClick={toggleDeleteDialog}>
                            <Trash />
                          </Button>
                        }
                        title="Are you sure?"
                        description="This action cannot be undone."
                        onConfirm={() => handleDeleteJob(job._id)}
                        onCancel={toggleDeleteDialog}
                      />
                    </div>
                  </div>
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
            ))}
          </div>
        ) : (
          <div className="text-center h-[100vh] w-full flex items-center justify-center text-gray-500">
            No jobs found
          </div>
        )}
      </div>
      {isAddJobDialogOpen && (
        <AddJobDialog
          handleAddJob={handleAddJob}
          isAddJobDialogOpen={isAddJobDialogOpen}
          setIsAddJobDialogOpen={handleDialogClose}
          isEdit={isEdit}
          job={selectedJob}
          handleJobUpdate={handleJobUpdate}
        />
      )}
    </div>
  );
};

export default DashboardPage;
