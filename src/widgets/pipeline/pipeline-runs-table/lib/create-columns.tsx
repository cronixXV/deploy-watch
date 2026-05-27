import { Badge, Box, Button, HStack, Text } from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

import type { PipelineRun, User } from '@/shared/api/mocks/model/types/types';
import type { ColumnDef } from '@tanstack/react-table';

import { getUserNameById } from '@/entities/user';
import { formatDate, formatDuration, formatStatus } from '@/shared/lib/format';
import { getStatusColor } from '@/shared/lib/get-color';

type CreatePipelineRunsColumnsParams = {
  projectId: string;
  users: User[];
};

export function createPipelineRunsColumns({
  projectId,
  users,
}: CreatePipelineRunsColumnsParams): ColumnDef<PipelineRun>[] {
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
      accessorKey: 'id',
      header: 'Pipeline ID',
      cell: ({ row }) => (
        <Text fontFamily="mono" fontSize="sm">
          {row.original.id}
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
      accessorKey: 'commitHash',
      header: 'Commit',
      enableSorting: false,
      cell: ({ row }) => (
        <Box maxW="320px">
          <Text fontFamily="mono" fontSize="sm">
            {row.original.commitHash}
          </Text>

          <Text color="gray.500" fontSize="xs" lineClamp={1}>
            {row.original.commitMessage}
          </Text>
        </Box>
      ),
    },
    {
      accessorKey: 'authorId',
      header: 'Author',
      cell: ({ row }) => (
        <Box>
          <Text fontSize="sm" fontWeight="medium">
            {getUserNameById(users, row.original.authorId)}
          </Text>

          <Text color="gray.500" fontSize="xs">
            {row.original.authorId}
          </Text>
        </Box>
      ),
    },
    {
      accessorKey: 'startedAt',
      header: 'Started at',
      sortingFn: (rowA, rowB) => {
        return (
          new Date(rowA.original.startedAt).getTime() -
          new Date(rowB.original.startedAt).getTime()
        );
      },
      cell: ({ row }) => (
        <Text color="gray.600" fontSize="sm">
          {formatDate(row.original.startedAt)}
        </Text>
      ),
    },
    {
      accessorKey: 'durationSec',
      header: 'Duration',
      sortingFn: (rowA, rowB) => {
        return (
          (rowA.original.durationSec ?? 0) - (rowB.original.durationSec ?? 0)
        );
      },
      cell: ({ row }) => (
        <Text color="gray.600" fontSize="sm">
          {formatDuration(row.original.durationSec)}
        </Text>
      ),
    },
    {
      accessorKey: 'environment',
      header: 'Environment',
      cell: ({ row }) =>
        row.original.environment ? (
          <Badge colorPalette="purple" variant="subtle">
            {formatStatus(row.original.environment)}
          </Badge>
        ) : (
          <Text color="gray.400" fontSize="sm">
            —
          </Text>
        ),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: ({ row }) => (
        <HStack justify="flex-end">
          <Button colorPalette="teal" size="sm" variant="ghost" asChild>
            <RouterLink
              to={`/projects/${projectId}/pipelines/${row.original.id}`}
            >
              Open
              <ArrowRight size={16} />
            </RouterLink>
          </Button>
        </HStack>
      ),
    },
  ];
}
