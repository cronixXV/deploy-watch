import {
  Badge,
  Box,
  Button,
  Card,
  HStack,
  Input,
  NativeSelect,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Copy, Search, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { filterLogs } from '../lib/filter-logs';
import {
  copyToClipboard,
  formatLogLine,
  isLogLevelFilter,
} from '../lib/helpers';
import { levelOptions } from '../model/create-options';

import type { BuildLogLine } from '@/shared/api/mocks/model/types/types';

import { useBuildLogsQuery, type LogLevelFilter } from '@/entities/build';
import { getApiErrorMessage } from '@/shared/api/client/client';
import { useDebounce } from '@/shared/lib/debounced';
import { formatLogTimestamp } from '@/shared/lib/format';
import { getStatusColor } from '@/shared/lib/get-color';

type BuildLogsViewerProps = {
  buildId: string;
};

const EMPTY_LOGS: BuildLogLine[] = [];

const SEARCH_DEBOUNCE_MS = 250;
const LOG_ROW_ESTIMATED_HEIGHT = 48;

export const BuildLogsViewer = ({ buildId }: BuildLogsViewerProps) => {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState<LogLevelFilter>('all');
  const [autoScroll, setAutoScroll] = useState(true);

  const parentRef = useRef<HTMLDivElement | null>(null);
  const previousLogsLengthRef = useRef(0);

  const logsQuery = useBuildLogsQuery({ buildId });

  const logs = logsQuery.data ?? EMPTY_LOGS;
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);

  const hasActiveFilters = Boolean(search) || level !== 'all';

  const filteredLogs = useMemo(
    () =>
      filterLogs({
        logs,
        search: debouncedSearch,
        level,
      }),
    [logs, debouncedSearch, level],
  );

  const virtualizer = useVirtualizer({
    count: filteredLogs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => LOG_ROW_ESTIMATED_HEIGHT,
    overscan: 8,
    measureElement:
      typeof window !== 'undefined' && !navigator.userAgent.includes('Firefox')
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
  });

  const scrollToBottom = useCallback(() => {
    if (!filteredLogs.length) {
      return;
    }

    virtualizer.scrollToIndex(filteredLogs.length - 1, {
      align: 'end',
    });
  }, [filteredLogs.length, virtualizer]);

  useEffect(() => {
    const previousLogsLength = previousLogsLengthRef.current;
    const currentLogsLength = logs.length;

    const hasNewLogs = currentLogsLength > previousLogsLength;

    previousLogsLengthRef.current = currentLogsLength;

    if (!autoScroll || !hasNewLogs || !filteredLogs.length) {
      return;
    }

    requestAnimationFrame(scrollToBottom);
  }, [autoScroll, logs.length, filteredLogs.length, scrollToBottom]);

  const handleCopyLogLine = useCallback(async (log: BuildLogLine) => {
    try {
      await copyToClipboard(formatLogLine(log));

      toast.success('Log line copied');
    } catch {
      toast.error('Failed to copy log line');
    }
  }, []);

  const handleCopyAllVisibleLogs = useCallback(async () => {
    if (!filteredLogs.length) {
      toast.error('No logs to copy');
      return;
    }

    try {
      await copyToClipboard(filteredLogs.map(formatLogLine).join('\n'));

      toast.success('Visible logs copied');
    } catch {
      toast.error('Failed to copy logs');
    }
  }, [filteredLogs]);

  const handleLevelChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const nextLevel = event.target.value;

      if (isLogLevelFilter(nextLevel)) {
        setLevel(nextLevel);
      }
    },
    [],
  );

  const handleResetFilters = useCallback(() => {
    setSearch('');
    setLevel('all');
  }, []);

  const handleScroll = useCallback(() => {
    const scrollElement = parentRef.current;

    if (!scrollElement) {
      return;
    }

    const distanceFromBottom =
      scrollElement.scrollHeight -
      scrollElement.scrollTop -
      scrollElement.clientHeight;

    const isNearBottom = distanceFromBottom < 80;

    setAutoScroll(isNearBottom);
  }, []);

  if (logsQuery.isLoading) {
    return (
      <Card.Root bg="white" borderColor="gray.200" shadow="sm">
        <Card.Header>
          <Text fontWeight="semibold">Build logs</Text>
        </Card.Header>

        <Card.Body>
          <Text color="gray.500" fontSize="sm">
            Loading logs...
          </Text>
        </Card.Body>
      </Card.Root>
    );
  }

  if (logsQuery.isError) {
    return (
      <Card.Root bg="red.50" borderColor="red.200">
        <Card.Body>
          <Stack gap="3">
            <Text color="red.700" fontWeight="semibold">
              Failed to load build logs
            </Text>

            <Text color="red.600" fontSize="sm">
              {getApiErrorMessage(logsQuery.error)}
            </Text>

            <Button
              alignSelf="flex-start"
              colorPalette="red"
              loading={logsQuery.isFetching}
              size="sm"
              variant="outline"
              onClick={() => logsQuery.refetch()}
            >
              Retry
            </Button>
          </Stack>
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Card.Root bg="white" borderColor="gray.200" shadow="sm">
      <Card.Header>
        <Stack gap="4">
          <HStack justify="space-between" align="start">
            <Box>
              <Text fontWeight="semibold">Build logs</Text>
              <Text color="gray.500" fontSize="sm">
                Virtualized log output with search, level filters and copy
                actions.
              </Text>
            </Box>

            <HStack gap="2" flexWrap="wrap" justify="flex-end">
              <Button
                aria-pressed={autoScroll}
                colorPalette={autoScroll ? 'teal' : 'gray'}
                size="sm"
                variant={autoScroll ? 'solid' : 'outline'}
                onClick={() => setAutoScroll((value) => !value)}
              >
                Auto-scroll {autoScroll ? 'on' : 'off'}
              </Button>

              <Button
                disabled={!filteredLogs.length}
                size="sm"
                variant="outline"
                onClick={scrollToBottom}
              >
                Jump to bottom
              </Button>

              <Button
                disabled={!filteredLogs.length}
                size="sm"
                variant="outline"
                onClick={handleCopyAllVisibleLogs}
              >
                <Copy size={16} />
                Copy visible
              </Button>
            </HStack>
          </HStack>

          <HStack
            align="end"
            gap="3"
            flexWrap={{
              base: 'wrap',
              md: 'nowrap',
            }}
          >
            <Box flex="1" minW="240px">
              <Text color="gray.500" fontSize="xs" fontWeight="medium" mb="1">
                Search logs
              </Text>

              <HStack
                rounded="md"
                borderWidth="1px"
                borderColor="gray.200"
                px="3"
                bg="white"
              >
                <Search size={16} />

                <Input
                  aria-label="Search logs"
                  border="0"
                  px="0"
                  placeholder="Search message, job or level..."
                  value={search}
                  _focusVisible={{
                    outline: 'none',
                  }}
                  onChange={(event) => setSearch(event.target.value)}
                />

                {search && (
                  <Button
                    aria-label="Clear search"
                    colorPalette="gray"
                    size="xs"
                    variant="ghost"
                    onClick={() => setSearch('')}
                  >
                    <X size={14} />
                  </Button>
                )}
              </HStack>
            </Box>

            <Box w={{ base: '100%', md: '220px' }}>
              <Text color="gray.500" fontSize="xs" fontWeight="medium" mb="1">
                Level
              </Text>

              <NativeSelect.Root>
                <NativeSelect.Field
                  aria-label="Filter logs by level"
                  value={level}
                  onChange={handleLevelChange}
                >
                  {levelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </NativeSelect.Field>

                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Box>

            {hasActiveFilters && (
              <Button size="sm" variant="ghost" onClick={handleResetFilters}>
                Reset filters
              </Button>
            )}
          </HStack>
        </Stack>
      </Card.Header>

      <Card.Body pt="0">
        <HStack justify="space-between" mb="3" gap="3" flexWrap="wrap">
          <Text color="gray.500" fontSize="sm">
            Showing {filteredLogs.length} of {logs.length} log lines
          </Text>

          <HStack gap="2">
            {debouncedSearch !== search && (
              <Badge colorPalette="gray" variant="subtle">
                Searching
              </Badge>
            )}

            {logsQuery.isFetching && (
              <Badge colorPalette="blue" variant="subtle">
                Updating
              </Badge>
            )}
          </HStack>
        </HStack>

        {filteredLogs.length ? (
          <Box
            ref={parentRef}
            role="log"
            aria-live={autoScroll ? 'polite' : 'off'}
            h="520px"
            overflow="auto"
            rounded="lg"
            borderWidth="1px"
            borderColor="gray.200"
            bg="gray.950"
            color="gray.100"
            fontFamily="mono"
            fontSize="sm"
            onScroll={handleScroll}
          >
            <Box
              position="relative"
              h={`${virtualizer.getTotalSize()}px`}
              minW={{ base: '720px', lg: '900px' }}
            >
              {virtualizer.getVirtualItems().map((virtualItem) => {
                const log = filteredLogs[virtualItem.index];

                if (!log) {
                  return null;
                }

                return (
                  <HStack
                    key={log.id}
                    ref={virtualizer.measureElement}
                    data-index={virtualItem.index}
                    position="absolute"
                    top="0"
                    left="0"
                    w="100%"
                    minH={`${LOG_ROW_ESTIMATED_HEIGHT}px`}
                    align="start"
                    gap="3"
                    px="4"
                    py="2"
                    borderBottomWidth="1px"
                    borderColor="whiteAlpha.200"
                    transform={`translateY(${virtualItem.start}px)`}
                  >
                    <Text color="gray.500" minW="90px">
                      [{formatLogTimestamp(log.timestamp)}]
                    </Text>

                    <Badge
                      colorPalette={getStatusColor(log.level)}
                      minW="72px"
                      justifyContent="center"
                      variant="subtle"
                    >
                      {log.level}
                    </Badge>

                    <Text color="teal.300" minW="180px">
                      [{log.jobName}]
                    </Text>

                    <Text
                      flex="1"
                      whiteSpace="pre-wrap"
                      color={
                        log.level === 'error'
                          ? 'red.200'
                          : log.level === 'warning'
                            ? 'yellow.200'
                            : 'gray.100'
                      }
                    >
                      {log.message}
                    </Text>

                    <Button
                      aria-label="Copy log line"
                      colorPalette="gray"
                      size="xs"
                      variant="ghost"
                      onClick={() => handleCopyLogLine(log)}
                    >
                      <Copy size={14} />
                    </Button>
                  </HStack>
                );
              })}
            </Box>
          </Box>
        ) : (
          <Box
            py="12"
            rounded="lg"
            borderWidth="1px"
            borderColor="gray.200"
            textAlign="center"
          >
            <Stack gap="3" align="center">
              <Text color="gray.500" fontSize="sm">
                No logs match current filters.
              </Text>

              {hasActiveFilters && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleResetFilters}
                >
                  Reset filters
                </Button>
              )}
            </Stack>
          </Box>
        )}
      </Card.Body>
    </Card.Root>
  );
};
