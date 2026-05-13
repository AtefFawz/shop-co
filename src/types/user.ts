export interface User {
  _id: string;
  fullName: string;
  email: string;
  avatar: string;
  role: "ADMIN" | "MANGER" | "USER";
}
