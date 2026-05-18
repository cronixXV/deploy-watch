import type { Build } from '@/shared/api/mocks/model/types/types';

export function isLiveBuild(build?: Build) {
  return build?.status === 'queued' || build?.status === 'running';
}
