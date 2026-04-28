import { delay, http, HttpResponse } from 'msw';

import { environments } from '../model/data/environments';

export const environmentHandlers = [
  http.get('/projects/:projectId/environments', async ({ params }) => {
    await delay(500);

    const { projectId } = params;

    const result = environments.filter(
      (environment) => environment.projectId === projectId,
    );

    return HttpResponse.json(result);
  }),

  http.get('/environments/:environmentId', async ({ params }) => {
    await delay(400);

    const { environmentId } = params;

    const environment = environments.find((item) => item.id === environmentId);

    if (!environment) {
      return HttpResponse.json(
        { message: 'Environment not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json(environment);
  }),
];
