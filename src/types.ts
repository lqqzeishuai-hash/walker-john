export interface User {
  id: number;
  username: string;
  phone: string;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  type: string;
  create_time: string;
}

export interface Repair {
  id: number;
  user_id: number;
  description: string;
  status: 'pending' | 'processing' | 'completed';
  create_time: string;
}

export interface Post {
  id: number;
  user_id: number;
  username: string;
  content: string;
  image_url?: string;
  create_time: string;
}
