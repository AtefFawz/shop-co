"use client";

import api from "@/lib/api";
import { useEffect, useState, useCallback } from "react";

interface UseDataOptions<T, R> {
  params?: Record<string, any>;
  limit?: number;
  transform?: (data: T) => R;
}

const useData = <T = any, R = T>(
  URL: string,
  options?: UseDataOptions<T, R>,
) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<R | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const { params, limit = 10, transform } = options || {};

  const serializedParams = JSON.stringify(params);

  useEffect(() => {
    setPage(1);
  }, [serializedParams]);

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setLoading(true);

        const response = await api.get(URL, {
          params: {
            ...params,
            page,
            limit,
          },
          signal,
        });

        const responseData = response.data;
        const finalData = transform ? transform(responseData) : responseData;

        setData(finalData);
        setTotalPages(responseData?.pagination?.totalPages || 1);
      } catch (error: any) {
        if (error.name !== "CanceledError" && error.code !== "ERR_CANCELED") {
          console.error(
            "Fetch Error:",
            error?.response?.data?.message || error.message,
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [URL, page, limit, serializedParams, refreshKey],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData]);

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const refetch = () => setRefreshKey((prev) => prev + 1);

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
