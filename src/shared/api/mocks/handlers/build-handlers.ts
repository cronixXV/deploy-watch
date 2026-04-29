import { http, HttpResponse } from 'msw';

import { mockRandomDelay, maybeMockError } from '../lib/mock-utils';
import { updateBuildStatus } from '../lib/status-transitions';
import { mockState } from '../model/mock-state';

import type { BuildStatus, LogLevel } from '../model/types/types';

function getSearchParam(url: URL, key: string) {
  const value = url.searchParams.get(key);

  return value && value.length > 0 ? value : null;
}

export const buildHandlers = [
  http.get('/projects/:projectId/builds', async ({ params, request }) => {
    await mockRandomDelay(400, 900);

    const error = maybeMockError({
      probability: 0.03,
      message: 'Failed to load builds',
      status: 500,
    });

    if (error) {
      return error;
    }

    const projectId = String(params.projectId);
    const url = new URL(request.url);

    const status = getSearchParam(url, 'status') as BuildStatus | null;
    const jobName = getSearchParam(url, 'jobName');
    const pipelineId = getSearchParam(url, 'pipelineId');

    mockState.builds.forEach(updateBuildStatus);

    const result = mockState.builds.filter((build) => {
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
    await mockRandomDelay(300, 700);

    const error = maybeMockError({
      probability: 0.03,
      message: 'Failed to load build',
      status: 500,
    });

    if (error) {
      return error;
    }

    const buildId = String(params.buildId);

    const build = mockState.builds.find((item) => item.id === buildId);

    if (!build) {
      return HttpResponse.json({ message: 'Build not found' }, { status: 404 });
    }

    updateBuildStatus(build);

    return HttpResponse.json(build);
  }),

  http.get('/builds/:buildId/logs', async ({ params, request }) => {
    await mockRandomDelay(500, 1000);

    const error = maybeMockError({
      probability: 0.02,
      message: 'Failed to load build logs',
      status: 500,
    });

    if (error) {
      return error;
    }

    const buildId = String(params.buildId);
    const url = new URL(request.url);

    const level = getSearchParam(url, 'level') as LogLevel | null;
    const search = getSearchParam(url, 'search')?.toLowerCase();

    const build = mockState.builds.find((item) => item.id === buildId);

    if (build) {
      updateBuildStatus(build);
    }

    const result = mockState.buildLogs.filter((logLine) => {
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
