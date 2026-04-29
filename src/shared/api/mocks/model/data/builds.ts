import { hoursAgo, minutesAgo, secondsAgo } from '../../lib/mock-date';

import type { Build } from '../types/types';

export const builds: Build[] = [
  {
    id: 'build-1',
    projectId: 'project-1',
    pipelineId: 'pipeline-1',
    status: 'success',
    jobName: 'install',
    startedAt: secondsAgo(12),
    finishedAt: secondsAgo(10),
    durationSec: 120,
  },
  {
    id: 'build-2',
    projectId: 'project-1',
    pipelineId: 'pipeline-1',
    status: 'success',
    jobName: 'lint',
    startedAt: secondsAgo(9),
    finishedAt: secondsAgo(7),
    durationSec: 75,
  },
  {
    id: 'build-3',
    projectId: 'project-1',
    pipelineId: 'pipeline-1',
    status: 'running',
    jobName: 'unit-tests',
    startedAt: secondsAgo(4),
  },
  {
    id: 'build-4',
    projectId: 'project-1',
    pipelineId: 'pipeline-2',
    status: 'success',
    jobName: 'production-deploy',
    startedAt: minutesAgo(18 * 60 - 5),
    finishedAt: minutesAgo(18 * 60 - 9),
    durationSec: 240,
  },
  {
    id: 'build-5',
    projectId: 'project-1',
    pipelineId: 'pipeline-3',
    status: 'failed',
    jobName: 'unit-tests',
    startedAt: hoursAgo(21),
    finishedAt: minutesAgo(21 * 60 - 6),
    durationSec: 360,
  },
  {
    id: 'build-6',
    projectId: 'project-2',
    pipelineId: 'pipeline-4',
    status: 'queued',
    jobName: 'security-scan',
    startedAt: secondsAgo(1),
  },
];
