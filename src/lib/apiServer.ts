import { serverApi } from "./serverApi";
// import api from "./api";
export const getDashboardStats = async () => {
  try {
    const data = await serverApi("admin/stats");
    return data.data;
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return null;
  }
};
