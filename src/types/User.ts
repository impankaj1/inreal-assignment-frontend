export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  experience: number;
  preferred_job_type: string;
  skills: string[];
  location: string;
  createdAt: Date;
  updatedAt: Date;
}
