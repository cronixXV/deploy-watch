import { Stack, Text } from '@chakra-ui/react';

import { useBuildDetails } from '../model/use-build-details';

import { BuildDetailsHeader } from './build-details-header';
import { BuildSummaryCard } from './build-summary-card';

import { usePermissions } from '@/shared/hooks/use-permissions';
import { DefaultCard } from '@/shared/ui/default-card/ui/default-card';
import { PageErrorState } from '@/shared/ui/page-error-state/ui/page-errors-state';
import { SkeletonLoader } from '@/shared/ui/skeleton/skeleton-loader';
import { BuildLogsViewer } from '@/widgets/build-logs-viewer';

type BuildDetailsProps = {
  projectId?: string;
  buildId?: string;
};

export const BuildDetails = ({ projectId, buildId }: BuildDetailsProps) => {
  const permissions = usePermissions();

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
    projectId,
    buildId,
  });

  const canViewBuilds = permissions.can('view_builds');
  const canViewLogs = permissions.can('view_logs');

  const isLive = build?.status === 'queued' || build?.status === 'running';

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
        title="Build details"
        message="Failed to load build details"
        error={error}
        isFetching={isFetching}
        onRetry={refresh}
      />
    );
  }

  if (!canViewBuilds) {
    return (
      <DefaultCard
        title="Access denied"
        description="You do not have permission to view build details."
      >
        <Text color="gray.500" fontSize="sm">
          Build details are available for developers and release managers.
        </Text>
      </DefaultCard>
    );
  }

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

      {canViewLogs ? (
        <BuildLogsViewer buildId={buildId} />
      ) : (
        <DefaultCard
          title="Build logs"
          description="You do not have permission to view build logs."
        >
          <Text color="gray.500" fontSize="sm">
            Contact a developer or release manager to get access.
          </Text>
        </DefaultCard>
      )}
    </Stack>
  );
};
