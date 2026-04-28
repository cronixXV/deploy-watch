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
    createdAt: '2026-04-28T09:00:00.000Z',
  },
  {
    id: 'approval-2',
    deploymentId: 'deployment-2',
    projectId: 'project-1',
    environment: 'production',
    status: 'approved',
    riskLevel: 'low',
    requestedById: 'user-3',
    createdAt: '2026-04-27T15:20:00.000Z',
    resolvedAt: '2026-04-27T15:24:00.000Z',
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
    createdAt: '2026-04-27T12:12:00.000Z',
    resolvedAt: '2026-04-27T12:16:00.000Z',
    resolvedById: 'user-1',
    rejectReason: 'Unit tests failed for checkout summary flow.',
  },
];
