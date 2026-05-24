type StatusColor =
  | 'green'
  | 'red'
  | 'blue'
  | 'gray'
  | 'yellow'
  | 'purple'
  | 'orange';

const STATUS_COLOR_MAP = {
  success: 'green',
  healthy: 'green',
  deployed: 'green',
  approved: 'green',
  failed: 'red',
  down: 'red',
  rejected: 'red',
  critical: 'red',
  error: 'red',
  running: 'blue',
  deploying: 'blue',
  info: 'blue',
  queued: 'gray',
  pending: 'gray',
  canceled: 'gray',
  locked: 'gray',
  debug: 'gray',
  waiting_approval: 'yellow',
  warning: 'yellow',
  rolled_back: 'purple',
  degraded: 'orange',
} as const satisfies Record<string, StatusColor>;

type KnownStatus = keyof typeof STATUS_COLOR_MAP;

export function getStatusColor(status?: string): StatusColor {
  return STATUS_COLOR_MAP[status as KnownStatus] ?? 'gray';
}
