import { useState } from 'react';

import type { Deployment } from '@/shared/api/mocks/model/types/types';

import {
  useProjectDeploymentsQuery,
  useRollbackDeploymentMutation,
} from '@/entities/deployment';
import { useProjectQuery } from '@/entities/project';
import { useUsersQuery } from '@/entities/user';
import { useAppToast } from '@/shared/hooks/use-app-toast';
import { formatStatus } from '@/shared/lib/format';

type UseDeploymentsParams = {
  projectId?: string;
};

export const useDeployments = ({ projectId }: UseDeploymentsParams) => {
  const [selectedTimelineDeployment, setSelectedTimelineDeployment] =
    useState<Deployment | null>(null);

  const [selectedRollbackDeployment, setSelectedRollbackDeployment] =
    useState<Deployment | null>(null);

  const appToast = useAppToast();
  const projectQuery = useProjectQuery(projectId);
  const deploymentsQuery = useProjectDeploymentsQuery({
    projectId,
  });
  const usersQuery = useUsersQuery();

  const rollbackMutation = useRollbackDeploymentMutation();

  const isLoading =
    projectQuery.isLoading ||
    deploymentsQuery.isLoading ||
    usersQuery.isLoading;

  const isError =
    projectQuery.isError || deploymentsQuery.isError || usersQuery.isError;

  const error =
    projectQuery.error ?? deploymentsQuery.error ?? usersQuery.error;

  const isFetching =
    projectQuery.isFetching ||
    deploymentsQuery.isFetching ||
    usersQuery.isFetching;

  const refresh = () => {
    projectQuery.refetch();
    deploymentsQuery.refetch();
    usersQuery.refetch();
  };

  const openTimeline = (deployment: Deployment) => {
    setSelectedTimelineDeployment(deployment);
  };

  const handleTimelineOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedTimelineDeployment(null);
    }
  };

  const openRollbackConfirm = (deployment: Deployment) => {
    setSelectedRollbackDeployment(deployment);
  };

  const handleRollbackConfirmOpenChange = (open: boolean) => {
    if (!open && !rollbackMutation.isPending) {
      setSelectedRollbackDeployment(null);
    }
  };

  const confirmRollback = async () => {
    if (!selectedRollbackDeployment) {
      return;
    }

    try {
      await rollbackMutation.mutateAsync({
        deploymentId: selectedRollbackDeployment.id,
      });

      appToast.success(
        `Rollback started for ${formatStatus(
          selectedRollbackDeployment.environment,
        )}`,
      );

      setSelectedRollbackDeployment(null);
    } catch (error) {
      appToast.errorFromUnknown(error);
    }
  };

  return {
    project: projectQuery.data,
    deployments: deploymentsQuery.data ?? [],
    users: usersQuery.data ?? [],

    selectedTimelineDeployment,
    selectedRollbackDeployment,

    isLoading,
    isError,
    isFetching,
    error,

    isRollbackPending: rollbackMutation.isPending,

    refresh,
    openTimeline,
    handleTimelineOpenChange,
    openRollbackConfirm,
    handleRollbackConfirmOpenChange,
    confirmRollback,
  };
};
