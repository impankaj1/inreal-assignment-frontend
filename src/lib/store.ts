import { User } from "@/types/User";
import { Job } from "@/types/Jobs";
import { create } from "zustand";

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

interface JobState {
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  clearJobs: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export const useJobStore = create<JobState>((set) => ({
  jobs: [],
  setJobs: (jobs) => set({ jobs }),
  clearJobs: () => set({ jobs: [] }),
}));
