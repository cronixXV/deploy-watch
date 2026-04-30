import {
  Badge,
  Box,
  Button,
  Card,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

import type { PipelineRun } from '@/shared/api/mocks/model/types/types';

import { getPipelineStatusColor } from '@/entities/project';
import { formatDate, formatStatus } from '@/shared/lib/format';

type LatestPipelineCardProps = {
  projectId: string;
  pipeline?: PipelineRun;
};

export const LatestPipelineCard = ({
  projectId,
  pipeline,
}: LatestPipelineCardProps) => {
  return (
    <Card.Root bg="white" borderColor="gray.200" shadow="sm">
      <Card.Body>
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
                {pipeline?.commitHash ?? '—'} ·{' '}
                {formatDate(pipeline?.startedAt)}
              </Text>
            </Box>

            <Badge
              colorPalette={getPipelineStatusColor(pipeline?.status)}
              variant="subtle"
            >
              {formatStatus(pipeline?.status)}
            </Badge>
          </HStack>

          {pipeline && (
            <Button colorPalette="teal" size="sm" variant="ghost" asChild>
              <RouterLink
                to={`/projects/${projectId}/pipelines/${pipeline.id}`}
              >
                Open pipeline
                <ArrowRight size={16} />
              </RouterLink>
            </Button>
          )}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
