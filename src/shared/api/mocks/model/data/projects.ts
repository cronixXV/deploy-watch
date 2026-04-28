import type { Project } from '../types/types';

export const projects: Project[] = [
  {
    id: 'project-1',
    name: 'Checkout Service',
    repository: 'deploywatch/checkout-service',
    defaultBranch: 'main',
    description: 'Payment checkout frontend and API integration service.',
    createdAt: '2026-04-01T09:00:00.000Z',
    updatedAt: '2026-04-27T18:20:00.000Z',
  },
  {
    id: 'project-2',
    name: 'Identity Platform',
    repository: 'deploywatch/identity-platform',
    defaultBranch: 'main',
    description: 'Authentication, authorization and user session platform.',
    createdAt: '2026-03-12T10:30:00.000Z',
    updatedAt: '2026-04-26T14:45:00.000Z',
  },
  {
    id: 'project-3',
    name: 'Analytics Dashboard',
    repository: 'deploywatch/analytics-dashboard',
    defaultBranch: 'develop',
    description: 'Internal analytics dashboard for product metrics.',
    createdAt: '2026-02-20T12:00:00.000Z',
    updatedAt: '2026-04-25T11:10:00.000Z',
  },
];
