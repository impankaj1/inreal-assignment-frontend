"use client";

import axiosInstance from "@/app/axiosInstance";
import { Button } from "@/components/ui/button";
import { jobFormValues, UserEditDialog } from "@/components/UserEditDialog";
import { BACKEND_BASE_URL } from "@/helpers/helper";
import { useUserStore } from "@/lib/store";
import { User } from "@/types/User";
import { Loader2, Pencil, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserDetailsPage = () => {
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const getUser = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `${BACKEND_BASE_URL}/users/${userId}`
      );
      setUser(res.data);
      setLoading(false);
    } catch (error) {
      toast.error("Error occurred while fetching user");
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleEditUser = async (
    values: jobFormValues,
    resetForm: () => void
  ) => {
    try {
      const res = await axiosInstance.put(
        `${BACKEND_BASE_URL}/users/${userId}`,
        values
      );
      if (res.status === 200) {
        toast.success("User updated successfully");
        setOpenEditDialog(false);
        setUser(res.data);
        resetForm();
      }
    } catch (error) {
      toast.error("Error occurred while updating user");
    }
  };
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Details</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setOpenEditDialog(true);
            }}
            disabled={loading}
          >
            <Pencil />
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center h-[100vh] items-center">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-medium">Name</h2>
            <p className="text-sm text-gray-500">{user?.name}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-medium">Email</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-medium">Role</h2>
            <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-medium">Location</h2>
            <p className="text-sm text-gray-500">{user?.location}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-medium">Created At</h2>
            <p className="text-sm text-gray-500">
              {user?.createdAt?.toLocaleString()}
            </p>
          </div>
          {user?.role !== "admin" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-medium">Experience</h2>
                <p className="text-sm text-gray-500">
                  {user?.experience} years
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-medium">Skills</h2>
                <p className="text-sm text-gray-500 capitalize">
                  {user?.skills.join(", ")}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-medium">Preferred Job Type</h2>
                <p className="text-sm text-gray-500 capitalize">
                  {user?.preferred_job_type}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-medium">Created At</h2>
            <p className="text-sm text-gray-500">
              {user?.createdAt?.toLocaleString().split("T")[0]}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-medium">Updated At</h2>
            <p className="text-sm text-gray-500">
              {user?.updatedAt?.toLocaleString().split("T")[0]}
            </p>
          </div>
        </div>
      )}
      {openEditDialog && (
        <UserEditDialog
          user={user!}
          handleEditUser={handleEditUser}
          isEditDialogOpen={openEditDialog}
          setIsEditDialogOpen={setOpenEditDialog}
        />
      )}
    </div>
  );
};

export default UserDetailsPage;
