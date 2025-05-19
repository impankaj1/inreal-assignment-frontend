"use client";

import { FC, memo, useState } from "react";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "react-toastify";
import { JobTypes } from "@/enums/JobTypes";
import MultiSelect from "@/components/ui/multi-select";
import { Eye } from "lucide-react";
import axiosInstance, { setAccessToken } from "@/app/axiosInstance";
import { useRouter } from "next/navigation";
import { BACKEND_BASE_URL } from "@/helpers/helper";

const SignUpPage: FC = () => {
  const formSchema = z.object({
    name: z.string().nonempty(),
    email: z.string().email("Please enter a valid email id").nonempty(),
    phone_no: z.string().optional(),
    password: z.string().nonempty().min(8),
    location: z.string().nonempty(),
    skills: z.array(z.string()).optional(),
    experience: z.number().optional(),
    preferred_job_type: z.nativeEnum(JobTypes).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_no: "",
      password: "",
      location: "",
      skills: [],
      experience: 0,
      preferred_job_type: JobTypes.REMOTE,
    },
  });

  const router = useRouter();

  const onFormSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await axiosInstance
      .post(`${BACKEND_BASE_URL}/auth/signup`, values)
      .then((res) => res)
      .catch((err) => {
        toast.error(err.response.data.message);
        return;
      });

    if (res?.status === 200) {
      setAccessToken(res.data.token);
      form.reset();
      toast.success("User created successfully");
      router.push(`/dashboard`);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordTypeChange = () => setShowPassword(!showPassword);

  const skills = [
    { key: "html", value: "HTML" },
    { key: "css", value: "CSS" },
    { key: "javascript", value: "JavaScript" },
    { key: "react", value: "React" },
    { key: "nodejs", value: "NodeJS" },
    { key: "nextjs", value: "NextJS" },
    { key: "typescript", value: "TypeScript" },
    { key: "python", value: "Python" },
    { key: "java", value: "Java" },
    { key: "c++", value: "C++" },
  ];

  const handleSkillsChange = (value: string[]) => {
    form.setValue("skills", value);
  };

  return (
    <div className="flex h-[100vh] flex-col items-center justify-center ">
      <h1 className="font-bold text-2xl">Create your new account</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onFormSubmit)}
          className="w-1/2 lg:w-1/3  p-10 m-2 outline outline-gray-100 shadow-2xl rounded-2xl bg-gradient-to-br from-secondary/40 via-secondary/90 to-secondary/40  text-white space-y-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Password</FormLabel>
                <FormControl>
                  <div className="relative flex items-center ">
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="text-foreground relative"
                      placeholder="Password"
                      {...field}
                    />
                    <div
                      role="button"
                      onClick={handlePasswordTypeChange}
                      className="absolute right-0 p-2 z-30 cursor-pointer"
                    >
                      <Eye className="text-foreground" />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Phone No.</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your phone no. here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your location here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">
                  Experience ( in years )
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter your experience here"
                    {...field}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value >= 0) {
                        field.onChange(value);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="skills"
            render={() => (
              <FormItem>
                <FormLabel className="text-foreground">Skills</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={skills}
                    label="Select your skills"
                    onChange={handleSkillsChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full mt-2" type="submit">
            Submit
          </Button>
        </form>
      </Form>
      <div>
        <p>
          Already have an account?{" "}
          <span className="">
            <Link className="text-primary underline" href={"/auth/login"}>
              Login
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default memo(SignUpPage);
