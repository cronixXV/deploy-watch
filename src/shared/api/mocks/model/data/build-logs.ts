import { minutesAgo, secondsAgo } from '../../lib/mock-date';

import type { BuildLogLine } from '../types/types';

export const buildLogs: BuildLogLine[] = [
  {
    id: 'log-1',
    buildId: 'build-1',
    timestamp: minutesAgo(4),
    level: 'info',
    jobName: 'install',
    message: 'Starting dependency installation',
  },
  {
    id: 'log-2',
    buildId: 'build-1',
    timestamp: minutesAgo(2),
    level: 'info',
    jobName: 'install',
    message: 'npm ci completed successfully',
  },
  {
    id: 'log-3',
    buildId: 'build-2',
    timestamp: secondsAgo(95),
    level: 'info',
    jobName: 'lint',
    message: 'Running ESLint checks',
  },
  {
    id: 'log-4',
    buildId: 'build-2',
    timestamp: secondsAgo(20),
    level: 'info',
    jobName: 'lint',
    message: 'No lint errors found',
  },
  {
    id: 'log-5',
    buildId: 'build-3',
    timestamp: secondsAgo(4),
    level: 'info',
    jobName: 'unit-tests',
    message: 'Starting unit test suite',
  },
  {
    id: 'log-6',
    buildId: 'build-3',
    timestamp: secondsAgo(2),
    level: 'warning',
    jobName: 'unit-tests',
    message: 'Test execution is taking longer than expected',
  },
  {
    id: 'log-7',
    buildId: 'build-5',
    timestamp: minutesAgo(21 * 60 - 1),
    level: 'info',
    jobName: 'unit-tests',
    message: 'Starting unit test suite',
  },
  {
    id: 'log-8',
    buildId: 'build-5',
    timestamp: minutesAgo(21 * 60 - 5),
    level: 'error',
    jobName: 'unit-tests',
    message:
      'PaymentSummary.test.tsx failed: expected total amount to be visible',
  },
  {
    id: 'log-9',
    buildId: 'build-5',
    timestamp: minutesAgo(21 * 60 - 6),
    level: 'error',
    jobName: 'unit-tests',
    message: 'Pipeline failed because unit-tests job exited with code 1',
  },
];
