import type {
  Build,
  BuildLogLine,
  BuildStatus,
  LogLevel,
} from '@/shared/api/mocks/model/types/types';

import { apiClient } from '@/shared/api/client/client';

export type GetProjectBuildsParams = {
  projectId: string;
  status?: BuildStatus;
  jobName?: string;
  pipelineId?: string;
};

export type GetBuildLogsParams = {
  buildId: string;
  level?: LogLevel;
  search?: string;
};

export async function getProjectBuilds({
  projectId,
  status,
  jobName,
  pipelineId,
}: GetProjectBuildsParams) {
  const response = await apiClient.get<Build[]>(
    `/projects/${projectId}/builds`,
    {
      params: {
        status,
        jobName,
        pipelineId,
      },
    },
  );

  return response.data;
}

export async function getBuildById(buildId: string) {
  const response = await apiClient.get<Build>(`/builds/${buildId}`);

  return response.data;
}

export async function getBuildLogs({
  buildId,
  level,
  search,
}: GetBuildLogsParams) {
  const response = await apiClient.get<BuildLogLine[]>(
    `/builds/${buildId}/logs`,
    {
      params: {
        level,
        search,
      },
    },
  );

  return response.data;
}
