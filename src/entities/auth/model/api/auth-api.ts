import type { User } from '@/shared/api/mocks/model/types/types';

import { apiClient } from '@/shared/api/client/client';

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  token: string;
};

export async function login(request: LoginRequest) {
  const response = await apiClient.post<LoginResponse>('/auth/login', request);

  return response.data;
}

export async function logout() {
  const response = await apiClient.post<{ success: true }>('/auth/logout');

  return response.data;
}
