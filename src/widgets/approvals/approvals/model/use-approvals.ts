import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import type { Approval } from '@/shared/api/mocks/model/types/types';

import { useApprovalsQuery } from '@/entities/approval';
import {
  useApproveDeploymentMutation,
  useDeploymentsQuery,
  useRejectDeploymentMutation,
} from '@/entities/deployment';
import { useProjectsQuery } from '@/entities/project';
import { useUsersQuery } from '@/entities/user';
import { getApiErrorMessage } from '@/shared/api/client/client';
import { formatStatus } from '@/shared/lib/format';

export const useApprovals = () => {
  const [selectedRejectApproval, setSelectedRejectApproval] =
    useState<Approval | null>(null);

  const approvalsQuery = useApprovalsQuery({
    status: 'pending',
  });

  const projectsQuery = useProjectsQuery();
  const usersQuery = useUsersQuery();
  const deploymentsQuery = useDeploymentsQuery();

  const approveDeploymentMutation = useApproveDeploymentMutation();
  const rejectDeploymentMutation = useRejectDeploymentMutation();

  const isLoading =
    approvalsQuery.isLoading ||
    projectsQuery.isLoading ||
    usersQuery.isLoading ||
    deploymentsQuery.isLoading;

  const isError =
    approvalsQuery.isError ||
    projectsQuery.isError ||
    usersQuery.isError ||
    deploymentsQuery.isError;

  const error =
    approvalsQuery.error ??
    projectsQuery.error ??
    usersQuery.error ??
    deploymentsQuery.error;

  const isFetching =
    approvalsQuery.isFetching ||
    projectsQuery.isFetching ||
    usersQuery.isFetching ||
    deploymentsQuery.isFetching;

  const refresh = () => {
    approvalsQuery.refetch();
    projectsQuery.refetch();
    usersQuery.refetch();
    deploymentsQuery.refetch();
  };

  const approve = useCallback(
    async (approval: Approval) => {
      try {
        await approveDeploymentMutation.mutateAsync({
          deploymentId: approval.deploymentId,
        });

        toast.success(
          `${formatStatus(approval.environment)} deployment approved successfully`,
        );
      } catch (error) {
        toast.error(getApiErrorMessage(error));
      }
    },
    [approveDeploymentMutation],
  );

  const openRejectDialog = useCallback((approval: Approval) => {
    setSelectedRejectApproval(approval);
  }, []);

  const handleRejectDialogOpenChange = (open: boolean) => {
    if (!open && !rejectDeploymentMutation.isPending) {
      setSelectedRejectApproval(null);
    }
  };

  const reject = async ({
    approval,
    reason,
  }: {
    approval: Approval;
    reason: string;
  }) => {
    setSelectedRejectApproval(null);

    try {
      await rejectDeploymentMutation.mutateAsync({
        deploymentId: approval.deploymentId,
        request: {
          reason,
        },
      });

      toast.success(
        `${formatStatus(approval.environment)} deployment rejected successfully`,
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return {
    approvals: approvalsQuery.data ?? [],
    projects: projectsQuery.data ?? [],
    users: usersQuery.data ?? [],
    deployments: deploymentsQuery.data ?? [],
    selectedRejectApproval,
    approvingDeploymentId: approveDeploymentMutation.variables?.deploymentId,
    rejectingDeploymentId: rejectDeploymentMutation.variables?.deploymentId,
    isApproving: approveDeploymentMutation.isPending,
    isRejecting: rejectDeploymentMutation.isPending,
    isLoading,
    isError,
    isFetching,
    error,
    refresh,
    approve,
    openRejectDialog,
    reject,
    handleRejectDialogOpenChange,
  };
};
