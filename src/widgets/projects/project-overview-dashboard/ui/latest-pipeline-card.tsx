import { Box, Button, HStack, Stack, Text } from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

import type { PipelineRun } from '@/shared/api/mocks/model/types/types';

import { formatDate } from '@/shared/lib/format';
import { DefaultCard } from '@/shared/ui/default-card/ui/default-card';
import { StatusBadge } from '@/shared/ui/status-badge/ui/status-badge';

type LatestPipelineCardProps = {
  projectId: string;
  pipeline?: PipelineRun;
};

export const LatestPipelineCard = ({
  projectId,
  pipeline,
}: LatestPipelineCardProps) => (
  <DefaultCard>
    <Stack gap="3">
      <Text color="gray.500" fontSize="sm" fontWeight="medium">
        Latest pipeline
      </Text>

      <HStack justify="space-between">
        <Box>
          <Text fontSize="lg" fontWeight="semibold">
            {pipeline?.branch ?? 'No pipeline runs'}
          </Text>

          <Text color="gray.500" fontSize="sm">
            {pipeline?.commitHash ?? '—'} · {formatDate(pipeline?.startedAt)}
          </Text>
        </Box>

        <StatusBadge status={pipeline?.status} />
      </HStack>

      {pipeline && (
        <Button colorPalette="teal" size="sm" variant="ghost" asChild>
          <RouterLink to={`/projects/${projectId}/pipelines/${pipeline.id}`}>
            Open pipeline
            <ArrowRight size={16} />
          </RouterLink>
        </Button>
      )}
    </Stack>
  </DefaultCard>
);
