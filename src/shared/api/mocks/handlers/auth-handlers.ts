import { delay, http, HttpResponse } from 'msw';

import { users } from '../model/data/users';

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
    await delay(400);

    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = users[0];

    return HttpResponse.json(user);
  }),

  http.post('/auth/login', async ({ request }) => {
    await delay(600);

    const body = (await request.json()) as LoginRequestBody;

    if (!body.email || !body.password) {
      return HttpResponse.json(
        { message: 'Email and password are required' },
        { status: 400 },
      );
    }

    const user = users.find((item) => item.email === body.email);

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
    await delay(300);

    return HttpResponse.json({
      success: true,
    });
  }),
];
