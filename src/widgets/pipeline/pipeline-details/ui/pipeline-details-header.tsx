import type { PipelineRun } from '@/shared/api/mocks/model/types/types';

import { formatStatus } from '@/shared/lib/format';
import { getStatusColor } from '@/shared/lib/get-color';
import { PageHeader } from '@/shared/ui/page-header/ui/page-header';

type PipelineDetailsHeaderProps = {
  projectId: string;
  pipelineRun?: PipelineRun;
  isFetching: boolean;
  isLive: boolean;
  onRefresh: () => void;
};

export const PipelineDetailsHeader = ({
  projectId,
  pipelineRun,
  isFetching,
  isLive,
  onRefresh,
}: PipelineDetailsHeaderProps) => {
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
              colorPalette: getStatusColor(pipelineRun.status),
            }
          : undefined
      }
      isLive={isLive}
      liveText="Updates every 3 seconds while pipeline is active."
      backLink={{
        to: `/projects/${projectId}`,
        label: 'Back',
      }}
      isFetching={isFetching}
      onRefresh={onRefresh}
    />
  );
};
