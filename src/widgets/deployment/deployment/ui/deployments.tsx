import { Card, Stack } from '@chakra-ui/react';

import { DeploymentTimelineDrawer } from '../../deployment-table/ui/deployment-timeline-drawer';
import { DeploymentsTable } from '../../deployment-table/ui/deployments-table';
import { useDeployments } from '../model/use-deployments';

import { DeploymentsHeader } from './deployments-header';

import { usePermissions } from '@/shared/hooks/use-permissions';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog/ui/confirm-dialog';
import { EmptyState } from '@/shared/ui/empty-state/ui/empty-state';
import { PageErrorState } from '@/shared/ui/page-error-state/ui/page-errors-state';
import { SkeletonLoader } from '@/shared/ui/skeleton/skeleton-loader';

type DeploymentsProps = {
  projectId?: string;
};

export const Deployments = ({ projectId }: DeploymentsProps) => {
  const {
    project,
    deployments,
    users,
    selectedTimelineDeployment,
    selectedRollbackDeployment,
    isLoading,
    isError,
    isFetching,
    error,
    isRollbackPending,
    refresh,
    openTimeline,
    handleTimelineOpenChange,
    openRollbackConfirm,
    handleRollbackConfirmOpenChange,
    confirmRollback,
  } = useDeployments({ projectId });

  const permissions = usePermissions();

  if (!projectId) {
    return (
      <PageErrorState
        title="Deployments"
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
        title="Deployments"
        message="Failed to load deployments"
        error={error}
        isFetching={isFetching}
        onRetry={refresh}
      />
    );
  }

  return (
    <>
      <Stack gap="6">
        <DeploymentsHeader
          projectName={project?.name}
          isFetching={isFetching}
          onRefresh={refresh}
        />

        {deployments.length ? (
          <DeploymentsTable
            deployments={deployments}
            users={users}
            canRollback={permissions.can('rollback_deployment')}
            onOpenTimeline={openTimeline}
            onRollback={openRollbackConfirm}
          />
        ) : (
          <Card.Root bg="white" borderColor="gray.200" shadow="sm">
            <Card.Body>
              <EmptyState>
                Once deployments are triggered, they will appear here.
              </EmptyState>
            </Card.Body>
          </Card.Root>
        )}
      </Stack>

      <DeploymentTimelineDrawer
        deployment={selectedTimelineDeployment}
        open={Boolean(selectedTimelineDeployment)}
        onOpenChange={handleTimelineOpenChange}
      />

      <ConfirmDialog
        colorPalette="red"
        confirmText="Rollback"
        description={
          selectedRollbackDeployment
            ? `Are you sure you want to rollback ${selectedRollbackDeployment.environment} to ${selectedRollbackDeployment.version}?`
            : ''
        }
        loading={isRollbackPending}
        open={Boolean(selectedRollbackDeployment)}
        title="Rollback deployment"
        onConfirm={confirmRollback}
        onOpenChange={handleRollbackConfirmOpenChange}
      />
    </>
  );
};
