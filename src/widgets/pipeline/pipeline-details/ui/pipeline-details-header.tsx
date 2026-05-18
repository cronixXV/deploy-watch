import type { PipelineRun } from '@/shared/api/mocks/model/types/types';

import { getPipelineStatusColor } from '@/entities/project';
import { formatStatus } from '@/shared/lib/format';
import { PageHeader } from '@/shared/ui/page-header/ui/page-header';

type PipelineDetailsHeaderProps = {
  projectId: string;
  pipelineRun?: PipelineRun;
  isFetching: boolean;
  isLive: boolean;
  onRefresh: () => void;
};

export function PipelineDetailsHeader({
  projectId,
  pipelineRun,
  isFetching,
  isLive,
  onRefresh,
}: PipelineDetailsHeaderProps) {
  return (
    <PageHeader
      title={`Pipeline ${pipelineRun?.id ?? ''}`}
      subtitle={
        pipelineRun
          ? `${pipelineRun.branch} · ${pipelineRun.commitHash}`
          : undefined
      }
      status={
        pipelineRun?.status
          ? {
              label: formatStatus(pipelineRun.status),
              colorPalette: getPipelineStatusColor(pipelineRun.status),
            }
          : undefined
      }
      isLive={isLive}
      liveText="Updates every 3 seconds while pipeline is active."
      backLink={{
        to: `/projects/${projectId}/pipelines`,
        label: 'Back to pipelines',
      }}
      isFetching={isFetching}
      onRefresh={onRefresh}
    />
  );
}
