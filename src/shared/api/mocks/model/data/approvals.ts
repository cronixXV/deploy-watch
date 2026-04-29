import { hoursAgo, minutesAgo } from '../../lib/mock-date';

import type { Approval } from '../types/types';

export const approvals: Approval[] = [
  {
    id: 'approval-1',
    deploymentId: 'deployment-3',
    projectId: 'project-1',
    environment: 'production',
    status: 'pending',
    riskLevel: 'medium',
    requestedById: 'user-2',
    createdAt: minutesAgo(10),
  },
  {
    id: 'approval-2',
    deploymentId: 'deployment-2',
    projectId: 'project-1',
    environment: 'production',
    status: 'approved',
    riskLevel: 'low',
    requestedById: 'user-3',
    createdAt: minutesAgo(18 * 60 + 9),
    resolvedAt: minutesAgo(18 * 60 + 5),
    resolvedById: 'user-1',
  },
  {
    id: 'approval-3',
    deploymentId: 'deployment-4',
    projectId: 'project-1',
    environment: 'testing',
    status: 'rejected',
    riskLevel: 'high',
    requestedById: 'user-2',
    createdAt: hoursAgo(21),
    resolvedAt: minutesAgo(21 * 60 - 4),
    resolvedById: 'user-1',
    rejectReason: 'Unit tests failed for checkout summary flow.',
  },
];
