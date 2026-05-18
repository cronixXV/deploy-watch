import { Grid, Stack } from '@chakra-ui/react';

import { usePipelineDetails } from '../model/use-pipeline-details';

import { PipelineDetailsHeader } from './pipeline-details-header';
import { PipelineJobsCard } from './pipeline-jobs-card';
import { PipelineSummaryCard } from './pipeline-summary-card';
import { RelatedDeploymentCard } from './related-deployment-card';

import { PageErrorState } from '@/shared/ui/page-error-state/ui/page-errors-state';
import { SkeletonLoader } from '@/shared/ui/skeleton/skeleton-loader';

type PipelineDetailsProps = {
  projectId?: string;
  pipelineId?: string;
};

export const PipelineDetails = ({
  projectId,
  pipelineId,
}: PipelineDetailsProps) => {
  const {
    pipelineRun,
    jobs,
    relatedDeployment,
    authorName,
    triggeredByName,
    isLoading,
    isError,
    isFetching,
    error,
    refresh,
  } = usePipelineDetails({
    projectId,
    pipelineId,
  });

  const isLive =
    pipelineRun?.status === 'queued' || pipelineRun?.status === 'running';

  if (!projectId || !pipelineId) {
    return (
      <PageErrorState
        title="Pipeline details"
        message="Pipeline route params are missing."
      />
    );
  }

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (isError) {
    return (
      <PageErrorState
        title="Pipeline details"
        message="Failed to load pipeline details"
        error={error}
        isFetching={isFetching}
        onRetry={refresh}
      />
    );
  }

  return (
    <Stack gap="6">
      <PipelineDetailsHeader
        projectId={projectId}
        pipelineRun={pipelineRun}
        isFetching={isFetching}
        onRefresh={refresh}
        isLive={isLive}
      />

      <Grid
        gap="4"
        templateColumns={{
          base: '1fr',
          xl: '2fr 1fr',
        }}
      >
        <PipelineSummaryCard
          pipelineRun={pipelineRun}
          authorName={authorName}
          triggeredByName={triggeredByName}
        />

        <RelatedDeploymentCard
          projectId={projectId}
          deployment={relatedDeployment}
        />
      </Grid>

      <PipelineJobsCard jobs={jobs} projectId={projectId} />
    </Stack>
  );
};
