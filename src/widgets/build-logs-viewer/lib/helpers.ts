import { levelOptions } from '../model/create-options';

import type { LogLevelFilter } from '@/entities/build';
import type { BuildLogLine } from '@/shared/api/mocks/model/types/types';

import { formatLogTimestamp } from '@/shared/lib/format';

export function formatLogLine(log: BuildLogLine) {
  return `[${formatLogTimestamp(log.timestamp)}] ${log.level.toUpperCase()} ${log.jobName}: ${log.message}`;
}

export const copyToClipboard = async (text: string) => {
  if (!navigator.clipboard) {
    throw new Error('Clipboard API is not available');
  }

  await navigator.clipboard.writeText(text);
};

export const isLogLevelFilter = (value: string): value is LogLevelFilter => {
  return levelOptions.some((option) => option.value === value);
};
