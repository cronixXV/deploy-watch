import { http, HttpResponse } from 'msw';

import { mockRandomDelay } from '../lib/mock-utils';
import { mockState } from '../model/mock-state';

export const userHandlers = [
  http.get('/users', async () => {
    await mockRandomDelay(300, 700);

    return HttpResponse.json(mockState.users);
  }),
];
