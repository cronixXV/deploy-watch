import { Box, Button, Heading, HStack, Text } from '@chakra-ui/react';
import { RefreshCw } from 'lucide-react';

type EnvironmentsHeaderProps = {
  projectName?: string;
  isFetching: boolean;
  onRefresh: () => void;
};

export const EnvironmentsHeader = ({
  projectName,
  isFetching,
  onRefresh,
}: EnvironmentsHeaderProps) => {
  return (
    <HStack align="start" justify="space-between">
      <Box>
        <Heading size="lg">Environments</Heading>

        <Text color="gray.500" mt="2">
          {projectName
            ? `${projectName} · runtime status across deployment targets.`
            : 'Runtime status across deployment targets.'}
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
