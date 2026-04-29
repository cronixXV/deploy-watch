import { useQuery } from '@tanstack/react-query';

import { getCurrentUser } from './user-api';

export const userQueries = {
  all: ['user'] as const,
  current: () => [...userQueries.all, 'current'] as const,
};

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: userQueries.current(),
    queryFn: getCurrentUser,
    retry: false,
  });
}
