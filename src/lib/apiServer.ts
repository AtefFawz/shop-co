import api from "./api";
export const getDashboardStats = async () => {
  try {
    const data = await api.get("admin/stats");
    return data.data?.data;
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return null;
  }
};
