import { useQuery } from '@tanstack/react-query';

import { getCurrentUser, getUsers } from './user-api';

export const userQueries = {
  all: ['users'] as const,

  current: () => [...userQueries.all, 'current'] as const,

  lists: () => [...userQueries.all, 'list'] as const,
  list: () => [...userQueries.lists()] as const,
};

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: userQueries.current(),
    queryFn: getCurrentUser,
    retry: false,
  });
}

export function useUsersQuery() {
  return useQuery({
    queryKey: userQueries.list(),
    queryFn: getUsers,
  });
}
