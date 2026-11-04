"use client";

import api from "@/lib/api";
import { useEffect, useState, useCallback, useRef } from "react";

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
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const { params, limit = 10, transform } = options || {};

  const serializedParams = JSON.stringify(params ?? {});
  const previousParams = useRef(serializedParams);
  // The first render after a filter change already requests page 1, rather than
  // briefly requesting the previous page and then cancelling it in an effect.
  const requestPage = previousParams.current === serializedParams ? page : 1;

  useEffect(() => {
    if (previousParams.current !== serializedParams) {
      previousParams.current = serializedParams;
      if (page !== 1) setPage(1);
    }
  }, [serializedParams, page]);

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setLoading(true);

        const response = await api.get(URL.replace(/^\/+/, ""), {
          params: {
            ...JSON.parse(serializedParams),
            page: requestPage,
            limit,
          },
          signal,
        });
        const responseData = response.data;
        const finalData = transform ? transform(responseData) : responseData;

        setData(finalData);
        const nextTotal = Number(responseData?.pagination?.total) || 0;
        const nextTotalPages = Math.max(1, Number(responseData?.pagination?.totalPages) || 1);
        setTotalPages(nextTotalPages);
        setTotal(nextTotal);
      } catch (error: unknown) {
        const details = getApiErrorDetails(error);
        const wasCancelled =
          signal?.aborted ||
          details.name === "CanceledError" ||
          details.code === "ERR_CANCELED";

        // Navigation and rapid filter changes intentionally cancel stale requests.
        // They are not application errors and should not clutter the console.
        if (!wasCancelled) {
          setData(null);
          setTotal(0);
          setTotalPages(1);
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
    [URL, requestPage, limit, serializedParams, refreshKey, transform],
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
