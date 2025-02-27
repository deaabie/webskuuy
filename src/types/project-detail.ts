
export type DetailType = 'resource' | 'community' | 'requirement';

export interface ProjectDetail {
  id: string;
  project_id: string;
  detail_type: DetailType;
  title: string;
  url?: string | null;
  description?: string | null;
  value?: string | null;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface ResourceDetail extends ProjectDetail {
  detail_type: 'resource';
  url: string;
  description?: string | null;
}

export interface CommunityDetail extends ProjectDetail {
  detail_type: 'community';
  url: string;
  description?: string | null;
}

export interface RequirementDetail extends ProjectDetail {
  detail_type: 'requirement';
  value: string;
}
