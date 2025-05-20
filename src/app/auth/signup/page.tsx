"use client";

import { FC, memo, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
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
import { Eye, Loader2 } from "lucide-react";
import axiosInstance, { setAccessToken } from "@/app/axiosInstance";
import { redirect, useRouter } from "next/navigation";
import { BACKEND_BASE_URL } from "@/helpers/helper";
import { useUserStore } from "@/lib/store";
import { SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { SelectTrigger } from "@/components/ui/select";
import { Select } from "@/components/ui/select";
import { Role } from "@/enums/Roles";
import { skills } from "@/enums/Skills";
const SignUpPage: FC = () => {
  const formSchema = z.object({
    name: z.string().nonempty(),
    email: z.string().email("Please enter a valid email id").nonempty(),
    password: z.string().nonempty().min(8),
    location: z.string().nonempty(),
    role: z.nativeEnum(Role),
    skills: z.array(z.string()).optional(),
    experience: z.string().optional(),
    preferred_job_type: z.nativeEnum(JobTypes).optional(),
  });
  const router = useRouter();

  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const setUser = useUserStore((state) => state.setUser);

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      location: "",
      role: Role.USER,
      skills: [],
      experience: "",
      preferred_job_type: JobTypes.REMOTE,
    },
  });

  const onFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const skills = values.skills;
    if (form.watch("role") === Role.USER && skills?.length === 0) {
      form.setError("skills", { message: "Skills are required" });
      toast.error("Skills are required");

      setIsLoading(false);
      return;
    }

    const experience = parseInt(values.experience || "0");
    if (experience < 0) {
      toast.error("Experience must be greater than 0");
      setIsLoading(false);
      return;
    }

    const res = await axiosInstance
      .post(`${BACKEND_BASE_URL}/auth/signup`, { ...values, experience })
      .then((res) => res)
      .catch((err) => {
        toast.error(err.response.data.message);
        return;
      });

    if (res?.status === 200) {
      setAccessToken(res.data.token);
      form.reset();
      setUser(res.data.user);
      toast.success("User created successfully");
      router.push(`/dashboard`);
    }
    setIsLoading(false);
  };

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordTypeChange = () => setShowPassword(!showPassword);

  const handleSkillsChange = (value: string[]) => {
    form.setValue("skills", value);
    setSelectedSkills(value);
  };

  return (
    <div className="flex h-[100vh] overflow-y-hidden flex-col items-center justify-center ">
      <h1 className="font-bold text-2xl">Create your new account</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onFormSubmit)}
          className="w-5/6 sm:w-3/4 max-h-3/4 overflow-y-auto md:w-1/2 p-4 md:p-10 m-2 outline outline-gray-100 shadow-2xl rounded-2xl bg-gradient-to-br from-secondary/40 via-secondary/90 to-secondary/40  text-white space-y-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Name</FormLabel>
                <FormControl>
                  <Input
                    className="text-foreground"
                    placeholder="Enter your name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="text-foreground w-full">
                  <FormLabel className="text-foreground w-full">Role</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue
                          className="text-foreground"
                          placeholder="Select a role"
                        />
                      </SelectTrigger>
                      <SelectContent className="text-foreground">
                        <SelectItem value={Role.USER}>User</SelectItem>
                        <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferred_job_type"
              render={({ field }) => (
                <FormItem className="text-foreground w-full">
                  <FormLabel className="text-foreground">
                    Preferred Job Type
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="text-foreground">
                        <SelectValue
                          className="text-foreground"
                          placeholder="Select a preferred job type"
                        />
                      </SelectTrigger>
                      <SelectContent className="text-foreground">
                        <SelectItem value={JobTypes.REMOTE}>Remote</SelectItem>
                        <SelectItem value={JobTypes.HYBRID}>Hybrid</SelectItem>
                        <SelectItem value={JobTypes.ONSITE}>On-Site</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Email</FormLabel>
                <FormControl>
                  <Input
                    className="text-foreground"
                    placeholder="Enter your email here"
                    {...field}
                  />
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
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Location</FormLabel>
                <FormControl>
                  <Input
                    className="text-foreground"
                    placeholder="Enter your location here"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("role") === Role.USER && (
            <>
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
                        className="text-foreground"
                        placeholder="Enter your experience here"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2">
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
                {selectedSkills.length !== 0 && (
                  <span className="text-foreground font capitalize">
                    Selected Skills: {selectedSkills.join(", ")}
                  </span>
                )}
              </div>
            </>
          )}

          <Button className="w-full mt-2" type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : "Submit"}
          </Button>
        </form>
      </Form>
      <div className="mt-4">
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
