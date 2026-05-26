import {
  Box,
  Button,
  HStack,
  NativeSelect,
  Table,
  Text,
} from '@chakra-ui/react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { createPipelineRunsColumns } from '../lib/create-columns';

import type { PipelineRun, User } from '@/shared/api/mocks/model/types/types';

import { getSortIcon } from '@/shared/lib/get-sort-icon';

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
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'startedAt',
      desc: true,
    },
  ]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

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
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Box
      rounded="xl"
      borderWidth="1px"
      borderColor="gray.200"
      bg="white"
      shadow="sm"
      overflow="hidden"
    >
      <Box overflowX="auto">
        <Table.Root size="sm" variant="line">
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortDirection = header.column.getIsSorted();

                  return (
                    <Table.ColumnHeader key={header.id} whiteSpace="nowrap">
                      {header.isPlaceholder ? null : canSort ? (
                        <Button
                          colorPalette="gray"
                          size="xs"
                          variant="ghost"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {getSortIcon(sortDirection)}
                        </Button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </Table.ColumnHeader>
                  );
                })}
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

      <HStack
        justify="space-between"
        borderTopWidth="1px"
        borderColor="gray.200"
        px="4"
        py="3"
      >
        <HStack gap="3">
          <Text color="gray.500" fontSize="sm">
            Rows per page
          </Text>

          <NativeSelect.Root size="sm" w="84px">
            <NativeSelect.Field
              value={table.getState().pagination.pageSize}
              onChange={(event) => {
                table.setPageSize(Number(event.target.value));
              }}
            >
              {[5, 10, 20, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </HStack>

        <HStack gap="3">
          <Text color="gray.500" fontSize="sm">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </Text>

          <HStack gap="1">
            <Button
              aria-label="First page"
              disabled={!table.getCanPreviousPage()}
              size="sm"
              variant="ghost"
              onClick={() => table.firstPage()}
            >
              <ChevronsLeft size={16} />
            </Button>

            <Button
              aria-label="Previous page"
              disabled={!table.getCanPreviousPage()}
              size="sm"
              variant="ghost"
              onClick={() => table.previousPage()}
            >
              <ChevronLeft size={16} />
            </Button>

            <Button
              aria-label="Next page"
              disabled={!table.getCanNextPage()}
              size="sm"
              variant="ghost"
              onClick={() => table.nextPage()}
            >
              <ChevronRight size={16} />
            </Button>

            <Button
              aria-label="Last page"
              disabled={!table.getCanNextPage()}
              size="sm"
              variant="ghost"
              onClick={() => table.lastPage()}
            >
              <ChevronsRight size={16} />
            </Button>
          </HStack>
        </HStack>
      </HStack>
    </Box>
  );
}
