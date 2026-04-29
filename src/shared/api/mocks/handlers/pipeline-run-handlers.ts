import { http, HttpResponse } from 'msw';

import { mockRandomDelay, maybeMockError } from '../lib/mock-utils';
import { updatePipelineRunStatus } from '../lib/status-transitions';
import { mockState } from '../model/mock-state';

import type { EnvironmentName, PipelineStatus } from '../model/types/types';

function getSearchParam(url: URL, key: string) {
  const value = url.searchParams.get(key);

  return value && value.length > 0 ? value : null;
}

export const pipelineRunHandlers = [
  http.get(
    '/projects/:projectId/pipeline-runs',
    async ({ params, request }) => {
      await mockRandomDelay(400, 900);

      const error = maybeMockError({
        probability: 0.03,
        message: 'Failed to load pipeline runs',
        status: 500,
      });

      if (error) {
        return error;
      }

      const projectId = String(params.projectId);
      const url = new URL(request.url);

      const status = getSearchParam(url, 'status') as PipelineStatus | null;
      const branch = getSearchParam(url, 'branch');
      const authorId = getSearchParam(url, 'authorId');
      const environment = getSearchParam(
        url,
        'environment',
      ) as EnvironmentName | null;

      mockState.pipelineRuns.forEach(updatePipelineRunStatus);

      const result = mockState.pipelineRuns.filter((pipelineRun) => {
        const matchesProject = pipelineRun.projectId === projectId;
        const matchesStatus = status ? pipelineRun.status === status : true;
        const matchesBranch = branch ? pipelineRun.branch === branch : true;
        const matchesAuthor = authorId
          ? pipelineRun.authorId === authorId
          : true;
        const matchesEnvironment = environment
          ? pipelineRun.environment === environment
          : true;

        return (
          matchesProject &&
          matchesStatus &&
          matchesBranch &&
          matchesAuthor &&
          matchesEnvironment
        );
      });

      return HttpResponse.json(result);
    },
  ),

  http.get('/pipeline-runs/:pipelineRunId', async ({ params }) => {
    await mockRandomDelay(300, 700);

    const error = maybeMockError({
      probability: 0.03,
      message: 'Failed to load pipeline run',
      status: 500,
    });

    if (error) {
      return error;
    }

    const pipelineRunId = String(params.pipelineRunId);

    const pipelineRun = mockState.pipelineRuns.find(
      (item) => item.id === pipelineRunId,
    );

    if (!pipelineRun) {
      return HttpResponse.json(
        { message: 'Pipeline run not found' },
        { status: 404 },
      );
    }

    updatePipelineRunStatus(pipelineRun);

    return HttpResponse.json(pipelineRun);
  }),

  http.get('/pipeline-runs/:pipelineRunId/builds', async ({ params }) => {
    await mockRandomDelay(300, 700);

    const pipelineRunId = String(params.pipelineRunId);

    const result = mockState.builds.filter(
      (build) => build.pipelineId === pipelineRunId,
    );

    return HttpResponse.json(result);
  }),
];
