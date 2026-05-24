import type { BuildLogLine } from '@/shared/api/mocks/model/types/types';

export type LogLevelFilter = 'all' | BuildLogLine['level'];

export type BuildStatusByDayChartItem = {
  day: string;
  success: number;
  failed: number;
  canceled: number;
};

export type AverageBuildDurationChartItem = {
  day: string;
  averageDurationSec: number;
};
