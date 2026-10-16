// Most endpoints return this envelope. Some (login, notifications) don't,
// so each feature's service file handles its own shape.
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface User {
  id: string;
  full_name: string;
  username: string;
  email: string;
  is_verified: boolean;
  account_status: string;
  created_at: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}