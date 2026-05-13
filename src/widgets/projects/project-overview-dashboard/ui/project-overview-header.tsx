import { Box, Button, Heading, HStack, Text } from '@chakra-ui/react';
import { RefreshCw } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

import type { Project } from '@/shared/api/mocks/model/types/types';

type ProjectOverviewHeaderProps = {
  project?: Project;
  projectId: string;
  isFetching: boolean;
  onRefresh: () => void;
};

export function ProjectOverviewHeader({
  project,
  projectId,
  isFetching,
  onRefresh,
}: ProjectOverviewHeaderProps) {
  return (
    <HStack align="start" justify="space-between">
      <Box>
        <Heading size="lg">{project?.name}</Heading>

        <Text color="gray.500" mt="2">
          {project?.repository} · default branch: {project?.defaultBranch}
        </Text>
      </Box>

      <HStack gap="2">
        <Button colorPalette="teal" size="sm" variant="outline" asChild>
          <RouterLink to={`/projects/${projectId}/pipelines`}>
            View pipelines
          </RouterLink>
        </Button>

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
    </HStack>
  );
}
