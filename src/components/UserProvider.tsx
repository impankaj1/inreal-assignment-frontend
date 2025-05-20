"use client";

import { useEffect } from "react";
import { initUser } from "@/lib/initUser";
import { accessToken } from "@/app/axiosInstance";

export function UserProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (accessToken) {
      initUser();
    }
  }, []);

  return <>{children}</>;
}
