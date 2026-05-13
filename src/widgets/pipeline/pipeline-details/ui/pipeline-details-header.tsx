import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

import type { PipelineRun } from '@/shared/api/mocks/model/types/types';

import { getPipelineStatusColor } from '@/entities/project';
import { formatStatus } from '@/shared/lib/format';

type PipelineDetailsHeaderProps = {
  projectId: string;
  pipelineRun?: PipelineRun;
  isFetching: boolean;
  onRefresh: () => void;
};

export const PipelineDetailsHeader = ({
  projectId,
  pipelineRun,
  isFetching,
  onRefresh,
}: PipelineDetailsHeaderProps) => (
  <HStack justify="space-between" align="start">
    <Stack gap="2">
      <Button size="sm" variant="ghost" asChild alignSelf="flex-start">
        <RouterLink to={`/projects/${projectId}/pipelines`}>
          <ArrowLeft size={16} />
          Back to pipelines
        </RouterLink>
      </Button>

      <Box>
        <HStack gap="3" align="center">
          <Heading size="lg">Pipeline {pipelineRun?.id}</Heading>

          {pipelineRun?.status && (
            <Badge
              colorPalette={getPipelineStatusColor(pipelineRun.status)}
              variant="subtle"
            >
              {formatStatus(pipelineRun.status)}
            </Badge>
          )}
        </HStack>

        <Text color="gray.500" mt="2">
          {pipelineRun?.branch} · {pipelineRun?.commitHash}
        </Text>
      </Box>
    </Stack>

    <Button
      colorPalette="teal"
      loading={isFetching}
      size="sm"
      variant="outline"
      onClick={onRefresh}
    >
      <RefreshCw size={16} />
      Refresh
    </Button>
  </HStack>
);
