import { PipelineJobsTable } from '../../pipeline-jobs-table/ui/pipeline-jobs-table';

import type { Build } from '@/shared/api/mocks/model/types/types';

import { DefaultCard } from '@/shared/ui/default-card/ui/default-card';
import { EmptyState } from '@/shared/ui/empty-state/ui/empty-state';

type PipelineJobsCardProps = {
  projectId: string;
  jobs: Build[];
};

export const PipelineJobsCard = ({
  jobs,
  projectId,
}: PipelineJobsCardProps) => (
  <DefaultCard
    title="Jobs"
    description="Pipeline jobs and their execution status."
  >
    {jobs.length ? (
      <PipelineJobsTable jobs={jobs} projectId={projectId} />
    ) : (
      <EmptyState>No jobs found for this pipeline.</EmptyState>
    )}
  </DefaultCard>
);
