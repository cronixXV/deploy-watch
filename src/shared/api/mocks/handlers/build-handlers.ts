import { delay, http, HttpResponse } from 'msw';

import { buildLogs } from '../model/data/build-logs';
import { builds } from '../model/data/builds';

import type { BuildStatus, LogLevel } from '../model/types/types';

function getSearchParam(url: URL, key: string) {
  const value = url.searchParams.get(key);

  return value && value.length > 0 ? value : null;
}

export const buildHandlers = [
  http.get('/projects/:projectId/builds', async ({ params, request }) => {
    await delay(600);

    const { projectId } = params;
    const url = new URL(request.url);

    const status = getSearchParam(url, 'status') as BuildStatus | null;
    const jobName = getSearchParam(url, 'jobName');
    const pipelineId = getSearchParam(url, 'pipelineId');

    const result = builds.filter((build) => {
      const matchesProject = build.projectId === projectId;
      const matchesStatus = status ? build.status === status : true;
      const matchesJobName = jobName ? build.jobName === jobName : true;
      const matchesPipeline = pipelineId
        ? build.pipelineId === pipelineId
        : true;

      return (
        matchesProject && matchesStatus && matchesJobName && matchesPipeline
      );
    });

    return HttpResponse.json(result);
  }),

  http.get('/builds/:buildId', async ({ params }) => {
    await delay(400);

    const { buildId } = params;

    const build = builds.find((item) => item.id === buildId);

    if (!build) {
      return HttpResponse.json({ message: 'Build not found' }, { status: 404 });
    }

    return HttpResponse.json(build);
  }),

  http.get('/builds/:buildId/logs', async ({ params, request }) => {
    await delay(700);

    const { buildId } = params;
    const url = new URL(request.url);

    const level = getSearchParam(url, 'level') as LogLevel | null;
    const search = getSearchParam(url, 'search')?.toLowerCase();

    const result = buildLogs.filter((logLine) => {
      const matchesBuild = logLine.buildId === buildId;
      const matchesLevel = level ? logLine.level === level : true;
      const matchesSearch = search
        ? logLine.message.toLowerCase().includes(search)
        : true;

      return matchesBuild && matchesLevel && matchesSearch;
    });

    return HttpResponse.json(result);
  }),
];
