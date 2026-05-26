import { Badge, Box, Button, HStack, Text } from '@chakra-ui/react';
import { RotateCcw } from 'lucide-react';

import type { Deployment, User } from '@/shared/api/mocks/model/types/types';
import type { ColumnDef } from '@tanstack/react-table';

import { getUserNameById } from '@/entities/environment';
import { formatDate, formatStatus } from '@/shared/lib/format';
import { getStatusColor } from '@/shared/lib/get-color';

type CreateDeploymentColumnsParams = {
  users: User[];
  onOpenTimeline: (deployment: Deployment) => void;
  onRollback: (deployment: Deployment) => void;
};

export function createDeploymentColumns({
  users,
  onOpenTimeline,
  onRollback,
}: CreateDeploymentColumnsParams): ColumnDef<Deployment>[] {
  return [
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <Badge colorPalette={getStatusColor(status)} variant="subtle">
            {formatStatus(status)}
          </Badge>
        );
      },
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
      accessorKey: 'version',
      header: 'Version',
      cell: ({ row }) => (
        <Text fontWeight="medium">{row.original.version}</Text>
      ),
    },
    {
      accessorKey: 'commitHash',
      header: 'Commit',
      cell: ({ row }) => (
        <Text fontFamily="mono" fontSize="sm">
          {row.original.commitHash}
        </Text>
      ),
    },
    {
      accessorKey: 'branch',
      header: 'Branch',
      cell: ({ row }) => (
        <Badge colorPalette="gray" variant="outline">
          {row.original.branch}
        </Badge>
      ),
    },
    {
      accessorKey: 'requestedById',
      header: 'Deployed by',
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
      accessorKey: 'startedAt',
      header: 'Started at',
      sortingFn: (rowA, rowB) =>
        new Date(rowA.original.startedAt).getTime() -
        new Date(rowB.original.startedAt).getTime(),
      cell: ({ row }) => (
        <Text color="gray.600" fontSize="sm">
          {formatDate(row.original.startedAt)}
        </Text>
      ),
    },
    {
      accessorKey: 'finishedAt',
      header: 'Finished at',
      sortingFn: (rowA, rowB) =>
        new Date(rowA.original.finishedAt ?? 0).getTime() -
        new Date(rowB.original.finishedAt ?? 0).getTime(),
      cell: ({ row }) => (
        <Text color="gray.600" fontSize="sm">
          {formatDate(row.original.finishedAt)}
        </Text>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: ({ row }) => {
        const deployment = row.original;

        const canRollback =
          deployment.status === 'deployed' || deployment.status === 'failed';

        return (
          <HStack justify="flex-end">
            <Button
              colorPalette="teal"
              size="sm"
              variant="ghost"
              onClick={() => onOpenTimeline(deployment)}
            >
              Timeline
            </Button>

            <Button
              colorPalette="red"
              disabled={!canRollback}
              size="sm"
              variant="ghost"
              onClick={() => onRollback(deployment)}
            >
              <RotateCcw size={16} />
              Rollback
            </Button>
          </HStack>
        );
      },
    },
  ];
}
