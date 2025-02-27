
export interface Project {
  id: string;
  name: string;
  categories: string[];
  description: string;
  logo: string;
  status: "active" | "upcoming" | "ended";
  installation_guide: string;
  created_at?: string;
  updated_at?: string;
}
