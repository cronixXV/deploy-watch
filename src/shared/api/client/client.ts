import axios, { AxiosError } from 'axios';

import { STORAGE_KEYS } from '@/shared/consts/storage';

export type ApiError = {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
};

export const apiClient = axios.create({
  baseURL: '/',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.authToken);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    return Promise.reject(normalizeApiError(error));
  },
);

export function normalizeApiError(error: AxiosError): ApiError {
  if (error.response) {
    const data = error.response.data;

    if (isApiErrorResponse(data)) {
      return {
        message: data.message,
        status: error.response.status,
        code: data.code,
        details: data.details,
      };
    }

    return {
      message: error.message || 'Request failed',
      status: error.response.status,
      details: data,
    };
  }

  if (error.request) {
    return {
      message: 'Network error. Please check your connection.',
      code: 'NETWORK_ERROR',
    };
  }

  return {
    message: error.message || 'Unexpected error',
    code: 'UNKNOWN_ERROR',
  };
}

function isApiErrorResponse(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof value.message === 'string'
  );
}

export function getApiErrorMessage(error: unknown) {
  if (isApiErrorResponse(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unexpected error';
}
