import { BACKEND_BASE_URL } from "@/helpers/helper";
import axiosInstance from "@/app/axiosInstance";
import { useUserStore } from "./store";
import { toast } from "react-toastify";

export const initUser = async () => {
  try {
    const response = await axiosInstance.get(`${BACKEND_BASE_URL}/auth/me`);
    if (response.status === 200) {
      useUserStore.getState().setUser(response.data);
    }
  } catch (error) {
    toast.error("Failed to fetch user");
  }
};
