import {
  Box,
  Button,
  Card,
  Grid,
  Heading,
  HStack,
  Skeleton,
  Stack,
  Text,
} from '@chakra-ui/react';
import { RefreshCw } from 'lucide-react';
import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import {
  getPipelineFiltersFromSearchParams,
  filterPipelineRunsByDateRange,
  resetPipelineFilters,
  setSearchParamValue,
  type PipelineFilters,
  useProjectPipelineRunsMetaQuery,
  useProjectPipelineRunsQuery,
} from '@/entities/pipeline';
import { useProjectQuery } from '@/entities/project';
import { useUsersQuery } from '@/entities/user';
import { PipelineRunsFilters } from '@/features/pipeline-runs-filters';
import { getApiErrorMessage } from '@/shared/api/client/client';
import { PipelineRunsTable } from '@/widgets/pipeline';

export const PipelinesPage = () => {
  const { projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => getPipelineFiltersFromSearchParams(searchParams),
    [searchParams],
  );

  const safeProjectId = projectId ?? '';

  const projectQuery = useProjectQuery(safeProjectId);

  const pipelineRunsQuery = useProjectPipelineRunsQuery({
    projectId: safeProjectId,
    status: filters.status,
    branch: filters.branch,
    authorId: filters.authorId,
    environment: filters.environment,
  });

  const pipelineRunsMetaQuery = useProjectPipelineRunsMetaQuery(safeProjectId);

  const usersQuery = useUsersQuery();

  const isLoading =
    projectQuery.isLoading ||
    pipelineRunsQuery.isLoading ||
    usersQuery.isLoading ||
    pipelineRunsMetaQuery.isLoading;

  const isError =
    projectQuery.isError ||
    pipelineRunsQuery.isError ||
    usersQuery.isError ||
    pipelineRunsMetaQuery.isError;

  const error =
    projectQuery.error ??
    pipelineRunsQuery.error ??
    usersQuery.error ??
    pipelineRunsMetaQuery.error;

  const isFetching =
    projectQuery.isFetching ||
    pipelineRunsQuery.isFetching ||
    usersQuery.isFetching ||
    pipelineRunsMetaQuery.isFetching;

  const handleRefresh = () => {
    projectQuery.refetch();
    pipelineRunsQuery.refetch();
    usersQuery.refetch();
    pipelineRunsMetaQuery.refetch();
  };

  const handleFilterChange = (name: keyof PipelineFilters, value: string) => {
    setSearchParams(setSearchParamValue(searchParams, name, value));
  };

  const handleResetFilters = () => {
    setSearchParams(resetPipelineFilters());
  };

  const branches = pipelineRunsMetaQuery.data?.branches ?? [];

  const filteredPipelineRuns = useMemo(
    () => filterPipelineRunsByDateRange(pipelineRunsQuery.data ?? [], filters),
    [pipelineRunsQuery.data, filters],
  );

  const pipelineAuthorIds = pipelineRunsMetaQuery.data?.authorIds ?? [];

  const pipelineAuthors = (usersQuery.data ?? []).filter((user) =>
    pipelineAuthorIds.includes(user.id),
  );

  if (!safeProjectId) {
    return (
      <Card.Root bg="red.50" borderColor="red.200">
        <Card.Body>
          <Text color="red.700" fontWeight="semibold">
            Project id is missing.
          </Text>
        </Card.Body>
      </Card.Root>
    );
  }

  if (isLoading) {
    return (
      <Stack gap="6">
        <Stack gap="2">
          <Skeleton h="32px" w="260px" />
          <Skeleton h="18px" w="420px" />
        </Stack>

        <Grid gap="3">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton h="52px" key={index} rounded="lg" />
          ))}
        </Grid>
      </Stack>
    );
  }

  if (isError) {
    return (
      <Stack gap="4">
        <Heading size="lg">Pipeline runs</Heading>

        <Card.Root bg="red.50" borderColor="red.200">
          <Card.Body>
            <Stack gap="3">
              <Text color="red.700" fontWeight="semibold">
                Failed to load pipeline runs
              </Text>

              <Text color="red.600" fontSize="sm">
                {getApiErrorMessage(error)}
              </Text>

              <Button
                alignSelf="flex-start"
                colorPalette="red"
                loading={isFetching}
                size="sm"
                variant="outline"
                onClick={handleRefresh}
              >
                Retry
              </Button>
            </Stack>
          </Card.Body>
        </Card.Root>
      </Stack>
    );
  }

  return (
    <Stack gap="6">
      <HStack align="start" justify="space-between">
        <Box>
          <Heading size="lg">Pipeline runs</Heading>

          <Text color="gray.500" mt="2">
            {projectQuery.data?.name} · {projectQuery.data?.repository}
          </Text>
        </Box>

        <Button
          colorPalette="teal"
          loading={isFetching}
          size="sm"
          variant="outline"
          onClick={handleRefresh}
        >
          <RefreshCw size={16} />
          Refresh
        </Button>
      </HStack>

      <PipelineRunsFilters
        branches={branches}
        filters={filters}
        users={pipelineAuthors}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {filteredPipelineRuns.length ? (
        <PipelineRunsTable
          pipelineRuns={filteredPipelineRuns}
          projectId={safeProjectId}
          users={usersQuery.data ?? []}
        />
      ) : (
        <Card.Root bg="white" borderColor="gray.200" shadow="sm">
          <Card.Body>
            <Box py="10" textAlign="center">
              <Heading size="sm">No pipeline runs found</Heading>

              <Text color="gray.500" fontSize="sm" mt="2">
                Try changing filters or refreshing the page.
              </Text>
            </Box>
          </Card.Body>
        </Card.Root>
      )}
    </Stack>
  );
};
