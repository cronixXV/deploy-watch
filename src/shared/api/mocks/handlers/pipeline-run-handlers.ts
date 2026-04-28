import { delay, http, HttpResponse } from 'msw';

import { builds } from '../model/data/builds';
import { pipelineRuns } from '../model/data/pipeline-runs';

import type { EnvironmentName, PipelineStatus } from '../model/types/types';

function getSearchParam(url: URL, key: string) {
  const value = url.searchParams.get(key);

  return value && value.length > 0 ? value : null;
}

export const pipelineRunHandlers = [
  http.get(
    '/projects/:projectId/pipeline-runs',
    async ({ params, request }) => {
      await delay(600);

      const { projectId } = params;
      const url = new URL(request.url);

      const status = getSearchParam(url, 'status') as PipelineStatus | null;
      const branch = getSearchParam(url, 'branch');
      const authorId = getSearchParam(url, 'authorId');
      const environment = getSearchParam(
        url,
        'environment',
      ) as EnvironmentName | null;

      const result = pipelineRuns.filter((pipelineRun) => {
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
    await delay(500);

    const { pipelineRunId } = params;

    const pipelineRun = pipelineRuns.find((item) => item.id === pipelineRunId);

    if (!pipelineRun) {
      return HttpResponse.json(
        { message: 'Pipeline run not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json(pipelineRun);
  }),

  http.get('/pipeline-runs/:pipelineRunId/builds', async ({ params }) => {
    await delay(500);

    const { pipelineRunId } = params;

    const result = builds.filter((build) => build.pipelineId === pipelineRunId);

    return HttpResponse.json(result);
  }),
];
