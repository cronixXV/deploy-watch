import { useAppSelector } from '@/app/store/hooks';
import { can, type Permission } from '@/shared/lib/permissions';

export function usePermissions() {
  const role = useAppSelector((state) => state.auth.user?.role);

  return {
    role,
    can: (permission: Permission) => can(role, permission),
  };
}
