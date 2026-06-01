export interface User {
  id: string;
  name: string;
  email: string;
  role: 'applicant' | 'employer';
}

export interface Company {
  id: string;
  name: string;
  location: string;
  website: string;
  description: string;
  created_at: string;
}

export interface Job {
  id: string;
  company_id: string;
  company_name: string;
  company_location: string;
  title: string;
  location: string;
  job_type: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  job_title: string;
  company_name: string;
  cover_letter: string;
  status: string;
  applied_at: string;
}