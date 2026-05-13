import type {
  Build,
  EnvironmentName,
  PipelineRun,
  PipelineRunsMeta,
  PipelineStatus,
} from '@/shared/api/mocks/model/types/types';

import { apiClient } from '@/shared/api/client/client';

export type GetProjectPipelineRunsParams = {
  projectId: string;
  status?: PipelineStatus;
  branch?: string;
  authorId?: string;
  environment?: EnvironmentName;
};

export async function getProjectPipelineRuns({
  projectId,
  status,
  branch,
  authorId,
  environment,
}: GetProjectPipelineRunsParams) {
  const response = await apiClient.get<PipelineRun[]>(
    `/projects/${projectId}/pipeline-runs`,
    {
      params: {
        status,
        branch,
        authorId,
        environment,
      },
    },
  );

  return response.data;
}

export async function getPipelineRunById(pipelineRunId: string) {
  const response = await apiClient.get<PipelineRun>(
    `/pipeline-runs/${pipelineRunId}`,
  );

  return response.data;
}

export async function getPipelineRunBuilds(pipelineRunId: string) {
  const response = await apiClient.get<Build[]>(
    `/pipeline-runs/${pipelineRunId}/builds`,
  );

  return response.data;
}

export async function getProjectPipelineRunsMeta(projectId: string) {
  const response = await apiClient.get<PipelineRunsMeta>(
    `/projects/${projectId}/pipeline-runs/meta`,
  );

  return response.data;
}
