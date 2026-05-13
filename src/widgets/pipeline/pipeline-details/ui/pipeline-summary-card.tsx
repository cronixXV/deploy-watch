import { Badge, Box, Card, DataList, Text } from '@chakra-ui/react';

import type { PipelineRun } from '@/shared/api/mocks/model/types/types';

import { getPipelineStatusColor } from '@/entities/project';
import { formatDate, formatDuration, formatStatus } from '@/shared/lib/format';

type PipelineSummaryCardProps = {
  pipelineRun?: PipelineRun;
  authorName: string;
  triggeredByName: string;
};

export const PipelineSummaryCard = ({
  pipelineRun,
  authorName,
  triggeredByName,
}: PipelineSummaryCardProps) => (
  <Card.Root bg="white" borderColor="gray.200" shadow="sm">
    <Card.Header>
      <Box>
        <Text fontWeight="semibold">Pipeline summary</Text>
        <Text color="gray.500" fontSize="sm">
          Commit, author and runtime information.
        </Text>
      </Box>
    </Card.Header>

    <Card.Body>
      <DataList.Root
        orientation="vertical"
        gap="4"
        display="grid"
        gridTemplateColumns={{
          base: '1fr',
          md: 'repeat(2, minmax(0, 1fr))',
        }}
      >
        <DataList.Item>
          <DataList.ItemLabel>Status</DataList.ItemLabel>
          <DataList.ItemValue>
            {pipelineRun?.status && (
              <Badge
                colorPalette={getPipelineStatusColor(pipelineRun.status)}
                variant="subtle"
              >
                {formatStatus(pipelineRun.status)}
              </Badge>
            )}
          </DataList.ItemValue>
        </DataList.Item>

        <DataList.Item>
          <DataList.ItemLabel>Environment</DataList.ItemLabel>
          <DataList.ItemValue>
            <Text>{formatStatus(pipelineRun?.environment)}</Text>
          </DataList.ItemValue>
        </DataList.Item>

        <DataList.Item>
          <DataList.ItemLabel>Branch</DataList.ItemLabel>
          <DataList.ItemValue>
            <Badge colorPalette="gray" variant="outline">
              {pipelineRun?.branch}
            </Badge>
          </DataList.ItemValue>
        </DataList.Item>

        <DataList.Item>
          <DataList.ItemLabel>Commit</DataList.ItemLabel>
          <DataList.ItemValue>
            <Box>
              <Text fontFamily="mono" fontSize="sm">
                {pipelineRun?.commitHash}
              </Text>
              <Text color="gray.500" fontSize="sm">
                {pipelineRun?.commitMessage}
              </Text>
            </Box>
          </DataList.ItemValue>
        </DataList.Item>

        <DataList.Item>
          <DataList.ItemLabel>Author</DataList.ItemLabel>
          <DataList.ItemValue>
            <Text>{authorName}</Text>
          </DataList.ItemValue>
        </DataList.Item>

        <DataList.Item>
          <DataList.ItemLabel>Triggered by</DataList.ItemLabel>
          <DataList.ItemValue>
            <Text>{triggeredByName}</Text>
          </DataList.ItemValue>
        </DataList.Item>

        <DataList.Item>
          <DataList.ItemLabel>Started at</DataList.ItemLabel>
          <DataList.ItemValue>
            <Text>{formatDate(pipelineRun?.startedAt)}</Text>
          </DataList.ItemValue>
        </DataList.Item>

        <DataList.Item>
          <DataList.ItemLabel>Finished at</DataList.ItemLabel>
          <DataList.ItemValue>
            <Text>{formatDate(pipelineRun?.finishedAt)}</Text>
          </DataList.ItemValue>
        </DataList.Item>

        <DataList.Item>
          <DataList.ItemLabel>Duration</DataList.ItemLabel>
          <DataList.ItemValue>
            <Text>{formatDuration(pipelineRun?.durationSec)}</Text>
          </DataList.ItemValue>
        </DataList.Item>
      </DataList.Root>
    </Card.Body>
  </Card.Root>
);
