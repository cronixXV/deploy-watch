import { http, HttpResponse } from 'msw';

import { mockRandomDelay } from '../lib/mock-utils';
import { mockState } from '../model/mock-state';

import type { User } from '../model/types/types';

type LoginRequestBody = {
  email: string;
  password: string;
};

type LoginResponse = {
  user: User;
  token: string;
};

const MOCK_TOKEN = 'mock-token';

export const authHandlers = [
  http.get('/auth/me', async ({ request }) => {
    await mockRandomDelay(300, 700);

    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = mockState.users[0];

    return HttpResponse.json(user);
  }),

  http.post('/auth/login', async ({ request }) => {
    await mockRandomDelay(500, 1000);

    const body = (await request.json()) as LoginRequestBody;

    if (!body.email || !body.password) {
      return HttpResponse.json(
        { message: 'Email and password are required' },
        { status: 400 },
      );
    }

    const user = mockState.users.find((item) => item.email === body.email);

    if (!user) {
      return HttpResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 },
      );
    }

    const response: LoginResponse = {
      user,
      token: MOCK_TOKEN,
    };

    return HttpResponse.json(response);
  }),

  http.post('/auth/logout', async () => {
    await mockRandomDelay(200, 500);

    return HttpResponse.json({
      success: true,
    });
  }),
];
