"use client";

import { Button } from "@/components/ui/button";
import { Vortex } from "@/components/ui/vortex";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <div className="w-[calc(100%-2rem)] mx-auto rounded-md  h-[calc(100vh-5rem)] overflow-hidden">
      <Vortex
        backgroundColor="whitecolor-mix(in oklab, var(--background) 20%, transparent);"
        rangeY={800}
        particleCount={500}
        baseHue={120}
        className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
      >
        <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
          Welcome to the Job Portal
        </h2>
        <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
          We are a team of experienced professionals who are dedicated to
          providing the best possible job portal for the people of India.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <Button onClick={() => redirect("/auth/login")}>Get Started</Button>
        </div>
      </Vortex>
    </div>
  );
}
