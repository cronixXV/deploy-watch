import type {
  AverageBuildDurationChartItem,
  BuildStatusByDayChartItem,
} from '../model/types/types';
import type { Build } from '@/shared/api/mocks/model/types/types';

import { getDayKey } from '@/shared/lib/format';

export function getBuildStatusByDayChartData(
  builds?: Build[],
): BuildStatusByDayChartItem[] {
  if (!builds?.length) {
    return [];
  }

  const result = new Map<string, BuildStatusByDayChartItem>();

  builds.forEach((build) => {
    const day = getDayKey(build.startedAt);

    const current = result.get(day) ?? {
      day,
      success: 0,
      failed: 0,
      canceled: 0,
    };

    if (build.status === 'success') {
      current.success += 1;
    }

    if (build.status === 'failed') {
      current.failed += 1;
    }

    if (build.status === 'canceled') {
      current.canceled += 1;
    }

    result.set(day, current);
  });

  return Array.from(result.values());
}

export function getAverageBuildDurationByDayChartData(
  builds?: Build[],
): AverageBuildDurationChartItem[] {
  if (!builds?.length) {
    return [];
  }

  const grouped = new Map<
    string,
    {
      totalDurationSec: number;
      count: number;
    }
  >();

  builds.forEach((build) => {
    if (typeof build.durationSec !== 'number') {
      return;
    }

    const day = getDayKey(build.startedAt);

    const current = grouped.get(day) ?? {
      totalDurationSec: 0,
      count: 0,
    };

    current.totalDurationSec += build.durationSec;
    current.count += 1;

    grouped.set(day, current);
  });

  return Array.from(grouped.entries()).map(([day, value]) => ({
    day,
    averageDurationSec: Math.round(value.totalDurationSec / value.count),
  }));
}
