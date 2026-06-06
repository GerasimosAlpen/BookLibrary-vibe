export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "MEMBER" | "LIBRARIAN" | "ADMIN";
}

export interface ApiError {
  success: false;
  message: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}