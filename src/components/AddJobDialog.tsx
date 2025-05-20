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

const formSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  location: z.string().nonempty(),
  salary: z.string().nonempty(),
  jobType: z.nativeEnum(JobTypes),
  company: z.string().nonempty(),
});

export type jobFormValues = z.infer<typeof formSchema>;

interface AddJobDialogProps {
  isAddJobDialogOpen: boolean;
  setIsAddJobDialogOpen: (isOpen: boolean) => void;
  handleJobUpdate?: (values: jobFormValues, resetForm: () => void) => void;
  handleAddJob?: (values: jobFormValues, resetForm: () => void) => void;
  isEdit?: boolean;
  job?: Job;
}

export function AddJobDialog(props: AddJobDialogProps) {
  const {
    handleAddJob,
    isAddJobDialogOpen,
    setIsAddJobDialogOpen,
    handleJobUpdate,
    isEdit,
    job,
  } = props;

  const form = useForm<jobFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: job?.title || "",
      description: job?.description || "",
      location: job?.location || "",
      salary: job?.salary?.toString() || "",
      jobType: (job?.jobType as JobTypes) || JobTypes.REMOTE,
      company: job?.company || "",
    },
  });
  console.log("job", job);
  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const salary = parseInt(values.salary);
    if (salary < 0) {
      toast.error("Salary must be greater than 0");
      setIsLoading(false);
      return;
    }

    if (isEdit && !handleJobUpdate) {
      toast.error("No function to update the job");
      setIsLoading(false);
      return;
    }

    if (!isEdit && !handleAddJob) {
      toast.error("No function to add the job");
      setIsLoading(false);
      return;
    }

    if (isEdit) {
      handleJobUpdate?.(values, form.reset);
    } else {
      handleAddJob?.(values, form.reset);
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={isAddJobDialogOpen} onOpenChange={setIsAddJobDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Job</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-1/2">
        <DialogHeader>
          <DialogTitle>Add Job</DialogTitle>
          <DialogDescription>Add a new job to the database.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="overflow-y-auto    text-white space-y-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Title</FormLabel>
                  <FormControl>
                    <Input
                      className="text-foreground"
                      placeholder="Enter the job title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="text-foreground"
                      placeholder="Enter the job description"
                      {...field}
                    />
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
                      placeholder="Enter the job location"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Salary</FormLabel>
                  <FormControl>
                    <Input
                      className="text-foreground"
                      type="number"
                      placeholder="Enter the job salary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Job Type</FormLabel>
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
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Company</FormLabel>
                  <FormControl>
                    <Input
                      className="text-foreground"
                      placeholder="Enter the job company"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full mt-2" type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
