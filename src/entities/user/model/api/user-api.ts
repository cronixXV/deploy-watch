import type { User } from '@/shared/api/mocks/model/types/types';

import { apiClient } from '@/shared/api/client/client';

export async function getCurrentUser() {
  const response = await apiClient.get<User>('/auth/me');

  return response.data;
}

export async function getUsers() {
  const response = await apiClient.get<User[]>('/users');

  return response.data;
}
