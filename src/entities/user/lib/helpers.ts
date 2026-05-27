import type { User } from '@/shared/api/mocks/model/types/types';

export function getUserNameById(users: User[] | undefined, userId?: string) {
  if (!userId) {
    return 'Unknown user';
  }

  return users?.find((user) => user.id === userId)?.name ?? userId;
}
