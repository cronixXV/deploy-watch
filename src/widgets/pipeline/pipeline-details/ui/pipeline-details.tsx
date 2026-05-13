import { Grid, Stack } from '@chakra-ui/react';

import { usePipelineDetails } from '../model/use-pipeline-details';

import { PipelineDetailsError } from './pipeline-details-error';
import { PipelineDetailsHeader } from './pipeline-details-header';
import { PipelineDetailsSkeleton } from './pipeline-details-skeleton';
import { PipelineJobsCard } from './pipeline-jobs-card';
import { PipelineSummaryCard } from './pipeline-summary-card';
import { RelatedDeploymentCard } from './related-deployment-card';

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

  if (!projectId || !pipelineId) {
    return (
      <PipelineDetailsError message="Pipeline route params are missing." />
    );
  }

  if (isLoading) {
    return <PipelineDetailsSkeleton />;
  }

  if (isError) {
    return (
      <PipelineDetailsError
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
