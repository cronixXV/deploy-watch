import { Card, Stack } from '@chakra-ui/react';

import { ApprovalsTable } from '../../approvals-table/ui/approvals-table';
import { useApprovals } from '../model/use-approvals';

import { ApprovalsHeader } from './approvals-header';

import { RejectDeploymentDialog } from '@/features/reject-deployment';
import { EmptyState } from '@/shared/ui/empty-state/ui/empty-state';
import { PageErrorState } from '@/shared/ui/page-error-state/ui/page-errors-state';
import { SkeletonLoader } from '@/shared/ui/skeleton/skeleton-loader';

export const Approvals = () => {
  const {
    approvals,
    projects,
    users,
    deployments,
    selectedRejectApproval,
    approvingDeploymentId,
    rejectingDeploymentId,
    isApproving,
    isRejecting,
    isLoading,
    isError,
    isFetching,
    error,
    refresh,
    approve,
    openRejectDialog,
    reject,
    handleRejectDialogOpenChange,
  } = useApprovals();

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (isError) {
    return (
      <PageErrorState
        title="Approvals"
        message="Failed to load approvals"
        error={error}
        isFetching={isFetching}
        onRetry={refresh}
      />
    );
  }

  return (
    <>
      <Stack gap="6">
        <ApprovalsHeader isFetching={isFetching} onRefresh={refresh} />

        {approvals.length ? (
          <ApprovalsTable
            approvals={approvals}
            deployments={deployments}
            projects={projects}
            users={users}
            approvingDeploymentId={approvingDeploymentId}
            isApproving={isApproving}
            rejectingDeploymentId={rejectingDeploymentId}
            isRejecting={isRejecting}
            onApprove={approve}
            onReject={openRejectDialog}
          />
        ) : (
          <Card.Root bg="white" borderColor="gray.200" shadow="sm">
            <Card.Body>
              <EmptyState>
                Deployments waiting for approval will appear here.
              </EmptyState>
            </Card.Body>
          </Card.Root>
        )}
      </Stack>

      <RejectDeploymentDialog
        approval={selectedRejectApproval}
        loading={isRejecting}
        open={Boolean(selectedRejectApproval)}
        onReject={reject}
        onOpenChange={handleRejectDialogOpenChange}
      />
    </>
  );
};
