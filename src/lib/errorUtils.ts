/** Narrow unknown exceptions once at the application boundary. */
export interface ApiErrorDetails {
  message?: string;
  code?: string;
  name?: string;
  digest?: string;
  response?: {
    status?: number;
    data?: { message?: string; errorText?: string; data?: string };
  };
}

export function getApiErrorDetails(error: unknown): ApiErrorDetails {
  if (typeof error !== "object" || error === null) {
    return { message: typeof error === "string" ? error : undefined };
  }

  const candidate = error as {
    message?: unknown;
    code?: unknown;
    name?: unknown;
    digest?: unknown;
    response?: {
      status?: unknown;
      data?: { message?: unknown; errorText?: unknown; data?: unknown };
    };
  };

  return {
    message: typeof candidate.message === "string" ? candidate.message : undefined,
    code: typeof candidate.code === "string" ? candidate.code : undefined,
    name: typeof candidate.name === "string" ? candidate.name : undefined,
    digest: typeof candidate.digest === "string" ? candidate.digest : undefined,
    response: {
      status: typeof candidate.response?.status === "number" ? candidate.response.status : undefined,
      data: {
        message: typeof candidate.response?.data?.message === "string"
          ? candidate.response.data.message
          : undefined,
        errorText: typeof candidate.response?.data?.errorText === "string"
          ? candidate.response.data.errorText
          : undefined,
        data: typeof candidate.response?.data?.data === "string"
          ? candidate.response.data.data
          : undefined,
      },
    },
  };
}
