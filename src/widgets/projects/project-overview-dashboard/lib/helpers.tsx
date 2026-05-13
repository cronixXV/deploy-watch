import {
  CheckCircle2,
  Clock3,
  GitBranch,
  Rocket,
  ShieldCheck,
  XCircle,
} from 'lucide-react';

import { type RecentActivityItem } from '@/entities/project';

export function getActivityIcon(item: RecentActivityItem) {
  if (item.type === 'pipeline') {
    return <GitBranch size={16} />;
  }

  if (item.type === 'deployment') {
    return <Rocket size={16} />;
  }

  return <ShieldCheck size={16} />;
}

export function getStatusIcon(status: string) {
  if (
    status === 'success' ||
    status === 'deployed' ||
    status === 'approved' ||
    status === 'healthy'
  ) {
    return <CheckCircle2 size={14} />;
  }

  if (status === 'failed' || status === 'rejected' || status === 'down') {
    return <XCircle size={14} />;
  }

  return <Clock3 size={14} />;
}
