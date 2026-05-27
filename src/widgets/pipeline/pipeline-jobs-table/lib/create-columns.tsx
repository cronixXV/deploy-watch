import { Badge, Button, HStack, Text } from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

import type { Build } from '@/shared/api/mocks/model/types/types';
import type { ColumnDef } from '@tanstack/react-table';

import { formatDate, formatDuration, formatStatus } from '@/shared/lib/format';
import { getStatusColor } from '@/shared/lib/get-color';

type CreatePipelineJobsColumnsParams = {
  projectId: string;
};

export function createPipelineJobsColumns({
  projectId,
}: CreatePipelineJobsColumnsParams): ColumnDef<Build>[] {
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
      accessorKey: 'jobName',
      header: 'Job',
      cell: ({ row }) => (
        <>
          <Text fontWeight="medium">{row.original.jobName}</Text>

          <Text color="gray.500" fontSize="xs">
            {row.original.id}
          </Text>
        </>
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
      accessorKey: 'finishedAt',
      header: 'Finished at',
      sortingFn: (rowA, rowB) => {
        return (
          new Date(rowA.original.finishedAt).getTime() -
          new Date(rowB.original.finishedAt).getTime()
        );
      },
      cell: ({ row }) => (
        <Text color="gray.600" fontSize="sm">
          {formatDate(row.original.finishedAt)}
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
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: ({ row }) => (
        <HStack justify="flex-end">
          <Button colorPalette="teal" size="sm" variant="ghost" asChild>
            <RouterLink to={`/projects/${projectId}/builds/${row.original.id}`}>
              Logs
              <ArrowRight size={16} />
            </RouterLink>
          </Button>
        </HStack>
      ),
    },
  ];
}
