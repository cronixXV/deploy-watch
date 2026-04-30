import { Box, Button, Heading, HStack, Text } from '@chakra-ui/react';
import { RefreshCw } from 'lucide-react';

import type { Project } from '@/shared/api/mocks/model/types/types';

type ProjectOverviewHeaderProps = {
  project?: Project;
  isFetching: boolean;
  onRefresh: () => void;
};

export const ProjectOverviewHeader = ({
  project,
  isFetching,
  onRefresh,
}: ProjectOverviewHeaderProps) => {
  return (
    <HStack align="start" justify="space-between">
      <Box>
        <Heading size="lg">{project?.name}</Heading>

        <Text color="gray.500" mt="2">
          {project?.repository} · default branch: {project?.defaultBranch}
        </Text>
      </Box>

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
};
