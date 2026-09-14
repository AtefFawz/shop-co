import { serverApi } from "./serverApi";
// import api from "./api";
export const getDashboardStats = async () => {
  try {
    const data = await serverApi("admin/dashboard");
    return data.data;
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return null;
  }
};
