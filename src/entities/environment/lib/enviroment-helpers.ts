import type { Environment } from '@/shared/api/mocks/model/types/types';

export function getEnvironmentHealthLabel(environment: Environment) {
  if (environment.locked) {
    return 'Locked';
  }

  switch (environment.status) {
    case 'healthy':
      return 'Healthy';
    case 'degraded':
      return 'Degraded';
    case 'down':
      return 'Down';
    case 'deploying':
      return 'Deploying';
    case 'locked':
      return 'Locked';
    default:
      return 'Unknown';
  }
}

export function getEnvironmentHealthDescription(environment: Environment) {
  if (environment.locked) {
    return 'Deployments are temporarily blocked for this environment.';
  }

  if (environment.activeIncidents > 0) {
    return `${environment.activeIncidents} active incident${
      environment.activeIncidents > 1 ? 's' : ''
    } require attention.`;
  }

  switch (environment.status) {
    case 'healthy':
      return 'Environment is operating normally.';
    case 'degraded':
      return 'Environment is available but has degraded performance.';
    case 'down':
      return 'Environment is currently unavailable.';
    case 'deploying':
      return 'Deployment is currently in progress.';
    case 'locked':
      return 'Deployments are blocked for this environment.';
    default:
      return 'Environment health is unknown.';
  }
}
