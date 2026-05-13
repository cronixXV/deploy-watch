import { Badge, Box, Button, HStack, Table, Text } from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

import type { Build } from '@/shared/api/mocks/model/types/types';

import { getBuildStatusColor } from '@/entities/project';
import { formatDate, formatDuration, formatStatus } from '@/shared/lib/format';

type PipelineJobsTableProps = {
  projectId: string;
  jobs: Build[];
};

export function PipelineJobsTable({ projectId, jobs }: PipelineJobsTableProps) {
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
          <Table.Row>
            <Table.ColumnHeader>Status</Table.ColumnHeader>
            <Table.ColumnHeader>Job</Table.ColumnHeader>
            <Table.ColumnHeader>Started at</Table.ColumnHeader>
            <Table.ColumnHeader>Finished at</Table.ColumnHeader>
            <Table.ColumnHeader>Duration</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {jobs.map((job) => (
            <Table.Row key={job.id}>
              <Table.Cell>
                <Badge
                  colorPalette={getBuildStatusColor(job.status)}
                  variant="subtle"
                >
                  {formatStatus(job.status)}
                </Badge>
              </Table.Cell>

              <Table.Cell>
                <Text fontWeight="medium">{job.jobName}</Text>
                <Text color="gray.500" fontSize="xs">
                  {job.id}
                </Text>
              </Table.Cell>

              <Table.Cell>
                <Text color="gray.600" fontSize="sm">
                  {formatDate(job.startedAt)}
                </Text>
              </Table.Cell>

              <Table.Cell>
                <Text color="gray.600" fontSize="sm">
                  {formatDate(job.finishedAt)}
                </Text>
              </Table.Cell>

              <Table.Cell>
                <Text color="gray.600" fontSize="sm">
                  {formatDuration(job.durationSec)}
                </Text>
              </Table.Cell>

              <Table.Cell>
                <HStack justify="flex-end">
                  <Button colorPalette="teal" size="sm" variant="ghost" asChild>
                    <RouterLink to={`/projects/${projectId}/builds/${job.id}`}>
                      Open logs
                      <ArrowRight size={16} />
                    </RouterLink>
                  </Button>
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
