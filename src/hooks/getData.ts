"use client";

import api from "@/lib/api";
import { useEffect, useState, useCallback } from "react";

import { getApiErrorDetails } from "@/lib/errorUtils";
import type { ApiResponse } from "@/types/domain";
interface UseDataOptions<T, R> {
  params?: Record<string, string | number | boolean | null | undefined>;
  limit?: number;
  transform?: (data: T) => R;
}

const useData = <T = ApiResponse, R = T>(
  URL: string,
  options?: UseDataOptions<T, R>,
) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<R | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const { params, limit = 10, transform } = options || {};

  const serializedParams = JSON.stringify(params ?? {});

  useEffect(() => {
    setPage(1);
  }, [serializedParams]);

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setLoading(true);

        const response = await api.get(URL, {
          params: {
            ...JSON.parse(serializedParams),
            page,
            limit,
          },
          signal,
        });
        const responseData = response.data;
        const finalData = transform ? transform(responseData) : responseData;

        setData(finalData);
        setTotalPages(responseData?.pagination?.totalPages || 1);
        setTotal(responseData?.pagination?.total || 1);
      } catch (error: unknown) {
        const details = getApiErrorDetails(error);
        const wasCancelled =
          signal?.aborted ||
          details.name === "CanceledError" ||
          details.code === "ERR_CANCELED";

        // Navigation and rapid filter changes intentionally cancel stale requests.
        // They are not application errors and should not clutter the console.
        if (!wasCancelled) {
          console.error(
            "Fetch Error:",
            details.response?.data?.message || details.message || "Unknown error",
          );
        }
      } finally {
        // An aborted request must not switch off the loading state of its successor.
        if (!signal?.aborted) setLoading(false);
      }
    },
    [URL, page, limit, serializedParams, refreshKey, transform],
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
    total,
  };
};

export default useData;
