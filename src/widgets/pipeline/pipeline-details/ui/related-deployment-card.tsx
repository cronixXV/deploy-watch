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

import type { Deployment } from '@/shared/api/mocks/model/types/types';

import { getDeploymentStatusColor } from '@/entities/project';
import { formatDate, formatStatus } from '@/shared/lib/format';

type RelatedDeploymentCardProps = {
  projectId: string;
  deployment?: Deployment | null;
};

export const RelatedDeploymentCard = ({
  projectId,
  deployment,
}: RelatedDeploymentCardProps) => (
  <Card.Root bg="white" borderColor="gray.200" shadow="sm">
    <Card.Header>
      <Box>
        <Text fontWeight="semibold">Related deployment</Text>
        <Text color="gray.500" fontSize="sm">
          Deployment connected to this commit.
        </Text>
      </Box>
    </Card.Header>

    <Card.Body>
      {deployment ? (
        <Stack gap="4">
          <HStack justify="space-between">
            <Box>
              <Text fontWeight="medium">{deployment.version}</Text>
              <Text color="gray.500" fontSize="sm">
                {formatStatus(deployment.environment)}
              </Text>
            </Box>

            <Badge
              colorPalette={getDeploymentStatusColor(deployment.status)}
              variant="subtle"
            >
              {formatStatus(deployment.status)}
            </Badge>
          </HStack>

          <Stack gap="2">
            <Text color="gray.500" fontSize="sm">
              Branch: {deployment.branch}
            </Text>
            <Text color="gray.500" fontSize="sm">
              Started: {formatDate(deployment.startedAt)}
            </Text>
            <Text color="gray.500" fontSize="sm">
              Finished: {formatDate(deployment.finishedAt)}
            </Text>
          </Stack>

          <Button size="sm" variant="outline" asChild>
            <RouterLink to={`/projects/${projectId}/deployments`}>
              View deployments
              <ArrowRight size={16} />
            </RouterLink>
          </Button>
        </Stack>
      ) : (
        <Box py="8" textAlign="center">
          <Text color="gray.500" fontSize="sm">
            No related deployment found.
          </Text>
        </Box>
      )}
    </Card.Body>
  </Card.Root>
);
