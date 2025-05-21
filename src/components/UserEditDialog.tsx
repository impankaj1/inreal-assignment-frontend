"use client";

import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { JobTypes } from "@/enums/JobTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormLabel,
  FormMessage,
  FormItem,
  FormControl,
  FormField,
} from "./ui/form";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectValue,
  SelectItem,
  SelectContent,
  SelectTrigger,
} from "./ui/select";
import { Loader2 } from "lucide-react";
import { Job } from "@/types/Jobs";
import { Role } from "@/enums/Roles";
import { User } from "@/types/User";
import MultiSelect from "./ui/multi-select";
import { skills } from "@/enums/Skills";

const formSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email("Please enter a valid email id").nonempty(),
  location: z.string().nonempty(),
  role: z.nativeEnum(Role),
  skills: z.array(z.string()),
  experience: z.string().nonempty(),
  preferred_job_type: z.nativeEnum(JobTypes).optional(),
});

export type jobFormValues = z.infer<typeof formSchema>;

interface UserEditDialogProps {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  handleEditUser?: (values: jobFormValues, resetForm: () => void) => void;
  user: User;
}

export function UserEditDialog(props: UserEditDialogProps) {
  const { handleEditUser, isEditDialogOpen, setIsEditDialogOpen, user } = props;

  const form = useForm<jobFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      location: user.location || "",
      role: user.role as Role,
      skills: user.skills || [],
      experience: String(user.experience) || "",
      preferred_job_type:
        (user.preferred_job_type as JobTypes) || JobTypes.REMOTE,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    user.skills || []
  );

  const onFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    handleEditUser?.(values, () => form.reset());
    setIsLoading(false);
  };

  const handleSkillsChange = (value: string[]) => {
    form.setValue("skills", value);
    setSelectedSkills(value);
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-1/2">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="overflow-y-auto  text-white space-y-8"
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
            {form.watch("role") === Role.USER && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="text-foreground w-full ">
                      <FormLabel className="text-foreground w-full">
                        Role
                      </FormLabel>
                      <FormControl>
                        <Select
                          disabled
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
                    <FormItem className="text-foreground w-full ">
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
                            <SelectItem value={JobTypes.REMOTE}>
                              Remote
                            </SelectItem>
                            <SelectItem value={JobTypes.HYBRID}>
                              Hybrid
                            </SelectItem>
                            <SelectItem value={JobTypes.ONSITE}>
                              On-Site
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
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
                        <FormLabel className="text-foreground">
                          Skills
                        </FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={skills}
                            label="Select your skills"
                            onChange={handleSkillsChange}
                            selectedOptions={selectedSkills}
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
      </DialogContent>
    </Dialog>
  );
}
