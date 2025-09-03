export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  name: string;
  password: string;
}

export interface SignupResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface LoginResponse {
  success: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, name: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

export interface FormErrors {
  email?: string;
  name?: string;
  password?: string;
  general?: string;
}