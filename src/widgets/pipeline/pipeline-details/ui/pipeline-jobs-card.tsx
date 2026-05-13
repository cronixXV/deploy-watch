import { Box, Card, Text } from '@chakra-ui/react';

import { PipelineJobsTable } from '../../pipeline-jobs-table/ui/pipeline-jobs-table';

import type { Build } from '@/shared/api/mocks/model/types/types';

type PipelineJobsCardProps = {
  projectId: string;
  jobs: Build[];
};

export const PipelineJobsCard = ({
  jobs,
  projectId,
}: PipelineJobsCardProps) => (
  <Card.Root bg="white" borderColor="gray.200" shadow="sm">
    <Card.Header>
      <Box>
        <Text fontWeight="semibold">Jobs</Text>
        <Text color="gray.500" fontSize="sm">
          Pipeline jobs and their execution status.
        </Text>
      </Box>
    </Card.Header>

    <Card.Body>
      {jobs.length ? (
        <PipelineJobsTable jobs={jobs} projectId={projectId} />
      ) : (
        <Box py="8" textAlign="center">
          <Text color="gray.500" fontSize="sm">
            No jobs found for this pipeline.
          </Text>
        </Box>
      )}
    </Card.Body>
  </Card.Root>
);
