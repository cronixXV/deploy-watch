import { Stack } from '@chakra-ui/react';

import { useBuildDetails } from '../model/use-build-details';

import { BuildDetailsHeader } from './build-details-header';
import { BuildSummaryCard } from './build-summary-card';

import { isLiveBuild } from '@/entities/build/lib/build-details';
import { PageErrorState } from '@/shared/ui/page-error-state/ui/page-errors-state';
import { SkeletonLoader } from '@/shared/ui/skeleton/skeleton-loader';

type BuildDetailsProps = {
  projectId?: string;
  buildId?: string;
};

export const BuildDetails = ({ projectId, buildId }: BuildDetailsProps) => {
  const {
    build,
    pipelineRun,
    authorName,
    isLoading,
    isError,
    isFetching,
    error,
    refresh,
  } = useBuildDetails({
    buildId,
  });

  if (!projectId || !buildId) {
    return (
      <PageErrorState
        title="Build details"
        message="Build route params are missing."
      />
    );
  }

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (isError) {
    return (
      <PageErrorState
        error={error}
        isFetching={isFetching}
        onRetry={refresh}
        message={''}
      />
    );
  }

  const isLive = isLiveBuild(build);

  return (
    <Stack gap="6">
      <BuildDetailsHeader
        build={build}
        isFetching={isFetching}
        isLive={isLive}
        projectId={projectId}
        onRefresh={refresh}
      />

      <BuildSummaryCard
        authorName={authorName}
        build={build}
        pipelineRun={pipelineRun}
        projectId={projectId}
      />
    </Stack>
  );
};
