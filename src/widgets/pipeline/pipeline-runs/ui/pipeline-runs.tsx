import { Card, Stack } from '@chakra-ui/react';

import { PipelineRunsTable } from '../../pipeline-runs-table/ui/pipeline-runs-table';
import { usePipelineRuns } from '../model/use-pipeline-runs';

import { PipelineRunsHeader } from './pipeline-runs-header';

import { PipelineRunsFilters } from '@/features/pipeline-runs-filters';
import { EmptyState } from '@/shared/ui/empty-state/ui/empty-state';
import { PageErrorState } from '@/shared/ui/page-error-state/ui/page-errors-state';
import { SkeletonLoader } from '@/shared/ui/skeleton/skeleton-loader';

type PipelineRunsProps = {
  projectId?: string;
};

export const PipelineRuns = ({ projectId }: PipelineRunsProps) => {
  const {
    project,
    pipelineRuns,
    users,
    pipelineAuthors,
    branches,
    filters,
    isLoading,
    isError,
    isFetching,
    error,
    refresh,
    handleFilterChange,
    resetFilters,
  } = usePipelineRuns({ projectId });

  if (!projectId) {
    return (
      <PageErrorState
        title="Pipeline runs"
        message="Project route param is missing."
      />
    );
  }

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (isError) {
    return (
      <PageErrorState
        title="Pipeline runs"
        message="Failed to load pipeline runs"
        error={error}
        isFetching={isFetching}
        onRetry={refresh}
      />
    );
  }

  return (
    <Stack gap="6">
      <PipelineRunsHeader
        projectName={project?.name}
        repository={project?.repository}
        isFetching={isFetching}
        onRefresh={refresh}
      />

      <PipelineRunsFilters
        branches={branches}
        filters={filters}
        users={pipelineAuthors}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
      />

      {pipelineRuns.length ? (
        <PipelineRunsTable
          pipelineRuns={pipelineRuns}
          projectId={projectId}
          users={users}
        />
      ) : (
        <Card.Root bg="white" borderColor="gray.200" shadow="sm">
          <Card.Body>
            <EmptyState>
              Try changing filters or refreshing the page.
            </EmptyState>
          </Card.Body>
        </Card.Root>
      )}
    </Stack>
  );
};
