export function formatRole(role?: string) {
  if (!role) {
    return 'Unknown role';
  }

  return role
    .split('_')
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(' ');
}
