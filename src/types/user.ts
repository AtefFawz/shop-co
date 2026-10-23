export interface User {
  _id: string;
  fullName: string;
  email: string;
  avatar: string;
  createdAt?: string;
  role: "ADMIN" | "MANGER" | "USER";
}
