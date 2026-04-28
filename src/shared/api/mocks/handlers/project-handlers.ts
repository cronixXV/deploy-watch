import { delay, http, HttpResponse } from 'msw';

import { projects } from '../model/data/projects';

export const projectHandlers = [
  http.get('/projects', async () => {
    await delay(500);

    return HttpResponse.json(projects);
  }),

  http.get('/projects/:projectId', async ({ params }) => {
    await delay(400);

    const { projectId } = params;

    const project = projects.find((item) => item.id === projectId);

    if (!project) {
      return HttpResponse.json(
        { message: 'Project not found' },
        { status: 404 },
      );
    }

    return HttpResponse.json(project);
  }),
];
