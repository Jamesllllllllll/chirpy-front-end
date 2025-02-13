export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  token?: string;
  refresh_token?: string;
  is_chirpy_red?: boolean;
  username: string;
}

export interface Chirp {
  id: string;
  body: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  username: string;
}