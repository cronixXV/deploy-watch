import { Box, Button, Heading, HStack, Text } from '@chakra-ui/react';
import { RefreshCw } from 'lucide-react';

type PipelineRunsHeaderProps = {
  projectName?: string;
  repository?: string;
  isFetching: boolean;
  onRefresh: () => void;
};

export const PipelineRunsHeader = ({
  projectName,
  repository,
  isFetching,
  onRefresh,
}: PipelineRunsHeaderProps) => {
  const description =
    projectName && repository
      ? `${projectName} · ${repository}`
      : 'Pipeline runs history.';

  return (
    <HStack align="start" justify="space-between">
      <Box>
        <Heading size="lg">Pipeline runs</Heading>

        <Text color="gray.500" mt="2">
          {description}
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
