import type { Build } from '@/shared/api/mocks/model/types/types';

import { getBuildStatusColor } from '@/entities/project';
import { formatStatus } from '@/shared/lib/format';
import { PageHeader } from '@/shared/ui/page-header/ui/page-header';

type BuildDetailsHeaderProps = {
  projectId: string;
  build?: Build;
  isFetching: boolean;
  isLive: boolean;
  onRefresh: () => void;
};

export function BuildDetailsHeader({
  projectId,
  build,
  isFetching,
  isLive,
  onRefresh,
}: BuildDetailsHeaderProps) {
  return (
    <PageHeader
      title={`Build ${build?.id ?? ''}`}
      subtitle={build?.jobName}
      status={
        build?.status
          ? {
              label: formatStatus(build.status),
              colorPalette: getBuildStatusColor(build.status),
            }
          : undefined
      }
      isLive={isLive}
      liveText="Updates every 3 seconds while build is active."
      backLink={{
        to: `/projects/${projectId}/pipelines/${build?.pipelineId}`,
        label: 'Back to pipeline',
      }}
      isFetching={isFetching}
      onRefresh={onRefresh}
    />
  );
}
