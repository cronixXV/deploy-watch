import { Badge, Box, Text } from '@chakra-ui/react';

import type { PipelineRun } from '@/shared/api/mocks/model/types/types';

import { formatDate, formatDuration, formatStatus } from '@/shared/lib/format';
import { DefaultCard } from '@/shared/ui/default-card/ui/default-card';
import { StatusBadge } from '@/shared/ui/status-badge/ui/status-badge';
import {
  SummaryGrid,
  SummaryGridItem,
} from '@/shared/ui/summary-grid/ui/summary-grid';

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
  <DefaultCard
    title="Pipeline summary"
    description="Commit, author and runtime information."
  >
    <SummaryGrid>
      <SummaryGridItem label="Status">
        <StatusBadge status={pipelineRun?.status} />
      </SummaryGridItem>

      <SummaryGridItem label="Environment">
        <Text>{formatStatus(pipelineRun?.environment)}</Text>
      </SummaryGridItem>

      <SummaryGridItem label="Branch">
        <Badge colorPalette="gray" variant="outline">
          {pipelineRun?.branch ?? '—'}
        </Badge>
      </SummaryGridItem>

      <SummaryGridItem label="Commit">
        <Box>
          <Text fontFamily="mono" fontSize="sm">
            {pipelineRun?.commitHash ?? '—'}
          </Text>

          <Text color="gray.500" fontSize="sm">
            {pipelineRun?.commitMessage ?? '—'}
          </Text>
        </Box>
      </SummaryGridItem>

      <SummaryGridItem label="Author">
        <Text>{authorName}</Text>
      </SummaryGridItem>

      <SummaryGridItem label="Triggered by">
        <Text>{triggeredByName}</Text>
      </SummaryGridItem>

      <SummaryGridItem label="Started at">
        <Text>{formatDate(pipelineRun?.startedAt)}</Text>
      </SummaryGridItem>

      <SummaryGridItem label="Finished at">
        <Text>{formatDate(pipelineRun?.finishedAt)}</Text>
      </SummaryGridItem>

      <SummaryGridItem label="Duration">
        <Text>{formatDuration(pipelineRun?.durationSec)}</Text>
      </SummaryGridItem>
    </SummaryGrid>
  </DefaultCard>
);
