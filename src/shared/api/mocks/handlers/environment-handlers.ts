import { http, HttpResponse } from 'msw';

import { mockRandomDelay, maybeMockError } from '../lib/mock-utils';
import { updateDeploymentStatus } from '../lib/status-transitions';
import { mockState } from '../model/mock-state';

export const environmentHandlers = [
  http.get('/projects/:projectId/environments', async ({ params }) => {
    await mockRandomDelay(300, 700);

    const error = maybeMockError({
      probability: 0.02,
      message: 'Failed to load environments',
      status: 500,
    });

    if (error) {
      return error;
    }

    const projectId = String(params.projectId);

    mockState.deployments.forEach((deployment) => {
      updateDeploymentStatus(deployment, mockState.environments);
    });

    const result = mockState.environments.filter(
      (environment) => environment.projectId === projectId,
    );

    return HttpResponse.json(result);
  }),

  http.get('/environments/:environmentId', async ({ params }) => {
    await mockRandomDelay(300, 700);

    const environmentId = String(params.environmentId);

    const environment = mockState.environments.find(
      (item) => item.id === environmentId,
    );

    if (!environment) {
      return HttpResponse.json(
        { message: 'Environment not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json(environment);
  }),
];
