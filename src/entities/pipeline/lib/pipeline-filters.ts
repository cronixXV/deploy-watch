import type {
  EnvironmentName,
  PipelineRun,
  PipelineStatus,
} from '@/shared/api/mocks/model/types/types';

export type PipelineFilters = {
  branch?: string;
  authorId?: string;
  status?: PipelineStatus;
  environment?: EnvironmentName;
  startedFrom?: string;
  startedTo?: string;
};

const pipelineStatuses: PipelineStatus[] = [
  'queued',
  'running',
  'success',
  'failed',
  'canceled',
];

const environments: EnvironmentName[] = [
  'development',
  'testing',
  'staging',
  'production',
];

function isPipelineStatus(value: string | null): value is PipelineStatus {
  return Boolean(value && pipelineStatuses.includes(value as PipelineStatus));
}

function isEnvironmentName(value: string | null): value is EnvironmentName {
  return Boolean(value && environments.includes(value as EnvironmentName));
}

export function getPipelineFiltersFromSearchParams(
  searchParams: URLSearchParams,
): PipelineFilters {
  const branch = searchParams.get('branch');
  const authorId = searchParams.get('authorId');
  const status = searchParams.get('status');
  const environment = searchParams.get('environment');
  const startedFrom = searchParams.get('startedFrom');
  const startedTo = searchParams.get('startedTo');

  return {
    branch: branch || undefined,
    authorId: authorId || undefined,
    status: isPipelineStatus(status) ? status : undefined,
    environment: isEnvironmentName(environment) ? environment : undefined,
    startedFrom: startedFrom || undefined,
    startedTo: startedTo || undefined,
  };
}

export function setSearchParamValue(
  searchParams: URLSearchParams,
  key: keyof PipelineFilters,
  value: string,
) {
  const nextSearchParams = new URLSearchParams(searchParams);

  if (value) {
    nextSearchParams.set(key, value);
  } else {
    nextSearchParams.delete(key);
  }

  return nextSearchParams;
}

export function resetPipelineFilters() {
  return new URLSearchParams();
}

export function filterPipelineRunsByDateRange(
  pipelineRuns: PipelineRun[],
  filters: PipelineFilters,
) {
  if (!filters.startedFrom && !filters.startedTo) {
    return pipelineRuns;
  }

  return pipelineRuns.filter((pipelineRun) => {
    const startedAt = new Date(pipelineRun.startedAt).getTime();

    if (filters.startedFrom) {
      const from = new Date(filters.startedFrom).getTime();

      if (startedAt < from) {
        return false;
      }
    }

    if (filters.startedTo) {
      const to = new Date(filters.startedTo).getTime();

      const endOfDay = to + 24 * 60 * 60 * 1000 - 1;

      if (startedAt > endOfDay) {
        return false;
      }
    }

    return true;
  });
}
