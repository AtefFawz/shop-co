"use client";

import api from "@/lib/api";
import { useEffect, useState } from "react";

const useData = (URL: string) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await api.get(`${URL}?page=${page}&limit=10`, {
          signal: controller.signal,
        });

        setData(response.data);

        setTotalPages(response.data.pagination.totalPages);
      } catch (error: any) {
        if (error.name !== "CanceledError") {
          console.error("ERROR:", error?.response?.data?.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [URL, page, refreshKey]);

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    setPage(newPage);
  };
  const refetch = () => {
    setRefreshKey((prev) => prev + 1);
  };
  return {
    loading,
    data,
    page,
    totalPages,
    goToPage,
    refetch,
  };
};

export default useData;
