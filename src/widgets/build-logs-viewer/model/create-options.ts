import type { LogLevelFilter } from '@/entities/build';

export const levelOptions: Array<{
  label: string;
  value: LogLevelFilter;
}> = [
  { label: 'All levels', value: 'all' },
  { label: 'Info', value: 'info' },
  { label: 'Warning', value: 'warning' },
  { label: 'Error', value: 'error' },
  { label: 'Debug', value: 'debug' },
];
