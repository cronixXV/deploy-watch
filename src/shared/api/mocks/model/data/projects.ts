import { daysAgo, hoursAgo } from '../../lib/mock-date';

import type { Project } from '../types/types';

export const projects: Project[] = [
  {
    id: 'project-1',
    name: 'Checkout Service',
    repository: 'deploywatch/checkout-service',
    defaultBranch: 'main',
    description: 'Payment checkout frontend and API integration service.',
    createdAt: daysAgo(28),
    updatedAt: hoursAgo(14),
  },
  {
    id: 'project-2',
    name: 'Identity Platform',
    repository: 'deploywatch/identity-platform',
    defaultBranch: 'main',
    description: 'Authentication, authorization and user session platform.',
    createdAt: daysAgo(48),
    updatedAt: daysAgo(1),
  },
  {
    id: 'project-3',
    name: 'Analytics Dashboard',
    repository: 'deploywatch/analytics-dashboard',
    defaultBranch: 'develop',
    description: 'Internal analytics dashboard for product metrics.',
    createdAt: daysAgo(68),
    updatedAt: daysAgo(2),
  },
];
