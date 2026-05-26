import { hoursAgo, minutesAgo } from '../../lib/mock-date';

import type { Environment } from '../types/types';

export const environments: Environment[] = [
  {
    id: 'environment-1',
    projectId: 'project-1',
    name: 'development',
    status: 'healthy',
    currentVersion: 'v1.18.0-dev.4',
    currentCommitHash: 'a8f3c91',
    lastDeploymentAt: minutesAgo(25),
    deployedById: 'user-2',
    activeIncidents: 0,
    locked: false,
  },
  {
    id: 'environment-2',
    projectId: 'project-1',
    name: 'testing',
    status: 'degraded',
    currentVersion: 'v1.18.0-rc.1',
    currentCommitHash: 'c2a4f88',
    lastDeploymentAt: hoursAgo(12),
    deployedById: 'user-2',
    activeIncidents: 1,
    locked: false,
  },
  {
    id: 'environment-3',
    projectId: 'project-1',
    name: 'staging',
    status: 'deploying',
    currentVersion: 'v1.18.0-rc.2',
    currentCommitHash: 'a8f3c91',
    lastDeploymentAt: minutesAgo(4),
    deployedById: 'user-3',
    activeIncidents: 0,
    locked: false,
  },
  {
    id: 'environment-4',
    projectId: 'project-1',
    name: 'production',
    status: 'locked',
    currentVersion: 'v1.17.1',
    currentCommitHash: 'b7d9e12',
    lastDeploymentAt: hoursAgo(6),
    deployedById: 'user-1',
    activeIncidents: 0,
    locked: true,
  },
];
