import { http, HttpResponse } from 'msw';

import { mockRandomDelay, maybeMockError } from '../lib/mock-utils';
import { mockState } from '../model/mock-state';

export const projectHandlers = [
  http.get('/projects', async () => {
    await mockRandomDelay(400, 900);

    const error = maybeMockError({
      probability: 0.02,
      message: 'Failed to load projects',
      status: 500,
    });

    if (error) {
      return error;
    }

    return HttpResponse.json(mockState.projects);
  }),

  http.get('/projects/:projectId', async ({ params }) => {
    await mockRandomDelay(300, 700);

    const projectId = String(params.projectId);

    const project = mockState.projects.find((item) => item.id === projectId);

    if (!project) {
      return HttpResponse.json(
        { message: 'Project not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json(project);
  }),
];
