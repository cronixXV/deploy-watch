import { useMutation, useQueryClient } from '@tanstack/react-query';

import { login, logout, type LoginRequest } from './auth-api';

import { userQueries } from '@/entities/user';
import { STORAGE_KEYS } from '@/shared/consts/storage';

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: LoginRequest) => login(request),

    onSuccess: async (data) => {
      localStorage.setItem(STORAGE_KEYS.authToken, data.token);

      queryClient.setQueryData(userQueries.current(), data.user);

      await queryClient.invalidateQueries({
        queryKey: userQueries.all,
      });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,

    onSuccess: () => {
      localStorage.removeItem(STORAGE_KEYS.authToken);
      queryClient.clear();
    },
  });
}
