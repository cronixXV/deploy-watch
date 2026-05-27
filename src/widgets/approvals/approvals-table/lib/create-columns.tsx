import { Badge, Box, Button, HStack, Text } from '@chakra-ui/react';
import { Check, X } from 'lucide-react';

import type {
  Approval,
  Deployment,
  Project,
  User,
} from '@/shared/api/mocks/model/types/types';
import type { ColumnDef } from '@tanstack/react-table';

import { getProjectNameById } from '@/entities/project';
import { getUserNameById } from '@/entities/user';
import { formatDate, formatStatus } from '@/shared/lib/format';
import { getRiskColor, getStatusColor } from '@/shared/lib/get-color';

type CreateApprovalColumnsParams = {
  projects: Project[];
  users: User[];
  deployments: Deployment[];
  approvingDeploymentId?: string;
  isApproving?: boolean;
  rejectingDeploymentId?: string;
  isRejecting?: boolean;
  onApprove: (approval: Approval) => void;
  onReject: (approval: Approval) => void;
};

export function createApprovalColumns({
  projects,
  users,
  deployments,
  approvingDeploymentId,
  isApproving,
  rejectingDeploymentId,
  isRejecting,
  onApprove,
  onReject,
}: CreateApprovalColumnsParams): ColumnDef<Approval>[] {
  return [
    {
      accessorKey: 'projectId',
      header: 'Project',
      cell: ({ row }) => (
        <Box>
          <Text fontSize="sm" fontWeight="medium">
            {getProjectNameById(projects, row.original.projectId)}
          </Text>

          <Text color="gray.500" fontSize="xs">
            {row.original.projectId}
          </Text>
        </Box>
      ),
    },
    {
      accessorKey: 'environment',
      header: 'Environment',
      cell: ({ row }) => (
        <Badge colorPalette="purple" variant="subtle">
          {formatStatus(row.original.environment)}
        </Badge>
      ),
    },
    {
      accessorKey: 'deploymentId',
      header: 'Version',
      cell: ({ row }) => (
        <Text fontFamily="mono" fontSize="sm">
          {row.original.deploymentId}
        </Text>
      ),
    },
    {
      id: 'branch',
      header: 'Branch',
      cell: ({ row }) => {
        const deployment = deployments.find(
          (deployment) => deployment.id === row.original.deploymentId,
        );

        return (
          <Text color="gray.500" fontSize="sm">
            {deployment?.branch ?? '—'}
          </Text>
        );
      },
    },
    {
      accessorKey: 'requestedById',
      header: 'Requested by',
      cell: ({ row }) => (
        <Box>
          <Text fontSize="sm" fontWeight="medium">
            {getUserNameById(users, row.original.requestedById)}
          </Text>

          <Text color="gray.500" fontSize="xs">
            {row.original.requestedById}
          </Text>
        </Box>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created at',
      sortingFn: (rowA, rowB) =>
        new Date(rowA.original.createdAt).getTime() -
        new Date(rowB.original.createdAt).getTime(),
      cell: ({ row }) => (
        <Text color="gray.600" fontSize="sm">
          {formatDate(row.original.createdAt)}
        </Text>
      ),
    },
    {
      accessorKey: 'riskLevel',
      header: 'Risk level',
      cell: ({ row }) => (
        <Badge
          colorPalette={getRiskColor(row.original.riskLevel)}
          variant="subtle"
        >
          {formatStatus(row.original.riskLevel)}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          colorPalette={getStatusColor(row.original.status)}
          variant="subtle"
        >
          {formatStatus(row.original.status)}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: ({ row }) => {
        const approval = row.original;

        const isCurrentApproving =
          isApproving && approvingDeploymentId === approval.deploymentId;

        const isCurrentRejecting =
          isRejecting && rejectingDeploymentId === approval.deploymentId;

        const isActionPending = Boolean(isApproving || isRejecting);

        return (
          <HStack justify="flex-end">
            <Button
              colorPalette="green"
              disabled={isActionPending && !isCurrentApproving}
              loading={isCurrentApproving}
              size="sm"
              variant="ghost"
              onClick={() => onApprove(approval)}
            >
              <Check size={16} />
              Approve
            </Button>

            <Button
              colorPalette="red"
              disabled={isActionPending && !isCurrentRejecting}
              loading={isCurrentRejecting}
              size="sm"
              variant="ghost"
              onClick={() => onReject(approval)}
            >
              <X size={16} />
              Reject
            </Button>
          </HStack>
        );
      },
    },
  ];
}
