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