export interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  salary: number;
  jobType: string;
  company: string;
  createdAt: Date;
  updatedAt: Date;
}
