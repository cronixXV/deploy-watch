import { delay, HttpResponse } from 'msw';

type MockErrorOptions = {
  probability?: number;
  message?: string;
  status?: number;
};

export async function mockDelay(ms = 500) {
  await delay(ms);
}

export async function mockRandomDelay(min = 300, max = 900) {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;

  await delay(ms);
}

export function maybeMockError(options: MockErrorOptions = {}) {
  const {
    probability = 0,
    message = 'Something went wrong',
    status = 500,
  } = options;

  const shouldFail = Math.random() < probability;

  if (!shouldFail) {
    return null;
  }

  return HttpResponse.json(
    {
      message,
    },
    {
      status,
    },
  );
}
