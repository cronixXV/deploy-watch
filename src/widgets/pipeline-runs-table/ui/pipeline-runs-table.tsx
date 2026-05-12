import { Box, Table } from '@chakra-ui/react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';

import { createPipelineRunsColumns } from '../lib/create-columns';

import type { PipelineRun, User } from '@/shared/api/mocks/model/types/types';

type PipelineRunsTableProps = {
  projectId: string;
  pipelineRuns: PipelineRun[];
  users: User[];
};
export function PipelineRunsTable({
  projectId,
  pipelineRuns,
  users,
}: PipelineRunsTableProps) {
  'use no memo';

  const columns = useMemo(
    () =>
      createPipelineRunsColumns({
        projectId,
        users,
      }),
    [projectId, users],
  );

  const table = useReactTable({
    data: pipelineRuns,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Box
      overflowX="auto"
      rounded="xl"
      borderWidth="1px"
      borderColor="gray.200"
      bg="white"
      shadow="sm"
    >
      <Table.Root size="sm" variant="line">
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.ColumnHeader key={header.id} whiteSpace="nowrap">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          ))}
        </Table.Header>

        <Table.Body>
          {table.getRowModel().rows.map((row) => (
            <Table.Row key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Table.Cell key={cell.id} verticalAlign="top">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
