import type { LogLevelFilter } from '@/entities/build';
import type { BuildLogLine } from '@/shared/api/mocks/model/types/types';

export function filterLogs(params: {
  logs: BuildLogLine[];
  search: string;
  level: LogLevelFilter;
}) {
  const { logs, search, level } = params;

  const normalizedSearch = search.trim().toLowerCase();

  return logs.filter((log) => {
    const matchesLevel = level === 'all' || log.level === level;

    if (!matchesLevel) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    return [log.message, log.jobName, log.level, log.timestamp]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch);
  });
}
