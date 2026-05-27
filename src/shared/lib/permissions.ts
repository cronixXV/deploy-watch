import type { UserRole } from '../api/mocks/model/types/types';

export type Permission =
  | 'view_dashboard'
  | 'view_builds'
  | 'view_logs'
  | 'restart_pipeline'
  | 'approve_deployment'
  | 'reject_deployment'
  | 'rollback_deployment';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  viewer: ['view_dashboard'],

  developer: ['view_dashboard', 'view_builds', 'view_logs', 'restart_pipeline'],

  release_manager: [
    'view_dashboard',
    'view_builds',
    'view_logs',
    'restart_pipeline',
    'approve_deployment',
    'reject_deployment',
    'rollback_deployment',
  ],
};

export function can(role: UserRole | undefined, permission: Permission) {
  if (!role) {
    return false;
  }

  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
