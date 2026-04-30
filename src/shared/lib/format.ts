export function formatDate(value?: string) {
  if (!value) {
    return 'No deployments yet';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function formatStatus(status?: string) {
  if (!status) {
    return 'unknown';
  }

  return status.replaceAll('_', ' ');
}

export function formatDuration(seconds?: number) {
  if (!seconds) {
    return '—';
  }

  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;

  if (minutes === 0) {
    return `${restSeconds}s`;
  }

  return `${minutes}m ${restSeconds}s`;
}

export function getDayKey(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}
